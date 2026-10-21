let timer = null;
let myTabId = null;
let scheduledAt = null;
let current = null;

const key = () => 'timer_' + myTabId;

function pickMs(st) {
  const min = st.seconds;
  const max = st.random ? Math.max(st.maxSeconds || min, min) : min;
  return Math.round(min + Math.random() * (max - min)) * 1000;
}

function isTyping() {
  const el = document.activeElement;
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA') return el.value.length > 0;
  if (tag === 'INPUT') return !['button', 'submit', 'checkbox', 'radio'].includes(el.type) && el.value.length > 0;
  return false;
}

function doReload() {
  if (!current || current.paused) return;
  if (current.infinite === false && current.limit && (current.count || 0) >= current.limit) {
    chrome.storage.local.remove(key());
    return;
  }
  if (current.skipTyping && isTyping()) {
    timer = setTimeout(doReload, 5000); // yazı yazılıyorsa 5 sn ertele
    return;
  }
  const st = { ...current, reloading: true };
  chrome.storage.local.set({ [key()]: st }, () => {
    chrome.runtime.sendMessage({ type: 'reload', hard: !!current.hard });
  });
}

function schedule(st) {
  clearTimeout(timer);
  timer = null;
  scheduledAt = null;
  if (!st || st.paused || !st.nextAt) return;
  scheduledAt = st.nextAt;
  timer = setTimeout(doReload, Math.max(0, st.nextAt - Date.now()));
}

chrome.runtime.sendMessage({ type: 'whoami' }, (res) => {
  if (chrome.runtime.lastError || !res || res.tabId == null) return;
  myTabId = res.tabId;
  chrome.storage.local.get(key(), (d) => {
    const st = d[key()];
    if (!st) return;
    const next = {
      ...st,
      reloading: false,
      count: st.reloading ? (st.count || 0) + 1 : (st.count || 0)
    };
    // Sınır dolduysa otomatik durdur
    if (next.infinite === false && next.limit && next.count >= next.limit) {
      chrome.storage.local.remove(key());
      return;
    }
    if (!st.paused) next.nextAt = Date.now() + pickMs(st);
    current = next;
    schedule(next);
    chrome.storage.local.set({ [key()]: next });
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || myTabId == null || !(key() in changes)) return;
  const nv = changes[key()].newValue;
  current = nv || null;
  if (!nv || nv.paused || nv.nextAt !== scheduledAt) schedule(nv);
});
