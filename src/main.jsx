import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import {
  ArrowRight, Bike, Camera, CarFront, Check, ChevronDown, Clock3, Coffee, ExternalLink,
  Gamepad2, Languages, MapPin, Menu as MenuIcon, PawPrint, Phone,
  Download, ImagePlus, Minus, Plus, RotateCcw, Search, Share2, ShoppingBag, Sparkles,
  Trash2, Upload, UsersRound, WalletCards, Wifi, X, Zap,
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
    orderGuideEyebrow: 'Cara pesan online', orderGuideTitle: 'Tiga langkah, langsung ke WhatsApp.',
    orderGuideIntro: 'Tidak perlu membuat akun dan tidak ada pembayaran di website.',
    orderGuideSteps: [
      ['Pilih menu', 'Tekan Tambah pada makanan atau minuman yang kamu inginkan.'],
      ['Periksa keranjang', 'Atur jumlah, lalu isi nama, waktu ambil atau datang, dan catatan pesanan.'],
      ['Kirim ke WhatsApp', 'Tekan tombol WhatsApp. JoyCafe akan mengonfirmasi ketersediaan dan total akhir pesanan.'],
    ],
    orderGuideNote: 'Pesanan dianggap diterima setelah dikonfirmasi oleh JoyCafe melalui WhatsApp.',
    search: 'Cari menu…', all: 'Semua', noResult: 'Menu tidak ditemukan.', clearSearch: 'Hapus pencarian',
    addToCart: 'Tambah', cart: 'Keranjang', cartEmpty: 'Keranjangmu masih kosong.',
    cartHint: 'Pilih menu, cek jumlahnya, lalu kirim pesanan ke WhatsApp JoyCafe.',
    estimatedTotal: 'Total perkiraan', customerName: 'Nama pemesan', customerNamePlaceholder: 'Tulis nama kamu',
    pickupTime: 'Waktu ambil / datang', pickupTimePlaceholder: 'Contoh: hari ini pukul 19.00',
    orderNotes: 'Catatan', orderNotesPlaceholder: 'Contoh: less ice, tanpa gula',
    sendWhatsapp: 'Kirim pesanan via WhatsApp', clearCart: 'Kosongkan', removeItem: 'Hapus dari keranjang',
    decreaseItem: 'Kurangi jumlah', increaseItem: 'Tambah jumlah', closeCart: 'Tutup keranjang',
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
    orderGuideEyebrow: 'How to order online', orderGuideTitle: 'Three steps, straight to WhatsApp.',
    orderGuideIntro: 'No account is required, and there is no payment on this website.',
    orderGuideSteps: [
      ['Choose your items', 'Press Add on each food or drink you would like.'],
      ['Review your cart', 'Adjust quantities, then add your name, pickup or arrival time, and order notes.'],
      ['Send on WhatsApp', 'Press the WhatsApp button. JoyCafe will confirm availability and the final order total.'],
    ],
    orderGuideNote: 'Your order is accepted after JoyCafe confirms it with you on WhatsApp.',
    search: 'Search the menu…', all: 'All', noResult: 'No menu items found.', clearSearch: 'Clear search',
    addToCart: 'Add', cart: 'Cart', cartEmpty: 'Your cart is still empty.',
    cartHint: 'Choose your items, review the quantities, then send the order to JoyCafe on WhatsApp.',
    estimatedTotal: 'Estimated total', customerName: 'Customer name', customerNamePlaceholder: 'Enter your name',
    pickupTime: 'Pickup / arrival time', pickupTimePlaceholder: 'Example: today at 7:00 PM',
    orderNotes: 'Notes', orderNotesPlaceholder: 'Example: less ice, no sugar',
    sendWhatsapp: 'Send order via WhatsApp', clearCart: 'Clear', removeItem: 'Remove from cart',
    decreaseItem: 'Decrease quantity', increaseItem: 'Increase quantity', closeCart: 'Close cart',
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

const loadCanvasImage = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = source;
});

