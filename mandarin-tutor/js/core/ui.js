// Small DOM/UI helpers shared across views: element builder, toasts, modal, confetti-lite.

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(c) : c);
  });
  return node;
}

// Blurs the current focus target (e.g. after grading an answer). Prevents
// mobile browsers from "helpfully" re-scrolling to keep a now-disabled or
// about-to-move input/button in view, which reads as a random page jump.
export function blurActive() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
}

export function esc(str) {
  const d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
}

let toastContainer = null;
export function toast(message, { type = "info", duration = 3200, icon = "" } = {}) {
  if (!toastContainer) {
    toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = el("div", { id: "toast-container", class: "toast-container" });
      document.body.appendChild(toastContainer);
    }
  }
  const t = el("div", { class: `toast toast-${type}` }, [
    icon ? el("span", { class: "toast-icon" }, icon) : null,
    el("span", { class: "toast-msg" }, message)
  ].filter(Boolean));
  toastContainer.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, duration);
}

export function xpToast(amount, reason) {
  toast(`+${amount} XP · ${reason}`, { type: "xp", icon: "⚡" });
}

export function achievementToast(a) {
  toast(`Achievement unlocked: ${a.name}`, { type: "achievement", icon: a.icon || "🏅" });
}

export function openModal(contentNode, { title = "", onClose } = {}) {
  const overlay = el("div", { class: "modal-overlay" });
  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal-header" }, [
      el("h3", {}, title),
      el("button", { class: "modal-close", "aria-label": "Close", onclick: () => close() }, "×")
    ]),
    el("div", { class: "modal-body" }, contentNode)
  ]);
  overlay.appendChild(modal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  function close() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 200);
    onClose && onClose();
  }
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  return { close };
}

export function progressBar(pct, { label = "" } = {}) {
  return el("div", { class: "progress-bar", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": "0", "aria-valuemax": "100" }, [
    el("div", { class: "progress-bar-fill", style: `width:${Math.max(0, Math.min(100, pct))}%` }),
    label ? el("span", { class: "progress-bar-label" }, label) : null
  ].filter(Boolean));
}

export function badge(text, variant = "default") {
  return el("span", { class: `badge badge-${variant}` }, text);
}

export function downloadJSON(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function confettiBurst() {
  const layer = el("div", { class: "confetti-layer" });
  document.body.appendChild(layer);
  const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff"];
  for (let i = 0; i < 40; i++) {
    const piece = el("div", { class: "confetti-piece" });
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = Math.random() * 0.4 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }
  setTimeout(() => layer.remove(), 2200);
}
