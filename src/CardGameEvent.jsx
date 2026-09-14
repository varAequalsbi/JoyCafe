import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  Coffee,
  Copy,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'joycafe-card-game-registrations-v1';
const WHATSAPP_NUMBER = '6282233043528';
const CAPACITY = 8;
const EVENT_PRICE = 10000;
const DRINKS = ['Tubruk', 'Tubruk Filter', 'Original Tea'];

async function api(path, method = 'GET', body) {
  const response = await fetch(`/api/card-game/${path}`, { method, credentials:'same-origin', headers: method === 'GET' ? {} : {'Content-Type':'application/json'}, body:method === 'GET' ? undefined : JSON.stringify(body || {}) });
  const data = await response.json();
  if (!response.ok) { const error = new Error(data.error || 'Permintaan gagal.'); error.status=response.status; error.retryAt=data.retryAt; throw error; }
  return data;
}

function ManagerLogin({ onLogin }) {
  const [pin,setPin]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [retryAt,setRetryAt]=useState(0);
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const remaining=Math.max(0,Math.ceil((retryAt-now)/1000));
  async function submit(e) {
    e.preventDefault();setBusy(true);setError('');
    try { await api('login','POST',{pin});setPin('');await onLogin(); }
    catch(e) {setError(e.message);setRetryAt(e.retryAt || 0);setPin('');}
    finally {setBusy(false);}
  }
  return <section className="game-manager game-pin"><ShieldCheck size={30}/><p className="game-kicker">Akses staf</p><h2>Verifikasi manual</h2><p>Masukkan PIN untuk melihat pendaftaran dan mengonfirmasi pembayaran.</p><form onSubmit={submit}><label htmlFor="manager-pin">PIN pengelola</label><input id="manager-pin" type="password" inputMode="numeric" autoComplete="current-password" pattern="[0-9]{8}" minLength={8} maxLength={8} required value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))}/><button className="game-register-button" disabled={busy || remaining>0}>{busy?'Memeriksa…':'Buka panel'}</button></form>{error && <p role="alert">{error}</p>}{remaining>0 && <p role="status">Coba lagi dalam {Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</p>}</section>;
}

function readRegistrations() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, CAPACITY) : [];
  } catch {
    return [];
  }
}