function wrapCanvasText(context, text, maxWidth) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else current = test;
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function StoryStudio() {
  const [photo, setPhoto] = useState('');
  const [headline, setHeadline] = useState("WE'RE OPEN");
  const [caption, setCaption] = useState('Ngopi dulu, cerita kemudian.');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState('');
  const fileInput = useRef(null);
  const preview = useRef(null);
  const drag = useRef(null);
  const date = useMemo(() => new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date()), []);

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const previous = {
      title: document.title,
      robots: robots?.getAttribute('content'),
      description: description?.getAttribute('content'),
      canonical: canonical?.getAttribute('href'),
    };
    document.title = 'Poster Harian JoyCafe';
    robots?.setAttribute('content', 'noindex,nofollow,noarchive');
    description?.setAttribute('content', 'Pembuat poster harian privat untuk JoyCafe. Halaman hanya dapat diakses melalui tautan langsung.');
    canonical?.setAttribute('href', `${window.location.origin}/story`);
    return () => {
      document.title = previous.title;
      if (previous.robots) robots?.setAttribute('content', previous.robots);
      if (previous.description) description?.setAttribute('content', previous.description);
      if (previous.canonical) canonical?.setAttribute('href', previous.canonical);
    };
  }, []);

  useEffect(() => {
    return () => { if (photo) URL.revokeObjectURL(photo); };
  }, [photo]);

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setStatus('Foto siap disesuaikan.');
  };

  const reset = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto('');
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setStatus('');
    if (fileInput.current) fileInput.current.value = '';
  };

  const startDrag = (event) => {
    if (!photo) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, origin: position };
  };

  const movePhoto = (event) => {
    if (!drag.current || !preview.current) return;
    const bounds = preview.current.getBoundingClientRect();
    const clamp = (value) => Math.max(-0.42, Math.min(0.42, value));
    setPosition({
      x: clamp(drag.current.origin.x + (event.clientX - drag.current.x) / bounds.width),
      y: clamp(drag.current.origin.y + (event.clientY - drag.current.y) / bounds.height),
    });
  };

  const stopDrag = () => { drag.current = null; };

  const makePoster = async () => {
    if (!photo) return null;
    await document.fonts?.ready;
    const [userPhoto, brandLogo] = await Promise.all([loadCanvasImage(photo), loadCanvasImage(logo)]);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const context = canvas.getContext('2d');
    const cover = Math.max(canvas.width / userPhoto.naturalWidth, canvas.height / userPhoto.naturalHeight) * zoom;
    const width = userPhoto.naturalWidth * cover;
    const height = userPhoto.naturalHeight * cover;
    const x = (canvas.width - width) / 2 + position.x * canvas.width;
    const y = (canvas.height - height) / 2 + position.y * canvas.height;
    context.drawImage(userPhoto, x, y, width, height);

    const shade = context.createLinearGradient(0, 0, 0, canvas.height);
    shade.addColorStop(0, 'rgba(47,33,26,.72)');
    shade.addColorStop(.28, 'rgba(47,33,26,.38)');
    shade.addColorStop(.58, 'rgba(47,33,26,.52)');
    shade.addColorStop(1, 'rgba(47,33,26,.88)');
    context.fillStyle = shade;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,.14)';
    for (let index = 0; index < 520; index += 1) {
      const grainX = (index * 83) % canvas.width;
      const grainY = (index * 197) % canvas.height;
      context.fillRect(grainX, grainY, index % 4 === 0 ? 3 : 2, index % 5 === 0 ? 3 : 2);
    }

    context.textAlign = 'left';
    context.fillStyle = '#fff7e8';
    context.font = "900 24px 'DM Sans', sans-serif";
    context.fillText('JOYCAFE · DAILY POSTER', 72, 92);
    context.textAlign = 'right';
    context.fillText(date.toUpperCase(), 1008, 92);
    context.strokeStyle = 'rgba(242,182,50,.72)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(72, 122);
    context.lineTo(1008, 122);
    context.stroke();

    context.textAlign = 'center';
    const posterHeadline = (headline || "WE'RE OPEN").trim();
    context.font = "700 204px 'Fraunces', serif";
    let headlineLines = posterHeadline.split(/\s+/);
    if (headlineLines.length > 2) headlineLines = wrapCanvasText(context, posterHeadline, 920);
    if (headlineLines.length === 1 && context.measureText(headlineLines[0]).width > 920) {
      let fontSize = 204;
      while (fontSize > 96 && context.measureText(headlineLines[0]).width > 920) {
        fontSize -= 6;
        context.font = `700 ${fontSize}px 'Fraunces', serif`;
      }
    }
    const headlineStart = headlineLines.length === 1 ? 745 : 690;
    // Canvas text is baseline-aligned: reserve a real gap above the glyphs,
    // including the headline outline, rather than using a fixed label baseline.
    const headlineTop = headlineStart - context.measureText(headlineLines[0]).actualBoundingBoxAscent - 5;
    context.save();
    context.font = "700 50px 'Fraunces', serif";
    context.fillStyle = '#fff7e8';
    const labelDescent = context.measureText('COME IN!').actualBoundingBoxDescent;
    context.fillText('COME IN!', 540, headlineTop - 36 - labelDescent);
    context.restore();
    context.lineWidth = 10;
    context.lineJoin = 'round';
    context.strokeStyle = '#201c1a';
    headlineLines.slice(0, 3).forEach((line, index) => {
      const lineY = headlineStart + index * 158;
      context.strokeText(line, 540, lineY);
      context.fillStyle = index % 2 === 0 ? '#fff7e8' : '#f2b632';
      context.fillText(line, 540, lineY);
    });

    const detailsY = headlineStart + Math.min(headlineLines.length, 3) * 158 + 34;
    context.fillStyle = '#fff7e8';
    context.font = "900 58px 'DM Sans', sans-serif";
    context.fillText('12.00–00.00', 540, detailsY);
    context.font = "700 38px 'Fraunces', serif";
    const captionLines = wrapCanvasText(context, caption || 'Ngopi dulu, cerita kemudian.', 820).slice(0, 2);
    captionLines.forEach((line, index) => context.fillText(line, 540, detailsY + 82 + index * 44));
    context.font = "800 25px 'DM Sans', sans-serif";
    context.fillStyle = 'rgba(255,247,232,.88)';
    context.fillText('JL. BUKIT BERBUNGA NO. 230 · SIDOMULYO, KOTA BATU', 540, detailsY + 176);

    context.save();
    context.beginPath();
    context.arc(540, 1625, 84, 0, Math.PI * 2);
    context.clip();
    context.drawImage(brandLogo, 456, 1541, 168, 168);
    context.restore();
    context.strokeStyle = '#f2b632';
    context.lineWidth = 7;
    context.beginPath();
    context.arc(540, 1625, 87, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = '#fff7e8';
    context.font = "900 26px 'DM Sans', sans-serif";
    context.fillText('JOYCAFE · HOT & COLD', 540, 1760);
    context.font = "800 23px 'DM Sans', sans-serif";
    context.fillStyle = '#f2b632';
    context.fillText('@JOYCAFE.SOSIALITA', 540, 1810);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  const downloadStory = async () => {
    setStatus('Menyiapkan poster…');
    const blob = await makePoster();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `joycafe-poster-${new Date().toISOString().slice(0, 10)}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('Poster berhasil diunduh.');
  };

  const shareStory = async () => {
    const blob = await makePoster();
    if (!blob) return;
    const file = new File([blob], `joycafe-poster-${new Date().toISOString().slice(0, 10)}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Poster Harian JoyCafe' }).catch(() => {});
      setStatus('Pilih Instagram dari menu bagikan.');
    } else {
      await downloadStory();
      setStatus('Browser ini tidak mendukung berbagi langsung—file sudah diunduh.');
    }
  };

  return (
    <main className="story-studio">
      <header className="story-topbar">
        <a className="story-brand" href="/" aria-label="Kembali ke JoyCafe"><Brand /></a>
        <span><span className="story-live-dot" /> Pembuat poster harian</span>
      </header>

      <section className="story-workspace">
        <div className="story-copy">
          <p className="story-kicker">JOYCAFE DAILY POSTER STUDIO</p>
          <h1>Bikin poster hari ini.</h1>
          <p>Pilih foto, susun pesan JoyCafe, lalu ekspor sebagai poster vertikal yang siap diunggah.</p>
          <ol className="story-steps" aria-label="Cara membuat story">
            <li><b>01</b><span><strong>Pilih foto</strong><small>Dari kamera atau galeri</small></span></li>
            <li><b>02</b><span><strong>Sesuaikan</strong><small>Geser dan perbesar foto</small></span></li>
            <li><b>03</b><span><strong>Unduh &amp; unggah</strong><small>Poster 9:16 siap dipakai</small></span></li>
          </ol>
          <p className="story-privacy">Foto diproses di perangkatmu dan tidak dikirim ke server.</p>
        </div>

        <div className="story-preview-column">
          <div className="story-artboard-shell">
            <div ref={preview} className={`story-canvas ${photo ? 'has-photo' : ''}`} aria-label="Pratinjau poster vertikal"
              onPointerDown={startDrag} onPointerMove={movePhoto} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
              {photo ? (
                <img className="story-user-photo" src={photo} alt="Foto pilihan untuk story"
                  style={{ transform: `translate(${position.x * 100}%, ${position.y * 100}%) scale(${zoom})` }} draggable="false" />
              ) : (
                <button className="story-empty" onClick={() => fileInput.current?.click()}>
                  <span><ImagePlus /></span>
                  <strong>Masukkan fotomu</strong>
                  <small>JPG, PNG, atau WEBP</small>
                </button>
              )}
              <div className="story-frame" aria-hidden="true">
                <div className="story-frame-top">
                  <span>JOYCAFE · DAILY POSTER</span>
                  <span>{date}</span>
                </div>
                <div className="story-poster-message">
                  <span>COME IN!</span>
                  <h2>{(headline || "WE'RE OPEN").trim().split(/\s+/).map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}</h2>
                  <strong>12.00–00.00</strong>
                  <p>{caption || 'Ngopi dulu, cerita kemudian.'}</p>
                  <small>Jl. Bukit Berbunga No. 230 · Sidomulyo, Kota Batu</small>
                </div>
                <div className="story-frame-bottom">
                  <div className="story-frame-logo"><img src={logo} alt="" /><b>JOYCAFE <small>HOT &amp; COLD</small></b></div>
                  <span>@joycafe.sosialita</span>
                </div>
              </div>
            </div>
          </div>
          <span className="story-size">POSTER VERTIKAL · 1080 × 1920 PX</span>
          {photo && <span className="story-drag-hint">Geser foto langsung pada pratinjau</span>}
        </div>

        <aside className="story-controls">
          <div className="story-control-heading"><span>Editor</span><small>Poster hari ini</small></div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} hidden />
          <button className="story-upload" onClick={() => fileInput.current?.click()}><Upload />{photo ? 'Ganti foto' : 'Pilih foto'}</button>
          <label className="story-field">
            <span>Headline <small>{headline.length}/20</small></span>
            <input value={headline} maxLength="20" onChange={(event) => setHeadline(event.target.value.toUpperCase())} />
          </label>
          <label className="story-field">
            <span>Kalimat pendukung <small>{caption.length}/54</small></span>
            <textarea value={caption} maxLength="54" rows="3" onChange={(event) => setCaption(event.target.value)} />
          </label>
          <label className="story-field">
            <span>Perbesar foto <small>{Math.round(zoom * 100)}%</small></span>
            <input type="range" min="1" max="2" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} disabled={!photo} />
          </label>
          <button className="story-download" onClick={downloadStory} disabled={!photo}><Download /> Unduh poster</button>
          <button className="story-share" onClick={shareStory} disabled={!photo}><Share2 /> Bagikan dari ponsel</button>
          <button className="story-reset" onClick={reset} disabled={!photo}><RotateCcw /> Mulai ulang</button>
          <p className="story-status" role="status">{status}</p>
        </aside>
      </section>
    </main>
  );
}

