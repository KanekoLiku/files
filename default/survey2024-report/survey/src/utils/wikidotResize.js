function createResizeIframe(site, frameId) {
  let container = document.getElementById("resizer-container");
  if (container == null) {
    container = document.createElement("div");
    container.id = "resizer-container";
    document.body.appendChild(container);
  }

  let sentinel = document.getElementById("wikidot-resize-sentinel");
  if (sentinel == null) {
    sentinel = document.createElement("div");
    sentinel.id = "wikidot-resize-sentinel";
    sentinel.style.cssText = "height:0;overflow:hidden;clear:both;";
    document.body.appendChild(sentinel);
  } else {
    document.body.appendChild(sentinel);
  }

  const cleanFrameId = frameId.replace(/^\/+/, "");
  let lastSent = -1;
  let resizer = document.getElementById("wikidot-resizer-frame");
  if (!resizer) {
    resizer = document.createElement("iframe");
    resizer.id = "wikidot-resizer-frame";
    resizer.style.display = "none";
    container.appendChild(resizer);
  }

  const measure = () => {
    const root = document.getElementById('root');
    let rootHeight = 0;
    if (root) {
      const rect = root.getBoundingClientRect();
      rootHeight = Math.max(
        root.scrollHeight || 0,
        root.offsetHeight || 0,
        rect.height || 0,
      );
    }
    if (!rootHeight) {
      const fallback = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      return fallback;
    }
    return rootHeight;
  };

  const send = () => {
    const h = Math.max(0, Math.ceil(measure()));
    if (h === lastSent) return;
    lastSent = h;
    const next = `${site}/common--javascript/resize-iframe.html#${h}/${cleanFrameId}`;
    if (resizer.src !== next) {
      resizer.src = "about:blank";
      setTimeout(() => (resizer.src = next), 30);
    }
  };

  const debounce = (fn, wait) => {
    let t = 0;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  };

  const run = debounce(send, 80);

  window.addEventListener('resize', run, { passive: true });
  window.addEventListener('hashchange', run);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(run);
    ro.observe(document.documentElement);
    ro.observe(document.body);
    const root = document.getElementById('root');
    if (root) ro.observe(root);
    ro.observe(sentinel);
  }

  const mo = new MutationObserver(run);
  mo.observe(document.body, { childList: true, subtree: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => run());
  }

  setInterval(run, 1000);

  requestAnimationFrame(() => {
    send();
    let n = 0;
    const tick = () => {
      n += 1;
      send();
      if (n < 5) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  return send;
}

export function initWikidotResize() {
  const site = 'http://scp-jp.wikidot.com';
  const frameId = 'index.html';
  const trigger = createResizeIframe(site, frameId);
  try { window.wikidotResize = trigger; } catch { }
  trigger();
}