function createRegistrationCode() {
  return `CG-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

function normalizeWhatsapp(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

function whatsappPaymentUrl(registration) {
  const message = [
    'Halo JoyCafe, saya sudah mendaftar Card Game Night.',
    '',
    `Kode: ${registration.code}`,
    `Nama: ${registration.fullName}`,
    `Nama tampilan: ${registration.displayName}`,
    `WhatsApp: ${registration.whatsapp}`,
    `Minuman: ${registration.drink}`,
    'Biaya: Rp10.000',
    '',
    'Saya akan mengirim bukti pembayaran QRIS di chat ini untuk diverifikasi.',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Seat({ number, registration }) {
  const status = registration?.status || 'available';
  const label = registration
    ? `Kursi ${number}, ${registration.displayName}, ${status === 'confirmed' ? 'terkonfirmasi' : 'menunggu verifikasi'}`
    : `Kursi ${number}, tersedia`;

  return (
    <div className={`game-seat game-seat--${number} is-${status}`} aria-label={label}>
      <span>Kursi {number}</span>
      <strong>{registration?.displayName || 'Tersedia'}</strong>
      {registration && <small>{status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu verifikasi'}</small>}
    </div>
  );
}

function LocalManager({ registrations, onStatusChange, onRemove, onClear, onLogout, onImport, legacyCount }) {
  return (
    <section className="game-manager" aria-labelledby="game-manager-title">
      <div>
        <p className="game-kicker">Khusus localhost</p>
        <h2 id="game-manager-title">Verifikasi manual</h2>
        <p>Akses staf aktif selama 30 menit.</p>
        <button className="game-manager-clear" onClick={onLogout}>Kunci panel</button>
        {legacyCount>0 && <button className="game-manager-clear" onClick={onImport}>Pindahkan {legacyCount} pendaftaran lama ke server</button>}
      </div>
      <div className="game-manager-list">
        {registrations.length ? registrations.map((registration, index) => (
          <article key={registration.id}>
            <div>
              <span>Kursi {index + 1} · {registration.code}</span>
              <strong>{registration.displayName}</strong>
              <small>{registration.fullName} · {registration.whatsapp} · {registration.drink}</small>
            </div>
            <div className="game-manager-actions">
              {registration.status !== 'confirmed' && (
                <button type="button" onClick={() => onStatusChange(registration.id, 'confirmed')}>
                  <Check size={15} /> Konfirmasi
                </button>
              )}
              {registration.status === 'confirmed' && (
                <button type="button" onClick={() => onStatusChange(registration.id, 'pending')}>
                  Tandai pending
                </button>
              )}
              <button className="is-danger" type="button" onClick={() => onRemove(registration.id)}>
                <X size={15} /> Batalkan
              </button>
            </div>
          </article>
        )) : <p className="game-manager-empty">Belum ada pendaftaran.</p>}
      </div>
      {registrations.length > 0 && <button className="game-manager-clear" type="button" onClick={onClear}>Hapus seluruh data demo</button>}
    </section>
  );
}

export default function CardGameEvent() {
  const [registrations, setRegistrations] = useState([]);
  const [privateRows, setPrivateRows] = useState([]);
  const [authenticated,setAuthenticated]=useState(false);
  const [authReady,setAuthReady]=useState(false);
  const [managerError,setManagerError]=useState('');
  const [legacyCount,setLegacyCount]=useState(()=>readRegistrations().length);
  const [form, setForm] = useState({ fullName: '', displayName: '', whatsapp: '', drink: DRINKS[0], consent: false });
  const [latestRegistration, setLatestRegistration] = useState(null);
  const [message, setMessage] = useState('');

  const confirmedCount = registrations.filter((item) => item.status === 'confirmed').length;
  const occupiedCount = registrations.length;
  const isFull = occupiedCount >= CAPACITY;
  const isManager = new URLSearchParams(window.location.search).get('manage') === '1';
  const seats = useMemo(
    () => Array.from({ length: CAPACITY }, (_, index) => registrations[index] || null),
    [registrations],
  );

  const refresh = useCallback(async () => {
    setRegistrations(await api('seats'));
    if(isManager) {
      const session=await api('session');
      setAuthenticated(session.authenticated);
      if(session.authenticated) setPrivateRows(await api('admin/registrations'));
      else setPrivateRows([]);
    }
    setAuthReady(true);
  },[isManager]);
  useEffect(()=>{
    const load=()=>refresh().catch(()=>{setAuthenticated(false);setPrivateRows([]);setAuthReady(true);setManagerError('Tidak dapat terhubung ke server. Coba lagi.');});
    load();const timer=setInterval(load,5000);return()=>clearInterval(timer);
  },[refresh]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Card Game Night | JoyCafe';
    return () => { document.title = previousTitle; };
  }, []);


  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submitRegistration(event) {
    event.preventDefault();
    setMessage('');

    if (isFull) {
      setMessage('Semua kursi sudah terisi.');
      return;
    }

    const fullName = form.fullName.trim();
    const displayName = form.displayName.trim();
    const whatsapp = normalizeWhatsapp(form.whatsapp);

    if (!fullName || !displayName || whatsapp.length < 10 || !form.consent) {
      setMessage('Lengkapi nama, nama tampilan, nomor WhatsApp, dan persetujuan publikasi nama.');
      return;
    }

    if (registrations.some((item) => item.whatsapp === whatsapp)) {
      setMessage('Nomor WhatsApp ini sudah memiliki satu pendaftaran aktif.');
      return;
    }

    const registration = {
      id: crypto.randomUUID(),
      code: createRegistrationCode(),
      fullName,
      displayName,
      whatsapp,
      drink: form.drink,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const saved=await api('register','POST',{...registration,consent:form.consent});
      setLatestRegistration(saved);
      setForm({ fullName: '', displayName: '', whatsapp: '', drink: DRINKS[0], consent: false });
      await refresh();
    } catch(e) {setMessage(e.message);}
  }

  async function managerAction(path,method,body) {
    try {setManagerError('');await api(path,method,body);await refresh();return true;}
    catch(e) {setManagerError(e.message);if(e.status===401){setAuthenticated(false);setPrivateRows([]);}return false;}
  }
  function updateRegistrationStatus(id, status) { return managerAction(`admin/registrations/${id}`,'PATCH',{status}); }

  async function removeRegistration(id) {
    if(!await managerAction(`admin/registrations/${id}`,'DELETE')) return;
    if (latestRegistration?.id === id) setLatestRegistration(null);
  }

  async function copyCode() {
    if (!latestRegistration) return;
    await navigator.clipboard?.writeText(latestRegistration.code);
    setMessage('Kode pendaftaran disalin.');
  }

  return (
    <main className="game-page">
      <header className="game-topbar">
        <a className="game-brand" href="/">
          <img src="/joycafe-logo.png" alt="" />
          <span>JoyCafe <small>Hot &amp; Cold</small></span>
        </a>
        <a className="game-back" href="/"><ArrowLeft size={17} /> Kembali ke JoyCafe</a>
      </header>

      <section className="game-hero">
        <div className="game-hero-copy">
          <p className="game-kicker">Satu meja · delapan pemain</p>
          <h1>Card Game<br /><em>Night.</em></h1>
          <p className="game-lede">Malam permainan kartu santai di JoyCafe. Amankan kursimu, bayar Rp10.000 lewat QRIS, lalu tunggu konfirmasi dari tim kami.</p>
          <div className="game-facts">
            <span><UsersRound size={18} /><b>{CAPACITY}</b> kursi</span>
            <span><CreditCard size={18} /><b>Rp10K</b> per orang</span>
            <span><Coffee size={18} /><b>1</b> minuman</span>
          </div>
          <p className="game-schedule">Tanggal dan waktu akan diumumkan</p>
          <aside className="game-dealer-intro">
            <span><BadgeCheck size={22} /></span>
            <div>
              <small>Dealer malam ini</small>
              <strong>Varabi Mawardi</strong>
              <p>Dealer berpengalaman yang sudah dealing sejak Maret.</p>
            </div>
          </aside>
        </div>

        <div className="game-seat-card">
          <div className="game-seat-card-heading">
            <div>
              <p className="game-kicker">Peta kursi</p>
              <h2>{occupiedCount} dari {CAPACITY} kursi terisi</h2>
            </div>
            <span className={isFull ? 'is-full' : ''}>{isFull ? 'Penuh' : `${CAPACITY - occupiedCount} tersedia`}</span>
          </div>

          <div className="game-table-stage" aria-label={`Meja permainan dengan ${occupiedCount} dari ${CAPACITY} kursi terisi`}>
            <div className="game-table">
              <img src="/joycafe-logo.png" alt="" />
              <strong>JOYCAFE</strong>
              <span>CARD GAME NIGHT</span>
              <small>{confirmedCount} terkonfirmasi</small>
            </div>
            <div className="game-dealer-seat" aria-label="Dealer: Varabi Mawardi">
              <span className="game-dealer-button">D</span>
              <span>Dealer</span>
              <strong>Varabi</strong>
            </div>
            {seats.map((registration, index) => <Seat key={registration?.id || index} number={index + 1} registration={registration} />)}
          </div>

          <div className="game-seat-legend" aria-label="Keterangan status kursi">
            <span><i className="is-confirmed" /> Terkonfirmasi</span>
            <span><i className="is-pending" /> Menunggu verifikasi</span>
            <span><i /> Tersedia</span>
          </div>
        </div>
      </section>

      <section className="game-registration" id="daftar">
        <div className="game-registration-copy">
          <p className="game-kicker">Pendaftaran sederhana</p>
          <h2>Daftar, bayar, lalu kursimu kami konfirmasi.</h2>
          <ol>
            <li><span>01</span><div><strong>Isi data singkat</strong><p>Nama tampilanmu akan terlihat di peta kursi.</p></div></li>
            <li><span>02</span><div><strong>Bayar Rp10.000</strong><p>Scan QRIS dan kirim bukti pembayaran melalui WhatsApp.</p></div></li>
            <li><span>03</span><div><strong>Tunggu konfirmasi</strong><p>Kursi resmi terkonfirmasi setelah pembayaran kami cocokkan.</p></div></li>
          </ol>
          <aside><ShieldCheck size={22} /><p>Hanya nama tampilan yang terlihat publik. Nama lengkap, nomor WhatsApp, dan bukti pembayaran tetap privat.</p></aside>
        </div>

        <div className="game-form-card">
          {isFull ? (
            <div className="game-full-state">
              <UsersRound size={42} />
              <p className="game-kicker">8 / 8 kursi</p>
              <h2>Meja sudah penuh.</h2>
              <p>Pendaftaran ditutup setelah delapan kursi terisi.</p>
            </div>
          ) : (
            <form onSubmit={submitRegistration} noValidate>
              <div className="game-form-heading">
                <div><p className="game-kicker">{CAPACITY - occupiedCount} kursi tersisa</p><h2>Ambil satu kursi</h2></div>
                <span>Rp10.000</span>
              </div>

              <label>
                <span>Nama lengkap <b>*</b></span>
                <input name="fullName" value={form.fullName} onChange={updateField} autoComplete="name" placeholder="Untuk verifikasi internal" required />
              </label>
              <label>
                <span>Nama tampilan publik <b>*</b></span>
                <input name="displayName" value={form.displayName} onChange={updateField} maxLength="22" placeholder="Contoh: Raka" required />
                <small>Nama ini akan tampil di kursimu.</small>
              </label>
              <label>
                <span>Nomor WhatsApp <b>*</b></span>
                <input name="whatsapp" value={form.whatsapp} onChange={updateField} inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required />
              </label>
              <label>
                <span>Minuman pilihan</span>
                <select name="drink" value={form.drink} onChange={updateField}>
                  {DRINKS.map((drink) => <option key={drink}>{drink}</option>)}
                </select>
              </label>
              <label className="game-consent">
                <input name="consent" type="checkbox" checked={form.consent} onChange={updateField} required />
                <span>Saya setuju nama tampilan saya terlihat publik pada peta kursi event.</span>
              </label>

              {message && <p className="game-form-message" role="alert">{message}</p>}
              <button className="game-register-button" type="submit">Daftar &amp; lanjut pembayaran <CheckCircle2 size={18} /></button>
              <p className="game-form-note">Pendaftaran belum terkonfirmasi sampai pembayaran diperiksa JoyCafe.</p>
            </form>
          )}
        </div>
      </section>

      <section className="game-rules" aria-labelledby="game-rules-title">
        <div><p className="game-kicker">Aturan singkat</p><h2 id="game-rules-title">Datang untuk bermain dan bersenang-senang.</h2></div>
        <ul>
          <li><Check size={17} /> Maksimal delapan pemain.</li>
          <li><Check size={17} /> Tidak ada taruhan uang.</li>
          <li><Check size={17} /> Game pieces tidak memiliki nilai uang.</li>
          <li><Check size={17} /> Ikuti arahan host selama permainan.</li>
        </ul>
      </section>

      <footer className="game-footer">
        <span>JoyCafe · Jl. Bukit Berbunga No. 230, Sidomulyo, Kota Batu</span>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Tanya JoyCafe</a>
      </footer>

      {latestRegistration && (
        <div className="game-payment-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLatestRegistration(null); }}>
          <section className="game-payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
            <button className="game-payment-close" type="button" onClick={() => setLatestRegistration(null)} aria-label="Tutup"><X /></button>
            <p className="game-kicker">Satu langkah lagi</p>
            <h2 id="payment-title">Bayar Rp10.000 via QRIS</h2>
            <p>Scan QRIS resmi Cafe Joy, lalu kirim bukti pembayaran ke WhatsApp agar kursimu dikonfirmasi.</p>
            <img className="game-qris" src="/card-game-qris.jpeg" alt="QRIS Cafe Joy Hot and Cold" />
            <div className="game-registration-code">
              <span>Kode pendaftaran</span>
              <strong>{latestRegistration.code}</strong>
              <button type="button" onClick={copyCode} aria-label="Salin kode pendaftaran"><Copy size={15} /></button>
            </div>
            {message && <p className="game-form-message" role="status">{message}</p>}
            <a className="game-whatsapp-button" href={whatsappPaymentUrl(latestRegistration)} target="_blank" rel="noreferrer">
              Kirim bukti via WhatsApp <MessageCircle size={18} />
            </a>
            <small className="game-payment-note">Kursi {registrations.findIndex((item) => item.id === latestRegistration.id) + 1} · {latestRegistration.displayName} · status menunggu verifikasi</small>
          </section>
        </div>
      )}

      {isManager && <div id="manager-access">{managerError && <p className="game-form-message" role="alert">{managerError}</p>}{!authReady ? <p>Memeriksa akses…</p> : !authenticated ? <ManagerLogin onLogin={refresh}/> : (
        <LocalManager
          registrations={privateRows}
          onStatusChange={updateRegistrationStatus}
          onRemove={removeRegistration}
          onClear={() => { if(window.confirm('Hapus semua pendaftaran?')) managerAction('admin/registrations','DELETE'); }}
          onLogout={async()=>{await managerAction('logout','POST');setAuthenticated(false);setPrivateRows([]);}}
          legacyCount={legacyCount}
          onImport={async()=>{if(await managerAction('admin/import','POST',{rows:readRegistrations()})){localStorage.removeItem(STORAGE_KEY);setLegacyCount(0);}}}
        />
      )}</div>}
    </main>
  );
}