const bannerPresets = {
  gofood: { label: 'GoFood', ratio: '16 / 9', hint: 'Tampilan lebar 16:9' },
  shopee: { label: 'ShopeeFood', ratio: '2 / 1', hint: 'Tampilan ultra-wide 2:1' },
};

function BannerStudio() {
  const params = new URLSearchParams(window.location.search);
  const [platform, setPlatform] = useState(params.get('platform') === 'shopee' ? 'shopee' : 'gofood');
  const [clean, setClean] = useState(params.get('clean') === '1');
  const preset = bannerPresets[platform];

  useEffect(() => {
    document.title = 'JoyCafe Delivery Banner Studio';
    document.body.classList.toggle('banner-clean-mode', clean);
    return () => document.body.classList.remove('banner-clean-mode');
  }, [clean]);

  const choosePlatform = (value) => {
    setPlatform(value);
    const next = new URL(window.location.href);
    next.searchParams.set('platform', value);
    window.history.replaceState({}, '', next);
  };

  const toggleClean = async () => {
    const nextClean = !clean;
    setClean(nextClean);
    const next = new URL(window.location.href);
    next.searchParams.set('clean', nextClean ? '1' : '0');
    window.history.replaceState({}, '', next);
    if (nextClean && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <main className={`banner-studio ${clean ? 'is-clean' : ''}`}>
      {!clean && (
        <header className="banner-toolbar">
          <div>
            <p>JoyCafe creative studio</p>
            <h1>Banner outlet</h1>
          </div>
          <div className="banner-toolbar__actions">
            <div className="banner-tabs" aria-label="Pilih format banner">
              {Object.entries(bannerPresets).map(([key, value]) => (
                <button key={key} className={platform === key ? 'active' : ''} onClick={() => choosePlatform(key)}>
                  {value.label}<small>{value.hint}</small>
                </button>
              ))}
            </div>
            <button className="banner-preview-button" onClick={toggleClean}>Buka mode screenshot</button>
          </div>
        </header>
      )}

      <section className="banner-stage" aria-label={`${preset.label} banner preview`}>
        <article className={`outlet-banner outlet-banner--${platform}`} style={{ '--banner-ratio': preset.ratio }}>
          <img className="outlet-banner__photo" src="/joycafe-delivery-banner-bg.png" alt="Kopi, latte, dan potato wedges di meja JoyCafe" />
          <div className="outlet-banner__shade" />
          <div className="outlet-banner__content">
            <div className="outlet-banner__brand">
              <div className="outlet-banner__logo"><img src={logo} alt="" /></div>
              <div><strong>JOYCAFE</strong><span>HOT &amp; COLD</span></div>
            </div>
            <p className="outlet-banner__eyebrow"><span>✦</span> LOCAL COFFEE · COMFORT FOOD</p>
            <h2>Kopi lokal.<br /><em>Teman lengkap.</em></h2>
            <p className="outlet-banner__menu">Americano <i /> Butterscotch <i /> Potato Wedges</p>
            <div className="outlet-banner__meta">
              <span><Clock3 /> Setiap hari · 12.00–00.00</span>
              <span><MapPin /> Sidomulyo, Kota Batu</span>
            </div>
          </div>
          <div className="outlet-banner__stamp"><span>GOOD FOOD</span><strong>GOOD<br />MOOD</strong></div>
        </article>
      </section>

      {!clean && <p className="banner-help">Pilih format, lalu buka mode screenshot. Tekan Esc untuk keluar dari layar penuh.</p>}
      {clean && <button className="banner-exit" onClick={toggleClean}>Kembali ke editor</button>}
    </main>
  );
}

const bazaarMenu = [
  { group: 'Minuman', name: 'Kopi Susu Creamy', note: 'Cold brew · susu creamy', price: '18K', tag: 'Best seller', image: '/menu-images/latte/Butterscotch_Latte.jpeg' },
  { group: 'Minuman', name: 'Americano', note: 'Cold brew · clean & bold', price: '15K', tag: 'Cold brew', image: '/menu-images/coffee/americano.jpeg' },
  { group: 'Minuman', name: 'Teh Fruity', note: 'Teh dingin · rasa buah', price: '13K', tag: 'Fresh', image: '/menu-images/exotic/Summer_mocktail.jpeg' },
  { group: 'Minuman', name: 'Kopi Tubruk', note: 'Kopi hitam · pre-ground', price: '10K', tag: 'Hot', image: '/menu-images/coffee/Tubruk.jpeg' },
  { group: 'Snack', name: 'Sourdough', note: '', price: '15K', tag: 'Snack' },
  { group: 'Snack', name: 'Potato Wadges', note: '', price: '18K', tag: 'Snack' },
  { group: 'Snack', name: 'French Fries', note: '', price: '15K', tag: 'Snack' },
];

function BazaarStudio() {
  const downloadBazaarPng = async () => {
    const flyer = document.querySelector('.bazar-flyer');
    if (!flyer) return;
    const flyerWidth = flyer.getBoundingClientRect().width;
    const dataUrl = await toPng(flyer, { pixelRatio: 3508 / flyerWidth, cacheBust: true, backgroundColor: '#2f211a' });
    const link = document.createElement('a');
    link.download = 'joycafe-festival-kembang-api-a4-landscape.png';
    link.href = dataUrl;
    link.click();
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'JoyCafe · Festival Kembang Api';
    document.body.classList.add('bazar-mode');
    return () => { document.title = previousTitle; document.body.classList.remove('bazar-mode'); };
  }, []);

  return (
    <main className="bazar-page">
      <button className="bazar-print-button" onClick={downloadBazaarPng}><Download size={16} /> Unduh PNG A4</button>
      <section className="bazar-flyer" aria-label="JoyCafe Festival Kembang Api bazaar menu">
        <div className="bazar-spark bazar-spark--one">✦</div><div className="bazar-spark bazar-spark--two">✧</div>
        <header className="bazar-header">
          <div className="bazar-brand"><img src={logo} alt="" /><span>JOYCAFE<small>HOT &amp; COLD</small></span></div>
          <p className="bazar-date">6 SEPTEMBER</p>
        </header>
        <div className="bazar-hero">
          <p className="bazar-kicker">FESTIVAL KEMBANG API · P2</p>
          <h1>Ngopi<br /><em>sambil seru.</em></h1>
          <p className="bazar-intro">Minuman dingin yang siap jalan,<br />dibuat cepat untuk malam yang ramai.</p>
        </div>
        <div className="bazar-menu">
          <div className="bazar-menu-title"><span>QUICK POUR + QUICK BITE</span><strong>Pilih favoritmu</strong></div>
          {['Minuman', 'Snack'].map((group) => <div className="bazar-group" key={group}><h3>{group}</h3>{bazaarMenu.filter((item) => item.group === group).map((item, index) => <article className={`bazar-item ${item.image ? '' : 'bazar-item--text'}`} key={item.name}><span className="bazar-number">{String(index + 1).padStart(2, '0')}</span>{item.image ? <img className="bazar-item-image" src={item.image} alt="" /> : null}<div><h2>{item.name}</h2><p>{item.note}</p></div><div className="bazar-item-end"><small>{item.tag}</small>{item.originalPrice && <del>{item.originalPrice}</del>}<strong>{item.price}</strong></div></article>)}</div>)}
        </div>
        <footer className="bazar-footer"><span>Cash · QRIS</span><span>SEDIA SELAMA STOK ADA</span><span>@joycafe.sosialita</span></footer>
      </section>
      <p className="bazar-note">CSS flyer preview · Harga dapat disesuaikan di <code>bazaarMenu</code>.</p>
    </main>
  );
}

