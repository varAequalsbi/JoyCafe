import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, Bike, Camera, CarFront, Check, ChevronDown, Clock3, Coffee, ExternalLink,
  Gamepad2, Languages, MapPin, Menu as MenuIcon, PawPrint, Phone,
  Search, Sparkles, UsersRound, WalletCards, Wifi, X, Zap,
} from 'lucide-react';
import logo from '../image.png';
import menuData from './data/menu.json';
import './styles.css';

const links = {
  maps: 'https://maps.app.goo.gl/4eU1wknEXErkmf2JA',
  whatsapp: 'https://wa.me/6282330777522?text=Halo%20kak%2C%20saya%20mau%20tanya%20tentang%20JoyCafe',
  phone: 'tel:+6282330777522',
  instagram: 'https://www.instagram.com/joycafe.sosialita/',
  email: 'mailto:joycafe.kamu@gmail.com',
};

const copy = {
  id: {
    nav: ['Tentang', 'Menu', 'Cocok untuk', 'Fasilitas', 'Lokasi', 'FAQ'],
    heroEyebrow: 'Cafe Joy Hot and Cold · Sidomulyo, Kota Batu',
    heroTitle: <>Cafe di<br />Sidomulyo,<br /><em>Kota Batu.</em></>,
    heroLede: 'JoyCafe menyediakan kopi lokal, Wi-Fi, board game, dan meja lega untuk 4–6 orang—buat kerja, ngobrol, atau seru-seruan bareng.',
    directions: 'Petunjuk arah', menu: 'Lihat menu', whatsapp: 'Tanya via WhatsApp',
    openDaily: 'Buka setiap hari', groupTable: 'Satu meja', groupValue: 'Nyaman untuk 4–6 orang', addressLabel: 'Alamat',
    facts: [['20', 'kursi indoor'], ['40', 'Mbps Wi-Fi*'], ['4–6', 'orang per meja'], ['Cash', '& QRIS']],
    wifiNote: '*Kecepatan yang dilaporkan; kondisi jaringan dapat berubah.',
    aboutEyebrow: 'Satu meja, banyak cerita',
    aboutTitle: 'Cafe komunitas di Sidomulyo yang dibuat untuk berkumpul.',
    aboutText: 'Cafe Joy Hot and Cold—juga dikenal sebagai JoyCafe Hot&Cold atau JoyCafe—berada di Jl. Bukit Berbunga No. 230, Sidomulyo, Kota Batu. Cafe ini memadukan kopi, makanan, meja besar, permainan, dan ruang untuk mengobrol atau bekerja.',
    pillars: [
      ['Meja lega', 'Meja untuk 4–6 orang, cocok untuk komunitas, keluarga, rapat santai, atau teman sepermainan.'],
      ['Main bareng', 'Catur, Monopoly, dan pilihan permainan lain tersedia sesuai stok saat berkunjung.'],
      ['Tetap produktif', 'Wi-Fi, stopkontak di beberapa tempat duduk, dan tanpa batas waktu laptop yang dinyatakan.'],
    ],
    menuEyebrow: 'Menu aktif JoyCafe', menuTitle: 'Pilih teman untuk meja penuh cerita.',
    menuIntro: 'Harga sudah termasuk pajak dan layanan. Ketersediaan dapat berubah; tanyakan kepada barista untuk pilihan hari ini.',
    search: 'Cari menu…', all: 'Semua', noResult: 'Menu tidak ditemukan.', clearSearch: 'Hapus pencarian',
    beans: 'Kopi dari lereng Jawa Timur', beansTitle: 'Arjuno arabika. Dampit robusta.',
    beansText: 'JoyCafe menggunakan arabika dari Arjuno dan robusta dari Dampit dengan profil sangrai medium hingga gelap. Tanyakan kepada barista untuk biji dan seduhan yang tersedia hari ini.',
    bestEyebrow: 'JoyCafe cocok untuk', bestTitle: 'Pilih suasana yang pas buatmu.',
    best: [
      ['Kumpul 4–6 orang', 'Meja lega untuk ngobrol, rapat santai, keluarga, dan komunitas.'],
      ['Board game', 'Bermain sambil menikmati kopi, minuman non-kopi, makanan, dan camilan.'],
      ['Kerja atau belajar', 'Wi-Fi hingga 40 Mbps yang dilaporkan dan stopkontak di beberapa tempat duduk.'],
      ['First date santai', 'Permainan membantu membuka obrolan tanpa suasana yang terlalu formal.'],
    ],
    honest: 'Catatan jujur', honestText: 'JoyCafe berada di tepi jalan utama sehingga tingkat kebisingan dapat berubah. Parkir juga terbatas—sekitar 2 mobil dan 10 motor. Jika kamu mencari matcha atau suasana yang selalu sunyi, JoyCafe mungkin bukan pilihan yang paling pas.',
    facilityEyebrow: 'Yang tersedia', facilityTitle: 'Fasilitas tanpa teka-teki.',
    facilities: [
      ['Wi-Fi', 'Dilaporkan hingga 40 Mbps', 'wifi'], ['Stopkontak', 'Tersedia di beberapa kursi', 'zap'],
      ['Parkir mobil', 'Sekitar 2 mobil, gratis', 'car'], ['Parkir motor', 'Sekitar 10 motor, gratis', 'bike'],
      ['Board game', 'Catur, Monopoly, dan lainnya', 'game'], ['Pet-friendly', 'Hewan wajib menggunakan leash', 'paw'],
      ['Area merokok', 'Tersedia', 'smoke'], ['Pembayaran', 'Tunai dan QRIS', 'wallet'],
    ],
    visitEyebrow: 'Cafe di Sidomulyo, Kota Batu', visitTitle: 'Temukan Cafe Joy di Sidomulyo.',
    visitText: 'Jl. Bukit Berbunga No. 230, Sidomulyo, Kec. Batu, Kota Batu, Jawa Timur 65317, Indonesia.',
    landmark: 'Berada di tepi jalan utama. Gunakan tautan Google Maps untuk rute terbaru.',
    hours: 'Setiap hari · 12.00–00.00', contact: 'Hubungi', social: 'Ikuti keseharian JoyCafe',
    faqEyebrow: 'Sebelum berangkat', faqTitle: 'Pertanyaan yang sering muncul.',
    faqs: [
      ['Cafe apa yang ada di daerah Sidomulyo, Kota Batu?', 'Cafe Joy Hot and Cold, juga dikenal sebagai JoyCafe, berada di Jl. Bukit Berbunga No. 230, Sidomulyo, Kecamatan Batu, Kota Batu. Cafe buka setiap hari pukul 12.00–00.00.'],
      ['Berapa kisaran harga menu JoyCafe?', 'Harga menu aktif berada pada kisaran Rp5.000–Rp35.000 dan sudah termasuk pajak serta layanan. Ketersediaan dapat berubah.'],
      ['Apakah ada Wi-Fi dan stopkontak?', 'Ya. Wi-Fi dilaporkan mencapai sekitar 40 Mbps untuk unduh dan unggah. Stopkontak tersedia di beberapa tempat duduk; posisi terbaik dapat ditanyakan kepada barista.'],
      ['Apakah JoyCafe cocok untuk kerja atau belajar?', 'Ya. Tersedia meja, Wi-Fi, dan beberapa stopkontak tanpa batas waktu laptop yang dinyatakan. Karena lokasinya di tepi jalan utama, tingkat kebisingan dapat berubah.'],
      ['Apakah tersedia board game?', 'Ya. Catur dan Monopoly termasuk permainan yang disebut tersedia. Koleksi dapat berubah dan terus diperbarui, jadi tanyakan permainan yang tersedia saat berkunjung.'],
      ['Berapa orang yang bisa duduk bersama?', 'Satu meja besar nyaman untuk sekitar 4–6 orang. Total kapasitas tempat duduk yang dinyatakan adalah sekitar 20 orang.'],
      ['Apakah menu JoyCafe halal?', 'Pemilik menyatakan bahan menu halal, tetapi JoyCafe belum memiliki sertifikasi halal resmi. Untuk kebutuhan khusus atau pertanyaan bahan, hubungi staf sebelum memesan.'],
      ['Apakah tersedia parkir?', 'Ya, dengan kapasitas terbatas: sekitar 2 mobil dan 10 motor tanpa biaya, serta tempat untuk sepeda.'],
      ['Apakah boleh membawa hewan peliharaan?', 'Boleh selama hewan menggunakan leash dan tetap berada dalam kendali pemilik. Hubungi staf lebih dahulu bila membutuhkan pengaturan khusus.'],
      ['Apa metode pembayarannya?', 'JoyCafe menerima pembayaran tunai dan QRIS. Harga menu yang ditampilkan sudah termasuk pajak dan layanan.'],
    ],
    closingEyebrow: 'Siap isi meja?', closingTitle: 'Datang, duduk, dan temukan favoritmu.',
    footerNote: 'Informasi dan harga diperbarui 31 Agustus 2026. Ketersediaan dapat berubah.',
  },
  en: {
    nav: ['About', 'Menu', 'Best for', 'Facilities', 'Visit', 'FAQ'],
    heroEyebrow: 'Cafe Joy Hot and Cold · Sidomulyo, Batu',
    heroTitle: <>A café in<br />Sidomulyo,<br /><em>Batu City.</em></>,
    heroLede: 'JoyCafe offers local coffee, Wi-Fi, board games, and roomy tables for groups of 4–6—made for work sessions, conversations, and time together.',
    directions: 'Get directions', menu: 'View menu', whatsapp: 'Ask on WhatsApp',
    openDaily: 'Open every day', groupTable: 'One table', groupValue: 'Comfortable for 4–6 people', addressLabel: 'Address',
    facts: [['20', 'indoor seats'], ['40', 'Mbps Wi-Fi*'], ['4–6', 'people per table'], ['Cash', '& QRIS']],
    wifiNote: '*Reported speed; network conditions may vary.',
    aboutEyebrow: 'One table, many stories', aboutTitle: 'A community café in Sidomulyo designed for gathering.',
    aboutText: 'Cafe Joy Hot and Cold—also known as JoyCafe Hot&Cold or JoyCafe—is located at Jl. Bukit Berbunga No. 230, Sidomulyo, Batu City. It combines coffee, casual food, shared tables, games, and space to talk or work.',
    pillars: [
      ['Roomy tables', 'Tables for 4–6, suited to communities, families, relaxed meetings, and game groups.'],
      ['Play together', 'Chess, Monopoly, and other games are available depending on the day.'],
      ['Stay productive', 'Wi-Fi, power outlets at selected seats, and no stated laptop time limit.'],
    ],
    menuEyebrow: 'JoyCafe current menu', menuTitle: 'Pick something for a table full of stories.',
    menuIntro: 'Prices include tax and service. Availability may change; ask the barista about today’s selection.',
    search: 'Search the menu…', all: 'All', noResult: 'No menu items found.', clearSearch: 'Clear search',
    beans: 'Coffee from East Java’s slopes', beansTitle: 'Arjuno arabica. Dampit robusta.',
    beansText: 'JoyCafe uses arabica from Arjuno and robusta from Dampit with medium-to-dark roast profiles. Ask the barista which beans and brewing choices are available today.',
    bestEyebrow: 'JoyCafe is best for', bestTitle: 'Choose the occasion that fits.',
    best: [
      ['Groups of 4–6', 'Roomy tables for conversations, casual meetings, families, and communities.'],
      ['Board games', 'Play while enjoying coffee, non-coffee drinks, meals, and snacks.'],
      ['Work or study', 'Reported Wi-Fi up to 40 Mbps and power outlets at selected seats.'],
      ['A relaxed first date', 'Games can help start the conversation without a formal atmosphere.'],
    ],
    honest: 'An honest note', honestText: 'JoyCafe sits beside a main road, so noise levels can vary. Parking is limited to roughly 2 cars and 10 motorcycles. If you specifically need matcha or a consistently silent room, JoyCafe may not be the best fit.',
    facilityEyebrow: 'What is available', facilityTitle: 'Facilities, clearly stated.',
    facilities: [
      ['Wi-Fi', 'Reported up to 40 Mbps', 'wifi'], ['Power outlets', 'Available at selected seats', 'zap'],
      ['Car parking', 'About 2 cars, free', 'car'], ['Motorcycle parking', 'About 10 motorcycles, free', 'bike'],
      ['Board games', 'Chess, Monopoly, and more', 'game'], ['Pet-friendly', 'Pets must remain leashed', 'paw'],
      ['Smoking area', 'Available', 'smoke'], ['Payment', 'Cash and QRIS', 'wallet'],
    ],
    visitEyebrow: 'Café in Sidomulyo, Batu City', visitTitle: 'Find Cafe Joy in Sidomulyo.',
    visitText: 'Jl. Bukit Berbunga No. 230, Sidomulyo, Batu District, Batu City, East Java 65317, Indonesia.',
    landmark: 'Located beside the main road. Use the Google Maps link for the latest route.',
    hours: 'Every day · 12:00–00:00', contact: 'Contact', social: 'Follow daily life at JoyCafe',
    faqEyebrow: 'Before you visit', faqTitle: 'Frequently asked questions.',
    faqs: [
      ['Which café is located in Sidomulyo, Batu City?', 'Cafe Joy Hot and Cold, also known as JoyCafe, is at Jl. Bukit Berbunga No. 230, Sidomulyo, Batu City. It is open daily from 12:00 to midnight.'],
      ['What is the JoyCafe menu price range?', 'Current menu prices range from Rp5,000 to Rp35,000 and include tax and service. Availability may change.'],
      ['Is Wi-Fi available, and are there power outlets?', 'Yes. Wi-Fi has been reported at around 40 Mbps download and upload. Outlets are available at selected seats; ask the barista for the best spot.'],
      ['Is JoyCafe suitable for working or studying?', 'Yes. Tables, Wi-Fi, and selected power outlets are available, with no stated laptop time limit. Because the café is beside a main road, noise levels can vary.'],
      ['Are board games available?', 'Yes. Chess and Monopoly are among the games stated as available. The collection may change and expand, so ask what is available when you visit.'],
      ['How many people can sit together?', 'A large table comfortably seats about 4–6 people. The stated total seating capacity is approximately 20.'],
      ['Is JoyCafe halal?', 'The owner states that menu ingredients are halal, but JoyCafe does not currently hold official halal certification. Contact the staff before ordering if you have specific requirements.'],
      ['Is parking available?', 'Yes, with limited capacity: about 2 cars and 10 motorcycles at no charge, plus space for bicycles.'],
      ['Are pets allowed?', 'Yes, provided pets remain leashed and under their owner’s control. Contact the staff first if you need a special arrangement.'],
      ['Which payment methods are accepted?', 'JoyCafe accepts cash and QRIS. Displayed menu prices include tax and service.'],
    ],
    closingEyebrow: 'Ready to fill the table?', closingTitle: 'Come in, take a seat, and find your favorite.',
    footerNote: 'Information and prices updated 31 August 2026. Availability may change.',
  },
};

