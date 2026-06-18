/* ============================================================
   HRDW — interactions
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  const bar = $(".preloader__bar span");
  const countEl = $("#loadCount");

  function finishLoad() {
    document.body.removeAttribute("data-scroll-locked");
    preloader && preloader.classList.add("is-done");
    // kick hero intro
    const hero = $("#hero");
    if (hero) requestAnimationFrame(() => hero.classList.add("is-in"));
  }

  if (preloader && !reduceMotion) {
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18);
      if (bar) bar.style.width = p + "%";
      if (countEl) countEl.textContent = Math.floor(p);
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(finishLoad, 350);
      }
    }, 130);
  } else {
    if (bar) bar.style.width = "100%";
    if (countEl) countEl.textContent = "100";
    setTimeout(finishLoad, reduceMotion ? 0 : 200);
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer) {
    document.body.classList.add("cursor-on");
    const cursor = $(".cursor");
    const dot = $(".cursor__dot");
    const ring = $(".cursor__ring");
    const label = $(".cursor__label");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    (function render() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(render);
    })();

    const interactiveSel = "a, button, [data-cursor]";
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest(interactiveSel);
      if (!t) return;
      const txt = t.getAttribute("data-cursor");
      cursor.classList.add("is-hover");
      if (txt) { cursor.classList.add("is-label"); label.textContent = txt; }
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target.closest(interactiveSel);
      if (!t) return;
      cursor.classList.remove("is-hover", "is-label");
    });
  }

  /* ---------- Header hide on scroll down ---------- */
  const header = $("#header");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (header) {
      if (y > lastY && y > 200) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
    }
    lastY = y;
  }, { passive: true });

  /* ---------- Hero blossom parallax ---------- */
  const blossom = $(".hero__blossom");
  if (blossom && !reduceMotion) {
    addEventListener("scroll", () => {
      const y = scrollY;
      if (y < innerHeight) blossom.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* ---------- Role rotator ---------- */
  const rotator = $("#roleRotator");
  if (rotator) {
    const items = $$("span", rotator);
    let i = 0;
    setInterval(() => {
      items[i].classList.remove("is-active");
      i = (i + 1) % items.length;
      items[i].classList.add("is-active");
    }, 2200);
  }

  /* ---------- Scroll reveals + stat counters ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      if (en.target.dataset.count !== undefined) animateCount(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  $$(".reveal").forEach((el) => io.observe(el));
  $$("[data-count]").forEach((el) => io.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1400; const start = performance.now();
    (function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Work filtering ---------- */
  const filters = $$(".filter");
  const tiles = $$(".tile");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-selected", "true");
      const f = btn.dataset.filter;
      tiles.forEach((tile) => {
        const show = f === "all" || tile.dataset.cat === f;
        tile.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Video lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbFrame = $("#lightboxFrame");
  const lbCap = $("#lightboxCap");
  const lbClose = $("#lightboxClose");
  let lastFocused = null;

  function openLightbox(id, title) {
    if (!lightbox || !id) return;
    lastFocused = document.activeElement;
    lbFrame.innerHTML =
      '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(id) +
      '?autoplay=1&color=e8ff3a&title=0&byline=0&portrait=0" ' +
      'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ' +
      'title="' + (title ? title.replace(/"/g, "&quot;") : "Video") + '"></iframe>';
    lbCap.textContent = title || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lbFrame.innerHTML = ""; // stops playback
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  // Tiles (and any element carrying data-vimeo) open the lightbox
  $$("[data-vimeo]").forEach((el) => {
    const id = el.dataset.vimeo;
    const title = el.dataset.title || el.querySelector(".tile__title")?.textContent || "";
    if (el.matches(".tile")) {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "Play " + title);
    }
    el.addEventListener("click", (e) => { e.preventDefault(); openLightbox(id, title); });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(id, title); }
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox?.classList.contains("is-open")) closeLightbox(); });

  /* ---------- Magnetic effect on key buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-cursor]").filter((el) => el.matches(".hero__scroll, .reel__cta, .contact__email"))
      .forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.15;
          const y = (e.clientY - r.top - r.height / 2) * 0.15;
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
      });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $("#menuToggle");
  const menu = $("#menu");
  function setMenu(open) {
    toggle.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$(".menu__link").forEach((l) => l.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Smooth anchor focus for a11y ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
})();
