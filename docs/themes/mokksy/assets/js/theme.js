/* ─── Theme Toggle (3-state: light / dark / auto) ────────────────── */
(function () {
  const KEY = 'mokksy-theme';

  function resolve(pref) {
    if (!pref || pref === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return pref;
  }

  function apply(pref) {
    pref = pref || 'auto';
    document.documentElement.setAttribute('data-theme', resolve(pref));
    document.documentElement.setAttribute('data-theme-pref', pref);
    if (pref === 'auto') {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, pref);
    }
    updateBtn(pref);
  }

  function updateBtn(pref) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const labels = {light: 'Switch to dark', dark: 'Switch to auto (system)', auto: 'Switch to light'};
    const label = (labels[pref] || 'Toggle theme') + ' theme';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  function next(pref) {
    if (pref === 'light') return 'dark';
    if (pref === 'dark')  return 'auto';
    return 'light';
  }

  // Boot
  const stored = localStorage.getItem(KEY);
  apply(stored || 'auto');

  // Follow OS changes while in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(KEY)) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    updateBtn(document.documentElement.getAttribute('data-theme-pref') || 'auto');
    btn.addEventListener('click', function () {
      apply(next(document.documentElement.getAttribute('data-theme-pref') || 'auto'));
    });
  });
})();

document.addEventListener('DOMContentLoaded', function () {

  // Standalone code blocks
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const wrap = btn.closest('.code-wrap');
      const code = wrap ? wrap.querySelector('pre') : null;
      if (!code) return;
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.classList.add('copied');
        btn.querySelector('.copy-label').textContent = 'Copied!';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.querySelector('.copy-label').textContent = 'Copy';
        }, 2000);
      });
    });
  });

  // Code tab copy buttons
  document.querySelectorAll('.tab-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const wrap = btn.closest('.code-tabs-wrap');
      const active = wrap ? wrap.querySelector('.tab-panel.active pre') : null;
      if (!active) return;
      navigator.clipboard.writeText(active.innerText).then(function () {
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  });

/* ─── Code Tabs ─────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.code-tabs-wrap').forEach(function (wrap) {
    const tabs   = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const lang = tab.dataset.lang;
        tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.lang === lang); });
        panels.forEach(function (p) { p.classList.toggle('active', p.dataset.lang === lang); });
      });
    });
  });

/* ─── ToC Active Spy ───────────────────────────────────────────────────────── */
  const tocLinks = document.querySelectorAll('.toc-nav a');
  if (tocLinks.length) {
    const headings = Array.from(
      document.querySelectorAll('.docs-content h2[id], .docs-content h3[id], .docs-content h4[id]')
    );

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-60px 0px -70% 0px', threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });
  }

/* ─── Reveal on Scroll ─────────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

/* ─── Language labels on Hugo code blocks ─────────────────────────────────────── */
  const SKIP_LANGS = new Set(['text', 'plain', 'plaintext', '']);
  document.querySelectorAll('.highlight code[data-lang]').forEach(function (code) {
    const lang = (code.getAttribute('data-lang') || '').trim().toLowerCase();
    if (!SKIP_LANGS.has(lang)) {
      code.closest('.highlight').setAttribute('data-lang', lang);
    }
  });
/* ─── Heading Anchor Links ─────────────────────────────────────────────────── */
  document.querySelectorAll('.docs-content h2[id], .docs-content h3[id], .docs-content h4[id]')
    .forEach(function (h) {
      const a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      h.appendChild(a);
    });

  });