const icons = { wifi: Wifi, zap: Zap, car: CarFront, bike: Bike, game: Gamepad2, paw: PawPrint, smoke: Coffee, wallet: WalletCards };
const categoryLabels = { coffee: ['Kopi', 'Coffee'], exotic: ['Eksotik', 'Exotic'], latte: ['Latte', 'Latte'], 'main-course': ['Makanan', 'Meals'], 'non-coffee': ['Non-kopi', 'Non-coffee'], snacks: ['Camilan', 'Snacks'] };
const menu = menuData.categories.map((category) => ({ ...category, products: category.products.filter((product) => product.is_active) }));
const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function track(name) {
  window.gtag?.('event', name);
  window.dispatchEvent(new CustomEvent('joycafe:action', { detail: name }));
}

function Brand() {
  return <><img src={logo} alt="" /><span>JoyCafe <small>Hot &amp; Cold</small></span></>;
}

function App() {
  const [lang, setLang] = useState('id');
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'id'
      ? 'Cafe Joy Hot and Cold | Cafe di Sidomulyo, Kota Batu'
      : 'Cafe Joy Hot and Cold | Café in Sidomulyo, Batu City';
    document.querySelector('meta[name="description"]')?.setAttribute('content', lang === 'id'
      ? 'Cari cafe di Sidomulyo, Kota Batu? Cafe Joy Hot and Cold (JoyCafe) buka setiap hari pukul 12.00–00.00 dengan kopi lokal, Wi-Fi, board game, makanan, dan camilan.'
      : 'Cafe Joy Hot and Cold is a community café in Sidomulyo, Batu City, with board games, tables for 4–6, Wi-Fi, local coffee, meals, and snacks.');
  }, [lang]);

  const visibleMenu = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(lang === 'id' ? 'id' : 'en');
    return menu.map((item) => ({
      ...item,
      products: item.products.filter((product) => (category === 'all' || category === item.id) && (!term || product.name.toLocaleLowerCase().includes(term))),
    })).filter((item) => item.products.length);
  }, [category, query, lang]);

  return (
    <main>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="hero" id="top">
        <nav className="nav shell" aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'}>
          <a className="brand" href="#top" aria-label="JoyCafe Hot and Cold — home"><Brand /></a>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {['tentang', 'menu', 'cocok', 'fasilitas', 'lokasi', 'faq'].map((id, index) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t.nav[index]}</a>)}
          </div>
          <div className="nav-actions">
            <button className="language-toggle" onClick={() => { setLang(lang === 'id' ? 'en' : 'id'); track('language_switch'); }} aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}>
              <Languages size={17} /><span>{lang === 'id' ? 'EN' : 'ID'}</span>
            </button>
            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={lang === 'id' ? 'Buka menu navigasi' : 'Open navigation'}>{menuOpen ? <X /> : <MenuIcon />}</button>
          </div>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className="lede">{t.heroLede}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={links.maps} target="_blank" rel="noreferrer" onClick={() => track('directions_click')}><MapPin size={19} /> {t.directions} <ArrowRight size={17} /></a>
              <a className="button button-secondary" href="#menu" onClick={() => track('menu_view')}><MenuIcon size={19} /> {t.menu}</a>
            </div>
          </div>

          <aside className="hero-card" aria-label="JoyCafe quick information">
            <div className="hero-card__mark"><img src={logo} alt="JoyCafe Hot & Cold logo" /></div>
            <div className="hero-card__facts">
              <p><Clock3 size={19} /><span><small>{t.openDaily}</small>12.00–00.00</span></p>
              <p><UsersRound size={19} /><span><small>{t.groupTable}</small>{t.groupValue}</span></p>
              <p><MapPin size={19} /><span><small>{t.addressLabel}</small>Jl. Bukit Berbunga No. 230</span></p>
            </div>
          </aside>
        </div>
        <div className="hero-ticker" aria-hidden="true"><span>LOCAL COFFEE</span><i>✦</i><span>BOARD GAMES</span><i>✦</i><span>GOOD COMPANY</span><i>✦</i><span>OPEN DAILY</span></div>
      </header>

      <div id="content">
        <section className="quick-facts shell" aria-label="JoyCafe facts">
          {t.facts.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
          <small>{t.wifiNote}</small>
        </section>

        <section className="about shell section" id="tentang">
          <div className="section-heading">
            <div><p className="eyebrow">{t.aboutEyebrow}</p><h2>{t.aboutTitle}</h2></div>
            <p>{t.aboutText}</p>
          </div>
          <div className="pillar-grid">
            {t.pillars.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="menu-section section" id="menu">
          <div className="shell">
            <div className="section-heading menu-heading">
              <div><p className="eyebrow">{t.menuEyebrow}</p><h2>{t.menuTitle}</h2></div>
              <p>{t.menuIntro}</p>
            </div>
            <div className="menu-controls">
              <div className="category-tabs" aria-label="Menu categories">
                <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>{t.all}</button>
                {menu.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{categoryLabels[item.id][lang === 'id' ? 0 : 1]}</button>)}
              </div>
              <label className="search-box"><Search size={18} /><span className="sr-only">{t.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />{query && <button onClick={() => setQuery('')} aria-label={t.clearSearch}><X size={16} /></button>}</label>
            </div>
            <div className="menu-grid">
              {visibleMenu.map((item) => (
                <article className="menu-category" key={item.id}>
                  <header><span>{String(menu.findIndex((entry) => entry.id === item.id) + 1).padStart(2, '0')}</span><h3>{categoryLabels[item.id][lang === 'id' ? 0 : 1]}</h3></header>
                  <div>{item.products.map((product) => <p className="menu-item" key={product.id}><span>{product.name}{product.favorite && <small>★</small>}</span><i /><strong>{rupiah(product.price)}</strong></p>)}</div>
                </article>
              ))}
            </div>
            {!visibleMenu.length && <div className="empty-state"><Coffee size={36} /><p>{t.noResult}</p><button onClick={() => { setQuery(''); setCategory('all'); }}>{t.clearSearch}</button></div>}
            <p className="menu-updated">{lang === 'id' ? 'Menu dan harga diperiksa 31 Agustus 2026.' : 'Menu and prices checked 31 August 2026.'}</p>
          </div>
        </section>

        <section className="beans shell">
          <div className="beans-mark" aria-hidden="true"><Coffee /><span>LOCAL<br />BEANS</span></div>
          <div><p className="eyebrow">{t.beans}</p><h2>{t.beansTitle}</h2><p>{t.beansText}</p></div>
        </section>

        <section className="best section shell" id="cocok">
          <div className="section-heading"><div><p className="eyebrow">{t.bestEyebrow}</p><h2>{t.bestTitle}</h2></div></div>
          <div className="best-grid">{t.best.map(([title, text], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <aside className="honest-note"><Sparkles aria-hidden="true" /><div><strong>{t.honest}</strong><p>{t.honestText}</p></div></aside>
        </section>

        <section className="facilities section" id="fasilitas">
          <div className="shell">
            <div className="section-heading"><div><p className="eyebrow">{t.facilityEyebrow}</p><h2>{t.facilityTitle}</h2></div></div>
            <div className="facility-grid">{t.facilities.map(([title, text, icon]) => { const Icon = icons[icon]; return <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div><Check /></article>; })}</div>
          </div>
        </section>

        <section className="visit section shell" id="lokasi">
          <div className="visit-copy"><p className="eyebrow">{t.visitEyebrow}</p><h2>{t.visitTitle}</h2><p>{t.visitText}</p><p className="landmark"><MapPin size={17} />{t.landmark}</p><div className="visit-actions"><a className="button button-primary" href={links.maps} target="_blank" rel="noreferrer" onClick={() => track('directions_click')}><MapPin size={18} />{t.directions}<ExternalLink size={15} /></a><a className="button button-light" href={links.whatsapp} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click')}>{t.whatsapp}<ArrowRight size={16} /></a></div></div>
          <aside className="contact-card"><Clock3 /><small>{t.openDaily}</small><strong>{t.hours}</strong><hr /><small>{t.contact}</small><a href={links.phone} onClick={() => track('phone_click')}><Phone size={17} />+62 823-3077-7522</a><a href={links.email}>joycafe.kamu@gmail.com</a><hr /><small>{t.social}</small><a href={links.instagram} target="_blank" rel="noreferrer" onClick={() => track('instagram_click')}><Camera size={17} />@joycafe.sosialita<ExternalLink size={13} /></a></aside>
        </section>

        <section className="faq section shell" id="faq">
          <div className="section-heading"><div><p className="eyebrow">{t.faqEyebrow}</p><h2>{t.faqTitle}</h2></div></div>
          <div className="faq-list">{t.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown /></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="closing shell"><div><p className="eyebrow">{t.closingEyebrow}</p><h2>{t.closingTitle}</h2></div><div><a className="button button-primary" href={links.maps} target="_blank" rel="noreferrer" onClick={() => track('directions_click')}><MapPin size={18} />{t.directions}<ArrowRight size={16} /></a><a className="button button-secondary" href="#menu" onClick={() => track('menu_view')}><MenuIcon size={18} />{t.menu}</a></div></section>
      </div>

      <footer className="footer shell">
        <a className="brand footer-brand" href="#top"><Brand /></a>
        <div><p>Jl. Bukit Berbunga No. 230, Sidomulyo, Kota Batu</p><p>{t.footerNote}</p></div>
        <div className="footer-links"><a href={links.maps} target="_blank" rel="noreferrer">Google Maps</a><a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
