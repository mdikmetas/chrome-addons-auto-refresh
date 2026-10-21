chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'whoami') {
    sendResponse({ tabId: sender.tab && sender.tab.id });
  } else if (msg.type === 'reload' && sender.tab) {
    chrome.tabs.reload(sender.tab.id, { bypassCache: !!msg.hard });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove('timer_' + tabId);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const key in changes) {
    if (!key.startsWith('timer_')) continue;
    const tabId = parseInt(key.slice(6), 10);
    const nv = changes[key].newValue;
    const text = !nv ? '' : (nv.paused ? 'II' : 'ON');
    chrome.action.setBadgeText({ tabId, text }).catch(() => {});
    chrome.action.setBadgeBackgroundColor({ tabId, color: nv && nv.paused ? '#f9a825' : '#2e7d32' }).catch(() => {});
  }
});

// Kısayol: Alt+Shift+R -> aç/kapat (son kullanılan ayarlarla)
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd !== 'toggle-refresh') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  const key = 'timer_' + tab.id;
  const d = await chrome.storage.local.get([key, 'lastSettings']);
  if (d[key]) {
    await chrome.storage.local.remove(key);
  } else {
    const s = d.lastSettings || { seconds: 30 };
    const max = s.random ? Math.max(s.maxSeconds || s.seconds, s.seconds) : s.seconds;
    const sec = Math.round(s.seconds + Math.random() * (max - s.seconds));
    await chrome.storage.local.set({
      [key]: { ...s, paused: false, count: 0, nextAt: Date.now() + sec * 1000 }
    });
  }
});
