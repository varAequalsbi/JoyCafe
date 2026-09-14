import pg from 'pg';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';

let pool;
const drinks = ['Tubruk', 'Tubruk Filter', 'Original Tea'];
function validate(body) {
  const row = { fullName:String(body.fullName || '').trim(), displayName:String(body.displayName || '').trim(), whatsapp:String(body.whatsapp || '').replace(/\D/g,'').replace(/^0/,'62'), drink:body.drink };
  if (!row.fullName || row.fullName.length>100 || !row.displayName || row.displayName.length>22 || !/^62\d{8,13}$/.test(row.whatsapp) || !drinks.includes(row.drink) || body.consent!==true) throw new Error('Periksa nama, nomor WhatsApp, minuman, dan persetujuan.');
  return row;
}
const makeRow = body => ({...validate(body), id:randomUUID(),code:`CG-${randomBytes(4).toString('hex').toUpperCase()}`,status:'pending',createdAt:new Date().toISOString()});

// A single locked event row makes capacity, PIN attempts and sessions atomic
// across all serverless instances. The database is never exposed to the client.
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  const send=(status,data)=>res.status(status).json(data);
  const path = new URL(req.url,'https://joycafe.biz.id').pathname.replace(/^\/api\/card-game\/?/,'');
  const method=req.method;
  if(method!=='GET') {
    const allowed=new Set(['https://joycafe.biz.id','https://www.joycafe.biz.id',...(process.env.VERCEL_URL?[`https://${process.env.VERCEL_URL}`]:[])]);
    if(!allowed.has(req.headers.origin)) return send(403,{error:'Permintaan tidak diizinkan.'});
    if(!String(req.headers['content-type']).startsWith('application/json')) return send(415,{error:'Format tidak didukung.'});
  }
  let body=req.body || {};
  try {if(typeof body==='string') body=JSON.parse(body);}catch{return send(400,{error:'Data tidak valid.'});}
  if(JSON.stringify(body).length>16000) return send(413,{error:'Data terlalu besar.'});
  let client;
  try {
    pool ||= new pg.Pool({connectionString:process.env.DATABASE_URL,max:2,connectionTimeoutMillis:10000,idleTimeoutMillis:20000});
    client=await pool.connect();
    await client.query('BEGIN');
    const result=await client.query('SELECT data FROM joy_card_event WHERE id=1 FOR UPDATE');
    if(!result.rows.length) throw new Error('Event not initialized');
    const state=result.rows[0].data;
    const now=Date.now();
    state.sessions ||= {};
    for(const [token,expiry] of Object.entries(state.sessions)) if(expiry<=now) delete state.sessions[token];
    const cookie=(req.headers.cookie || '').split(';').map(x=>x.trim()).find(x=>x.startsWith('joy_manager='))?.slice(12);
    const authenticated=Boolean(cookie && Object.hasOwn(state.sessions,cookie));
    const finish=async(status,data)=>{
      await client.query('UPDATE joy_card_event SET data=$1::jsonb WHERE id=1',[JSON.stringify(state)]);
      await client.query('COMMIT');return send(status,data);
    };
    if(path.startsWith('admin/') && !authenticated) return await finish(401,{error:'Masukkan PIN untuk membuka panel.'});
    if(path==='seats' && method==='GET') return await finish(200,state.registrations.map(({id,displayName,status})=>({id,displayName,status})));
    if(path==='session' && method==='GET') return await finish(200,{authenticated});
    if(path==='login' && method==='POST') {
      if(state.lockedUntil>now) {
        res.setHeader('Retry-After',Math.ceil((state.lockedUntil-now)/1000));
        return await finish(429,{error:'Panel terkunci. Tunggu sebelum mencoba lagi.',retryAt:state.lockedUntil});
      }
      if(state.lockedUntil) {state.failures=0;state.lockedUntil=0;}
      const pin=typeof body.pin==='string'?body.pin:'';
      const matches=/^\d{8}$/.test(pin) && timingSafeEqual(scryptSync(pin,state.salt,32),Buffer.from(state.hash,'hex'));
      if(!matches) {
        state.failures++;
        if(state.failures>=5) state.lockedUntil=now+15*60*1000;
        return await finish(state.lockedUntil?429:401,{error:state.lockedUntil?'Panel terkunci selama 15 menit.':`PIN salah. ${5-state.failures} percobaan tersisa.`,retryAt:state.lockedUntil});
      }
      state.failures=0;state.lockedUntil=0;
      if(cookie) delete state.sessions[cookie];
      const token=randomBytes(32).toString('hex');state.sessions[token]=now+30*60*1000;
      res.setHeader('Set-Cookie',`joy_manager=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/card-game; Max-Age=1800`);
      return await finish(200,{authenticated:true});
    }
    if(path==='logout' && method==='POST') {
      if(cookie) delete state.sessions[cookie];
      res.setHeader('Set-Cookie','joy_manager=; HttpOnly; Secure; SameSite=Strict; Path=/api/card-game; Max-Age=0');
      return await finish(200,{ok:true});
    }
    if(path==='register' && method==='POST') {
      let row;try{row=makeRow(body);}catch(e){return await finish(400,{error:e.message});}
      if(state.registrations.length>=8) return await finish(409,{error:'Semua kursi sudah terisi.'});
      if(state.registrations.some(r=>r.whatsapp===row.whatsapp)) return await finish(409,{error:'Nomor WhatsApp sudah terdaftar.'});
      state.registrations.push(row);return await finish(201,row);
    }
    if(path==='admin/registrations' && method==='GET') return await finish(200,state.registrations);
    if(path==='admin/registrations' && method==='DELETE') {state.registrations=[];return await finish(200,{ok:true});}
    if(path==='admin/import' && method==='POST') {
      if(!Array.isArray(body.rows) || body.rows.length>8 || state.registrations.length) return await finish(409,{error:'Impor hanya tersedia ketika daftar server kosong.'});
      let rows;try{rows=body.rows.map(r=>({...makeRow({...r,consent:true}),status:r.status==='confirmed'?'confirmed':'pending'}));}catch(e){return await finish(400,{error:e.message});}
      if(new Set(rows.map(r=>r.whatsapp)).size!==rows.length) return await finish(400,{error:'Nomor WhatsApp duplikat.'});
      state.registrations=rows;return await finish(200,{ok:true});
    }
    const match=path.match(/^admin\/registrations\/([a-f0-9-]+)$/);
    if(match && ['PATCH','DELETE'].includes(method)) {
      const row=state.registrations.find(r=>r.id===match[1]);
      if(!row) return await finish(404,{error:'Pendaftaran tidak ditemukan.'});
      if(method==='DELETE') state.registrations=state.registrations.filter(r=>r!==row);
      else {if(!['pending','confirmed'].includes(body.status)) return await finish(400,{error:'Status tidak valid.'});row.status=body.status;}
      return await finish(200,{ok:true});
    }
    return await finish(404,{error:'Tidak ditemukan.'});
  } catch(error) {
    if(client) await client.query('ROLLBACK').catch(()=>{});
    console.error('Card game request failed:',error.code || error.name);
    return send(503,{error:'Layanan sementara tidak tersedia. Silakan coba lagi.'});
  } finally {client?.release();}
}
