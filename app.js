/* ══════════════════════════════════════
   app.js — Kelas Mahakam
   Firebase config + Features + Chat
══════════════════════════════════════ */

// ─── Firebase Config ───
const firebaseConfig = {
  apiKey: "AIzaSyDRMsEApnYGiloej-IYoY6mEpvMt6iRZlc",
  authDomain: "chat-anonim-mahakam.firebaseapp.com",
  databaseURL: "https://chat-anonim-mahakam-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-anonim-mahakam",
  storageBucket: "chat-anonim-mahakam.firebasestorage.app",
  messagingSenderId: "270549776266",
  appId: "1:270549776266:web:9f1eaf52c5aadb18577a73"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ══════════════════════════════════════
   COUNTDOWN — 13 Mei 2026
══════════════════════════════════════ */
const GRAD_DATE = new Date("2026-05-13T08:00:00+08:00").getTime();

const elDays    = document.getElementById("days");
const elHours   = document.getElementById("hours");
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");

function pad(n) { return String(n).padStart(2, "0"); }

function tickEl(el, val) {
  const v = pad(val);
  if (el && el.textContent !== v) {
    el.textContent = v;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
    setTimeout(() => el.classList.remove("tick"), 200);
  }
}

function updateCountdown() {
  const diff = GRAD_DATE - Date.now();
  if (diff <= 0) {
    [elDays, elHours, elMinutes, elSeconds].forEach(el => {
      if (el) el.textContent = "00";
    });
    return;
  }
  tickEl(elDays,    Math.floor(diff / 86400000));
  tickEl(elHours,   Math.floor((diff % 86400000) / 3600000));
  tickEl(elMinutes, Math.floor((diff % 3600000)  / 60000));
  tickEl(elSeconds, Math.floor((diff % 60000)    / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Final message H-3 ── */
if ((GRAD_DATE - Date.now()) / 86400000 <= 3) {
  const fm = document.getElementById("finalMessage");
  if (fm) fm.style.display = "block";
}

/* ══════════════════════════════════════
   STUDENT CARDS — warna spektrum A→Z
══════════════════════════════════════ */
const students = [
  "Adelia Felicia",
  "Afiqah Humayra Arresky",
  "Alexandra Shavira Kaysa",
  "Alisya Zella Naura Saputro",
  "Alita Admiral",
  "Aqillah Khayyirah",
  "Azima Zafeera Khairiya",
  "Azka Aisy Muhammad Firdaus",
  "Farrel Azka Firlana",
  "Fattah Altaf Qusyairi",
  "Giovanny Syahputra",
  "Gusti Muhammad An-Nafis",
  "Hilmi Muhammad Nidho Mudhin",
  "Khalika Ismatullah Assahla",
  "Muhammad Abdurrahman Dzaki",
  "Muhammad El Junot Razqal",
  "Muhammad Fahri Ardani",
  "Muhammad Hafidz Setiadi",
  "Muhammad Juna Defa Alfarizie",
  "Muhammad Zharif Syatir",
  "Syifa Fathiyah Zahra"
];

// Spektrum warm: coral merah → amber → hijau tua → teal → biru kehijauan
// Berbeda dari web angkatan (navy + gold)
function getAvatarGradient(letter) {
  const idx = letter.charCodeAt(0) - 65;
  const t   = Math.max(0, Math.min(idx, 25)) / 25;
  // Hue: 0°(coral) → 60°(amber) → 150°(hijau) → 195°(teal) — warm-to-nature range
  const hue1 = Math.round(t * 195);
  const hue2 = hue1 + 18;
  return `linear-gradient(135deg, hsl(${hue1},68%,38%), hsl(${hue2},60%,52%))`;
}

const muridGrid = document.getElementById("muridGrid");
if (muridGrid) {
  students.forEach(name => {
    const letter = name.charAt(0).toUpperCase();
    const card = document.createElement("div");
    card.className = "murid-card";
    card.innerHTML = `
      <div class="murid-avatar"></div>
      <h3>${name}</h3>
    `;
    const avatar = card.querySelector(".murid-avatar");
    avatar.textContent = letter;
    avatar.style.background = getAvatarGradient(letter);
    muridGrid.appendChild(card);
  });
}

/* ══════════════════════════════════════
   SPOTLIGHT — Murid Hari Ini (Global)
══════════════════════════════════════ */
const todayRef = db.ref("todayStudent");
const todayEl  = document.getElementById("todayStudent");

todayRef.once("value", snap => {
  const data = snap.val();
  const today = new Date().toDateString();
  if (!data || data.date !== today) {
    const pick = students[Math.floor(Math.random() * students.length)];
    todayRef.set({ name: pick, date: today });
  }
});

todayRef.on("value", snap => {
  if (snap.val() && todayEl) todayEl.textContent = snap.val().name;
});

/* ══════════════════════════════════════
   LIVE MOOD
══════════════════════════════════════ */
document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    db.ref("mood/" + btn.dataset.mood).transaction(v => (v || 0) + 1);
    btn.style.transform = "scale(1.25)";
    setTimeout(() => btn.style.transform = "", 250);
  });
});

