// Minimal hash-based SPA router.

const routes = new Map(); // pattern -> { render }
let notFoundHandler = null;
let currentCleanup = null;

export function registerRoute(pattern, render) {
  routes.set(pattern, render);
}

export function setNotFound(fn) {
  notFoundHandler = fn;
}

function matchRoute(hash) {
  const path = hash.replace(/^#\/?/, "").split("?")[0];
  const segments = path.split("/").filter(Boolean);
  for (const [pattern, render] of routes) {
    const pSegments = pattern.split("/").filter(Boolean);
    if (pSegments.length !== segments.length && !pattern.endsWith("*")) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pSegments.length; i++) {
      const p = pSegments[i];
      if (p === "*") {
        params["*"] = segments.slice(i).join("/");
        break;
      } else if (p.startsWith(":")) {
        params[p.slice(1)] = decodeURIComponent(segments[i] || "");
      } else if (p !== segments[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { render, params };
  }
  return null;
}

export async function handleRoute() {
  const container = document.getElementById("view-root");
  if (!container) return;
  if (typeof currentCleanup === "function") {
    try {
      currentCleanup();
    } catch (e) {}
    currentCleanup = null;
  }
  const hash = window.location.hash || "#/dashboard";
  const match = matchRoute(hash);
  container.classList.add("view-fade-out");
  await new Promise((r) => setTimeout(r, 90));
  container.innerHTML = "";
  container.classList.remove("view-fade-out");
  container.classList.add("view-fade-in");
  updateActiveNav(hash);
  try {
    if (match) {
      const cleanup = await match.render(container, match.params);
      if (typeof cleanup === "function") currentCleanup = cleanup;
    } else if (notFoundHandler) {
      notFoundHandler(container);
    }
  } catch (err) {
    console.error("Route render error:", err);
    container.innerHTML = `<div class="card"><h2>Se ha producido un error</h2><p>${err.message}</p></div>`;
  }
  setTimeout(() => container.classList.remove("view-fade-in"), 300);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  window.scrollTo(0, 0);
}

function updateActiveNav(hash) {
  const base = "#/" + (hash.replace(/^#\/?/, "").split("/")[0] || "dashboard");
  document.querySelectorAll("[data-nav-link]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("href") === base);
  });
}

export function navigate(hash) {
  if (window.location.hash === hash) {
    handleRoute();
  } else {
    window.location.hash = hash;
  }
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}
