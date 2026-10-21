const $ = (id) => document.getElementById(id);
let tabId = null;
let state = null;

const key = () => 'timer_' + tabId;

function fmtDur(s) {
  if (s >= 3600 && s % 3600 === 0) return (s / 3600) + ' saat';
  if (s >= 60 && s % 60 === 0) return (s / 60) + ' dakika';
  return s + ' saniye';
}
function fmtClock(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const p = (n) => String(n).padStart(2, '0');
  return (h ? h + ':' : '') + p(m) + ':' + p(s);
}

function readForm() {
  const u = parseInt($('unit').value, 10);
  const seconds = Math.round(parseFloat($('val').value) * u);
  const random = $('random').checked;
  const maxSeconds = random ? Math.round(parseFloat($('maxVal').value) * u) : seconds;
  const infinite = $('infinite').checked;
  const limit = parseInt($('limit').value, 10);
  return { seconds, random, maxSeconds, infinite, limit, hard: $('hard').checked, skipTyping: $('skipTyping').checked };
}

function writeForm(s) {
  const mins = s.seconds % 60 === 0 && (!s.random || s.maxSeconds % 60 === 0);
  $('unit').value = mins ? '60' : '1';
  const u = mins ? 60 : 1;
  $('val').value = s.seconds / u;
  $('random').checked = !!s.random;
  $('maxVal').value = (s.maxSeconds || s.seconds) / u;
  $('infinite').checked = s.infinite !== false;
  $('limit').value = s.limit || 10;
  $('hard').checked = !!s.hard;
  $('skipTyping').checked = s.skipTyping !== false;
  syncRandomUI();
}

function syncRandomUI() {
  const r = $('random').checked;
  $('maxRow').hidden = !r;
  $('lblMin').textContent = r ? 'En az' : 'Süre';
  $('limitRow').hidden = $('infinite').checked;
  $('maxUnit').textContent = $('unit').value === '60' ? 'dakika' : 'saniye';
}

function render() {
  const active = !!state;
  const paused = active && state.paused;
  $('start').disabled = active;
  $('pause').disabled = !active;
  $('stop').disabled = !active;
  $('pause').textContent = paused ? '▶ Devam' : '⏸ Duraklat';
  tick();
}

function tick() {
  if (!state) {
    $('count').textContent = '--:--';
    $('status').textContent = 'Kapalı';
    return;
  }
  const range = state.random
    ? fmtDur(state.seconds) + ' – ' + fmtDur(state.maxSeconds)
    : 'her ' + fmtDur(state.seconds);
  const n = state.count || 0;
  const cnt = state.infinite === false
    ? ' · ' + n + ' / ' + state.limit + ' yenileme'
    : ' · ' + n + ' kez yenilendi (∞)';
  if (state.paused) {
    $('count').textContent = fmtClock(state.remaining || 0);
    $('status').textContent = 'Duraklatıldı (' + range + ')' + cnt;
  } else {
    $('count').textContent = fmtClock((state.nextAt || Date.now()) - Date.now());
    $('status').textContent = 'Aktif (' + range + ')' + cnt;
  }
}

function save(st) {
  state = st;
  chrome.storage.local.set({ [key()]: st }, render);
}

$('start').onclick = () => {
  const f = readForm();
  if (!f.seconds || f.seconds < 1 || (f.random && (!f.maxSeconds || f.maxSeconds < f.seconds))) {
    $('status').textContent = f.random ? 'En çok süre, en az süreden küçük olamaz.' : 'Geçerli bir süre girin.';
    return;
  }
  if (!f.infinite && (!f.limit || f.limit < 1)) {
    $('status').textContent = 'Geçerli bir tekrar sayısı girin.';
    return;
  }
  chrome.storage.local.set({ lastSettings: f });
  const sec = Math.round(f.seconds + Math.random() * (f.maxSeconds - f.seconds));
  save({ ...f, paused: false, count: 0, nextAt: Date.now() + sec * 1000 });
};

$('pause').onclick = () => {
  if (!state) return;
  if (state.paused) {
    save({ ...state, paused: false, nextAt: Date.now() + (state.remaining || state.seconds * 1000), remaining: 0 });
  } else {
    save({ ...state, paused: true, remaining: Math.max(0, state.nextAt - Date.now()), nextAt: null });
  }
};

$('stop').onclick = () => {
  state = null;
  chrome.storage.local.remove(key(), render);
};

document.querySelectorAll('.chips button').forEach((b) => {
  b.onclick = () => {
    $('val').value = b.dataset.v;
    $('unit').value = b.dataset.u;
    if ($('random').checked) $('maxVal').value = Math.max(parseFloat($('maxVal').value), parseFloat(b.dataset.v));
    syncRandomUI();
  };
});
$('random').onchange = syncRandomUI;
$('infinite').onchange = syncRandomUI;
$('unit').onchange = syncRandomUI;

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  tabId = tab.id;
  chrome.storage.local.get([key(), 'lastSettings'], (d) => {
    if (d.lastSettings) writeForm(d.lastSettings);
    state = d[key()] || null;
    if (state) writeForm(state);
    syncRandomUI();
    render();
  });
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area === 'local' && key() in ch) { state = ch[key()].newValue || null; render(); }
  });
  setInterval(tick, 250);
});
