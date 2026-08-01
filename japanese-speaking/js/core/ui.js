export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

export function toast(message, { type = "info", duration = 2600 } = {}) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = el("div", { id: "toast-container", class: "toast-container" });
    document.body.appendChild(container);
  }
  const node = el("div", { class: `toast toast-${type}` }, message);
  container.appendChild(node);
  requestAnimationFrame(() => node.classList.add("show"));
  setTimeout(() => {
    node.classList.remove("show");
    setTimeout(() => node.remove(), 300);
  }, duration);
}

export function stripHighlightMarkup(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}

export function progressBar(pct, label) {
  return el("div", { class: "progress-bar", title: label || `${pct}%` }, [
    el("div", { class: "progress-bar-fill", style: `width:${Math.max(0, Math.min(100, pct))}%` }),
  ]);
}
