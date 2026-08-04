import { getState, setLastRoute } from "./storage.js";

const routes = new Map();
let rootEl = null;
let navLinks = [];

export function registerRoute(path, render) {
  routes.set(path, render);
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) return hash;
  // No hash means a fresh load (e.g. tapping the home-screen icon) — go back to wherever
  // the user last was instead of always resetting to the Dashboard.
  return getState().lastRoute || "/dashboard";
}

function resolve() {
  const path = currentPath();
  const [base, param] = path.split("/").filter(Boolean).reduce(
    (acc, seg, i) => (i === 0 ? [`/${seg}`, acc[1]] : [acc[0], seg]),
    ["/dashboard", undefined]
  );
  const render = routes.get(base) || routes.get("/dashboard");
  rootEl.innerHTML = "";
  render(rootEl, { param });
  navLinks.forEach((a) => {
    const match = a.getAttribute("href") === `#${base}`;
    a.classList.toggle("active", match);
    a.setAttribute("aria-current", match ? "page" : "false");
  });
  rootEl.focus();
  window.scrollTo(0, 0);
  setLastRoute(path);
}

export function initRouter(root, links) {
  rootEl = root;
  navLinks = links;
  // Fresh load with no hash: adopt the remembered route into the URL itself so refreshing
  // or sharing the link keeps you where you were, instead of only resolving it once here.
  if (!window.location.hash) {
    const remembered = getState().lastRoute;
    if (remembered) window.location.hash = remembered;
  }
  window.addEventListener("hashchange", resolve);
  resolve();
}

export function navigate(path) {
  window.location.hash = path;
}
