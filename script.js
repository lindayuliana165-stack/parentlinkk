
const KEY_MEMBER = "parentlink_members";
const KEY_AGENDA = "parentlink_agenda";
const KEY_CHECK = "parentlink_checks";

function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function aman(teks) {
  return String(teks ?? "").replace(/[&<>"']/g, huruf => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[huruf]));
}

// TAMBAH ANGGOTA PAGUYUBAN
const memberForm = document.getElementById("memberForm");

if (memberForm) {
  memberForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(memberForm);
    const anggota = getData(KEY_MEMBER);

    anggota.push({
      id: Date.now(),
      nama: data.get("nama"),
      kelas: data.get("kelas"),
      peran: data.get("peran")
    });

    saveData(KEY_MEMBER, anggota);
    memberForm.reset();
    tampilkanAnggota();
  });
}

function tampilkanAnggota() {
  const tempat = document.getElementById("memberList");
  if (!tempat) return;

  const anggota = getData(KEY_MEMBER);

  if (anggota.length === 0) {
    tempat.innerHTML = '<p class="empty">Belum ada anggota.</p>';
    return;
  }

  tempat.innerHTML = anggota.map(a => `
    <div class="member-item">
      <div>
        <strong>${aman(a.nama)}</strong><br>
        <small>${aman(a.kelas)} · ${aman(a.peran)}</small>
      </div>
      <button class="delete-btn"
        onclick="hapusAnggota(${a.id})">Hapus</button>
    </div>
  `).join("");
}

function hapusAnggota(id) {
  const anggota = getData(KEY_MEMBER)
    .filter(a => a.id !== id);

  saveData(KEY_MEMBER, anggota);
  tampilkanAnggota();
}

// TAMBAH AGENDA
const agendaForm = document.getElementById("agendaForm");

if (agendaForm) {
  agendaForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(agendaForm);
    const agenda = getData(KEY_AGENDA);

    agenda.push({
      id: Date.now(),
      kegiatan: data.get("kegiatan"),
      tanggal: data.get("tanggal"),
      tempat: data.get("tempat")
    });

    saveData(KEY_AGENDA, agenda);
    agendaForm.reset();
    tampilkanAgenda();
  });
}

function tampilkanAgenda() {
  const tempat = document.getElementById("agendaList");
  if (!tempat) return;

  const agenda = getData(KEY_AGENDA)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  if (agenda.length === 0) {
    tempat.innerHTML = '<p class="empty">Belum ada agenda kegiatan.</p>';
    return;
  }

  tempat.innerHTML = agenda.map(a => `
    <div class="agenda-item">
      <div>
        <strong>${aman(a.kegiatan)}</strong><br>
        <small>${aman(a.tanggal)} · ${aman(a.tempat || "Tempat belum ditentukan")}</small>
      </div>
      <button class="delete-btn"
        onclick="hapusAgenda(${a.id})">Hapus</button>
    </div>
  `).join("");
}

function hapusAgenda(id) {
  const agenda = getData(KEY_AGENDA)
    .filter(a => a.id !== id);

  saveData(KEY_AGENDA, agenda);
  tampilkanAgenda();
}

// CHECKLIST KOMITE
document.querySelectorAll("[data-check]").forEach(kotak => {
  const tersimpan = getData(KEY_CHECK);
  kotak.checked = tersimpan.includes(kotak.dataset.check);

  kotak.addEventListener("change", function() {
    let data = getData(KEY_CHECK);

    if (kotak.checked) {
      data.push(kotak.dataset.check);
    } else {
      data = data.filter(x => x !== kotak.dataset.check);
    }

    saveData(KEY_CHECK, [...new Set(data)]);
  });
});

// TAMPILKAN DATA SAAT HALAMAN DIBUKA
tampilkanAnggota();
tampilkanAgenda();