function App() {
  const [lang, setLang] = useState('id');
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const t = copy[lang];

  const productsById = useMemo(() => new Map(menu.flatMap((item) => item.products).map((product) => [product.id, product])), []);
  const cartItems = useMemo(() => Object.entries(cart).map(([id, quantity]) => ({ ...productsById.get(id), quantity })).filter((item) => item.id), [cart, productsById]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const updateCart = (productId, change) => {
    setCart((current) => {
      const quantity = Math.max(0, (current[productId] || 0) + change);
      if (!quantity) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity };
    });
  };

  const sendOrder = () => {
    if (!cartItems.length) return;
    const itemLines = cartItems.map((item, index) => `${index + 1}. ${item.name} x${item.quantity} — ${rupiah(item.price * item.quantity)}`);
    const fields = lang === 'id'
      ? [
        'Halo JoyCafe, saya ingin memesan:', '', ...itemLines, '', `Total perkiraan: ${rupiah(cartTotal)}`,
        '', `Nama: ${customerName.trim() || '-'}`, `Waktu ambil / datang: ${pickupTime.trim() || '-'}`,
        `Catatan: ${orderNotes.trim() || '-'}`, '', 'Mohon konfirmasi ketersediaan menu dan total pesanannya. Terima kasih.',
      ]
      : [
        'Hello JoyCafe, I would like to order:', '', ...itemLines, '', `Estimated total: ${rupiah(cartTotal)}`,
        '', `Name: ${customerName.trim() || '-'}`, `Pickup / arrival time: ${pickupTime.trim() || '-'}`,
        `Notes: ${orderNotes.trim() || '-'}`, '', 'Please confirm item availability and the final total. Thank you.',
      ];
    track('whatsapp_order_click');
    window.open(`https://wa.me/6282330777522?text=${encodeURIComponent(fields.join('\n'))}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!cartOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setCartOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('cart-is-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('cart-is-open');
    };
  }, [cartOpen]);

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
            <section className="order-guide" aria-labelledby="order-guide-title">
              <header><div><p className="eyebrow">{t.orderGuideEyebrow}</p><h3 id="order-guide-title">{t.orderGuideTitle}</h3></div><p>{t.orderGuideIntro}</p></header>
              <ol>{t.orderGuideSteps.map(([title, text], index) => <li key={title}><span>{index + 1}</span><div><h4>{title}</h4><p>{text}</p></div></li>)}</ol>
              <p className="order-guide-note"><Check size={17} />{t.orderGuideNote}</p>
            </section>
            <div className="menu-controls">
              <div className="category-tabs" aria-label="Menu categories">
                <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>{t.all}</button>
                {menu.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{categoryLabels[item.id][lang === 'id' ? 0 : 1]}</button>)}
              </div>
              <div className="menu-tools">
                <label className="search-box"><Search size={18} /><span className="sr-only">{t.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />{query && <button type="button" onClick={() => setQuery('')} aria-label={t.clearSearch}><X size={16} /></button>}</label>
                <button className="cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`${t.cart}: ${cartCount}`}><ShoppingBag size={18} /><span>{t.cart}</span><strong>{cartCount}</strong></button>
              </div>
            </div>
            <div className="menu-grid">
              {visibleMenu.map((item) => (
                <article className="menu-category" key={item.id}>
                  <header><span>{String(menu.findIndex((entry) => entry.id === item.id) + 1).padStart(2, '0')}</span><h3>{categoryLabels[item.id][lang === 'id' ? 0 : 1]}</h3></header>
                  <div>{item.products.map((product) => <div className="menu-item" key={product.id}><span>{product.name}{product.favorite && <small>★</small>}</span><i /><strong>{rupiah(product.price)}</strong>{cart[product.id] ? <div className="menu-quantity" aria-label={`${product.name}: ${cart[product.id]}`}><button type="button" onClick={() => updateCart(product.id, -1)} aria-label={`${t.decreaseItem}: ${product.name}`}><Minus size={14} /></button><b>{cart[product.id]}</b><button type="button" onClick={() => updateCart(product.id, 1)} aria-label={`${t.increaseItem}: ${product.name}`}><Plus size={14} /></button></div> : <button className="menu-add" type="button" onClick={() => updateCart(product.id, 1)}><Plus size={14} />{t.addToCart}</button>}</div>)}</div>
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

      {cartCount > 0 && <button className="floating-cart" type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>{t.cart}</span><strong>{cartCount}</strong><em>{rupiah(cartTotal)}</em></button>}

      {cartOpen && <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <header className="cart-header"><div><p className="eyebrow">JOYCAFE ORDER</p><h2 id="cart-title">{t.cart}</h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label={t.closeCart}><X /></button></header>
          <p className="cart-hint">{t.cartHint}</p>
          {cartItems.length ? <>
            <div className="cart-items">{cartItems.map((item) => <article key={item.id} className="cart-item"><div><h3>{item.name}</h3><p>{rupiah(item.price)} × {item.quantity}</p></div><div className="cart-item-actions"><button type="button" onClick={() => updateCart(item.id, -1)} aria-label={`${t.decreaseItem}: ${item.name}`}><Minus size={15} /></button><strong>{item.quantity}</strong><button type="button" onClick={() => updateCart(item.id, 1)} aria-label={`${t.increaseItem}: ${item.name}`}><Plus size={15} /></button><button className="cart-remove" type="button" onClick={() => updateCart(item.id, -item.quantity)} aria-label={`${t.removeItem}: ${item.name}`}><Trash2 size={15} /></button></div></article>)}</div>
            <div className="cart-total"><span>{t.estimatedTotal}</span><strong>{rupiah(cartTotal)}</strong></div>
            <div className="order-fields">
              <label><span>{t.customerName}</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder={t.customerNamePlaceholder} /></label>
              <label><span>{t.pickupTime}</span><input value={pickupTime} onChange={(event) => setPickupTime(event.target.value)} placeholder={t.pickupTimePlaceholder} /></label>
              <label><span>{t.orderNotes}</span><textarea rows="3" value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder={t.orderNotesPlaceholder} /></label>
            </div>
            <button className="whatsapp-order" type="button" onClick={sendOrder}>{t.sendWhatsapp}<ArrowRight size={18} /></button>
            <button className="clear-cart" type="button" onClick={() => setCart({})}>{t.clearCart}</button>
          </> : <div className="cart-empty"><ShoppingBag size={42} /><p>{t.cartEmpty}</p><button type="button" onClick={() => setCartOpen(false)}>{t.menu}</button></div>}
        </aside>
      </div>}
    </main>
  );
}

const page = window.location.pathname.startsWith('/story')
  ? <StoryStudio />
  : window.location.pathname.startsWith('/banner') ? <BannerStudio />
  : window.location.pathname.startsWith('/bazar') ? <BazaarStudio /> : <App />;

createRoot(document.getElementById('root')).render(page);
