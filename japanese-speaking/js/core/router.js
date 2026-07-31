const routes = new Map();
let rootEl = null;
let navLinks = [];

export function registerRoute(path, render) {
  routes.set(path, render);
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/dashboard";
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
}

export function initRouter(root, links) {
  rootEl = root;
  navLinks = links;
  window.addEventListener("hashchange", resolve);
  resolve();
}

export function navigate(path) {
  window.location.hash = path;
}
