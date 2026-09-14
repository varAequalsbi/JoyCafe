import { randomBytes, randomInt, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export function createCardGameHandler(directory = join(homedir(), '.joycafe-private', 'card-game')) {
  mkdirSync(directory, { recursive: true });
  const file = join(directory, 'store.json');
  if (!existsSync(file)) {
    const pin = String(randomInt(10000000, 100000000));
    const salt = randomBytes(16).toString('hex');
    writeFileSync(join(directory, 'manager-pin.txt'), pin + '\n', { mode: 0o600 });
    writeFileSync(file, JSON.stringify({ salt, hash: scryptSync(pin, salt, 32).toString('hex'), failures: 0, lockedUntil: 0, registrations: [] }), { mode: 0o600 });
  }
  const state = JSON.parse(readFileSync(file, 'utf8'));
  const sessions = new Map();
  const save = () => { writeFileSync(file + '.next', JSON.stringify(state), { mode: 0o600 }); renameSync(file + '.next', file); };
  const publicRows = () => state.registrations.map(({ id, displayName, status }) => ({ id, displayName, status }));
  const valid = body => {
    const row = { fullName: String(body.fullName || '').trim(), displayName: String(body.displayName || '').trim(), whatsapp: String(body.whatsapp || '').replace(/\D/g, '').replace(/^0/, '62'), drink: body.drink };
    if (!row.fullName || row.fullName.length > 100 || !row.displayName || row.displayName.length > 22 || !/^62\d{8,13}$/.test(row.whatsapp) || !['Tubruk','Tubruk Filter','Original Tea'].includes(row.drink) || body.consent !== true) throw new Error('Periksa nama, nomor WhatsApp, minuman, dan persetujuan.');
    return row;
  };
  return async (req, res, next) => {
    const path = (req.url || '').split('?')[0];
    if (!path.startsWith('/api/card-game/')) return next();
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
    const cookie = (req.headers.cookie || '').split(';').map(x=>x.trim()).find(x=>x.startsWith('joy_manager='))?.slice(12);
    const now = Date.now();
    for (const [key, expiry] of sessions) if (expiry <= now) sessions.delete(key);
    const authenticated = sessions.has(cookie);
    const origin = req.headers.origin;
    if (req.method !== 'GET' && origin !== `http://${req.headers.host}`) return send(403, { error: 'Permintaan tidak diizinkan.' });
    if (path.startsWith('/api/card-game/admin/') && !authenticated) return send(401, { error: 'Masukkan PIN untuk membuka panel.' });
    let body = {};
    try {
      if (req.method !== 'GET') {
        if (!String(req.headers['content-type']).startsWith('application/json')) return send(415, { error: 'Format tidak didukung.' });
        let raw = '';
        for await (const chunk of req) { raw += chunk; if (raw.length > 16000) return send(413, {error:'Data terlalu besar.'}); }
        body = JSON.parse(raw || '{}');
      }
      if (path === '/api/card-game/seats' && req.method === 'GET') return send(200, publicRows());
      if (path === '/api/card-game/session' && req.method === 'GET') return send(200, { authenticated });
      if (path === '/api/card-game/login' && req.method === 'POST') {
        if (state.lockedUntil > now) { res.setHeader('Retry-After', Math.ceil((state.lockedUntil-now)/1000)); return send(429, { error: 'Terlalu banyak percobaan. Coba lagi setelah 15 menit.', retryAt:state.lockedUntil }); }
        if (state.lockedUntil) { state.failures = 0; state.lockedUntil = 0; }
        const pin = typeof body.pin === 'string' ? body.pin : '';
        const matches = /^\d{8}$/.test(pin) && timingSafeEqual(scryptSync(pin, state.salt, 32), Buffer.from(state.hash,'hex'));
        if (!matches) {
          state.failures++;
          if (state.failures >= 5) state.lockedUntil = now + 15*60*1000;
          save();
          return send(state.lockedUntil ? 429 : 401, { error:state.lockedUntil ? 'Panel terkunci selama 15 menit.' : `PIN salah. ${5-state.failures} percobaan tersisa.`, retryAt:state.lockedUntil });
        }
        state.failures = 0; state.lockedUntil = 0; save();
        if(cookie) sessions.delete(cookie);
        const token = randomBytes(32).toString('hex'); sessions.set(token, now+30*60*1000);
        res.setHeader('Set-Cookie', `joy_manager=${token}; HttpOnly; SameSite=Strict; Path=/api/card-game; Max-Age=1800`);
        return send(200,{authenticated:true});
      }
      if (path === '/api/card-game/logout' && req.method === 'POST') {
        sessions.delete(cookie); res.setHeader('Set-Cookie','joy_manager=; HttpOnly; SameSite=Strict; Path=/api/card-game; Max-Age=0'); return send(200,{ok:true});
      }
      if (path === '/api/card-game/register' && req.method === 'POST') {
        const row = valid(body);
        if (state.registrations.length >= 8) return send(409,{error:'Semua kursi sudah terisi.'});
        if (state.registrations.some(r=>r.whatsapp===row.whatsapp)) return send(409,{error:'Nomor WhatsApp sudah terdaftar.'});
        const registration = {...row,id:randomUUID(),code:`CG-${randomBytes(4).toString('hex').toUpperCase()}`,status:'pending',createdAt:new Date().toISOString()};
        state.registrations.push(registration); save(); return send(201,registration);
      }
      if (path === '/api/card-game/admin/registrations' && req.method === 'GET') return send(200,state.registrations);
      if (path === '/api/card-game/admin/import' && req.method === 'POST') {
        if (!Array.isArray(body.rows) || body.rows.length>8 || state.registrations.length) return send(409,{error:'Impor hanya tersedia ketika daftar server kosong.'});
        const rows = body.rows.map(r=>({...valid({...r,consent:true}),id:randomUUID(),code:`CG-${randomBytes(4).toString('hex').toUpperCase()}`,status:r.status==='confirmed'?'confirmed':'pending',createdAt:new Date().toISOString()}));
        if(new Set(rows.map(r=>r.whatsapp)).size!==rows.length) throw new Error('Nomor WhatsApp duplikat.');
        state.registrations=rows; save(); return send(200,{ok:true});
      }
      if (path === '/api/card-game/admin/registrations' && req.method === 'DELETE') { state.registrations=[]; save(); return send(200,{ok:true}); }
      const match = path.match(/^\/api\/card-game\/admin\/registrations\/([a-f0-9-]+)$/);
      if (match && ['PATCH','DELETE'].includes(req.method)) {
        const row=state.registrations.find(r=>r.id===match[1]);
        if(!row) return send(404,{error:'Pendaftaran tidak ditemukan.'});
        if(req.method==='DELETE') state.registrations=state.registrations.filter(r=>r!==row);
        else { if(!['pending','confirmed'].includes(body.status)) throw new Error('Status tidak valid.'); row.status=body.status; }
        save(); return send(200,{ok:true});
      }
      return send(404,{error:'Tidak ditemukan.'});
    } catch(error) { return send(400,{error:error instanceof SyntaxError?'Data tidak valid.':error.message}); }
  };
}

export function cardGameLocal() {
  return { name:'joycafe-card-game-local', configureServer(server) { server.middlewares.use(createCardGameHandler()); } };
}