db.ref("mood").on("value", snap => {
  let top = "", max = 0;
  snap.forEach(s => {
    if (s.val() > max) { max = s.val(); top = s.key; }
  });
  const el = document.getElementById("topMood");
  if (el) el.textContent = top ? `Mood terbanyak sekarang: ${top} (${max}x)` : "";
});

/* ══════════════════════════════════════
   GENERATOR — Kalau Mahakam Adalah…
══════════════════════════════════════ */
const phrases = [
  "keluarga yang tidak pernah kamu minta tapi selalu kamu syukuri",
  "rumah kedua yang akan selalu rindu kamu pulang",
  "cerita yang belum selesai ditulis",
  "tempat di mana mimpi mulai punya bentuk",
  "pelukan panjang yang sulit dilepas",
  "bab terbaik dari buku hidupmu",
  "tawa yang selalu terngiang di mana pun kamu pergi",
  "awal dari segalanya"
];

function generateMahakam() {
  const result = document.getElementById("mahakamResult");
  if (!result) return;
  result.style.opacity = "0";
  result.style.transform = "translateY(10px)";
  setTimeout(() => {
    result.textContent = '"Mahakam adalah ' + phrases[Math.floor(Math.random() * phrases.length)] + '."';
    result.style.opacity = "1";
    result.style.transform = "translateY(0)";
  }, 200);
}

/* ══════════════════════════════════════
   CHAT ANONIM
══════════════════════════════════════ */
const chatRef    = db.ref("chat");
const typingRef  = db.ref("typing");
const chatBox    = document.getElementById("chatBox");
const chatToggle = document.getElementById("chatToggle");
const chatInput  = document.getElementById("chatInput");
const sendBtn    = document.getElementById("sendBtn");
const chatMsgs   = document.getElementById("chatMessages");
const typingBar  = document.getElementById("typingBar");

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatRef.push({ msg: text, time: Date.now() });
  chatInput.value = "";
}

if (sendBtn) sendBtn.addEventListener("click", sendMessage);

if (chatInput) {
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chatInput.addEventListener("input", () => {
    typingRef.set(true);
    clearTimeout(window._typingTimer);
    window._typingTimer = setTimeout(() => typingRef.set(false), 1500);
  });
}

typingRef.on("value", s => {
  if (typingBar) typingBar.textContent = s.val() ? "Seseorang sedang mengetik..." : "";
});

chatRef.limitToLast(50).on("child_added", s => {
  const d = s.val();
  const div = document.createElement("div");
  div.className = "message";
  const time = new Date(d.time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  div.innerHTML = `${escHtml(d.msg)}<span>${time}</span>`;
  if (chatMsgs) {
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }
});

if (chatToggle) {
  chatToggle.addEventListener("click", () => chatBox.classList.toggle("show"));
}

function escHtml(t) {
  return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
