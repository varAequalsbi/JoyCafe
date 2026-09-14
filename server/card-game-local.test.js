import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createCardGameHandler } from './card-game-local.js';

test('PIN protects private records and actions; persistent global lockout cannot be reset by a new client', async () => {
  const dir=mkdtempSync(join(tmpdir(),'joy-auth-test-'));
  let handler=createCardGameHandler(dir);
  const server=createServer((req,res)=>handler(req,res,()=>{res.statusCode=404;res.end();}));
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const pin=readFileSync(join(dir,'manager-pin.txt'),'utf8').trim();
  const call=(path,method='GET',body={},cookie='',origin=base)=>fetch(base+'/api/card-game/'+path,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:method==='GET'?undefined:JSON.stringify(body)});
  try {
    assert.equal((await call('admin/registrations')).status,401);
    assert.equal((await call('admin/registrations','DELETE')).status,401);
    assert.equal((await call('login','POST',{pin},'','https://evil.example')).status,403);
    const registration=await call('register','POST',{fullName:'Private Test Name',displayName:'Test',whatsapp:'081234567890',drink:'Tubruk',consent:true,status:'confirmed'});
    const row=await registration.json();assert.equal(row.status,'pending');
    const publicRows=await (await call('seats')).json();assert.deepEqual(Object.keys(publicRows[0]).sort(),['displayName','id','status']);
    const login=await call('login','POST',{pin});assert.equal(login.status,200);
    const header=login.headers.get('set-cookie');assert.match(header,/HttpOnly/);assert.match(header,/SameSite=Strict/);
    const cookie=header.split(';')[0];
    assert.equal((await call('admin/registrations','GET',{},cookie)).status,200);
    assert.equal((await call(`admin/registrations/${row.id}`,'PATCH',{status:'confirmed'},cookie)).status,200);
    await call('logout','POST',{},cookie);
    assert.equal((await call('admin/registrations','GET',{},cookie)).status,401);
    for(let i=0;i<5;i++) assert.equal((await call('login','POST',{pin:'wrong'})).status,i===4?429:401);
    assert.equal((await call('login','POST',{pin})).status,429);
    handler=createCardGameHandler(dir);
    assert.equal((await call('login','POST',{pin})).status,429);
    assert.equal((await call('admin/registrations','GET',{},cookie)).status,401);
  } finally { await new Promise(r=>server.close(r)); }
});
