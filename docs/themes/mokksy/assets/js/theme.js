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
    if (pref === 'dark') return 'auto';
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

  /* ─── Language Preference (query param > localStorage) ─────────────────────── */
  const LANG_KEY = 'preferred-code-lang';

  function getLangPreference() {
    const params = new URLSearchParams(window.location.search);
    let qp = params.get('lang');
    if (qp) {
      qp = qp.toLowerCase();
      try {
        localStorage.setItem(LANG_KEY, qp);
      } catch (e) {
      }
      return qp;
    }
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
    }
    return null;
  }

  function setLangPreference(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
    }
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    if (history.replaceState) history.replaceState(null, '', url.toString());
  }

  function switchAllTabs(lang) {
    document.querySelectorAll('.code-tabs-wrap, .hero-terminal').forEach(function (w) {
      const hasLang = w.querySelector('.tab-panel[data-lang="' + lang + '"]');
      if (!hasLang) return;
      w.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.lang === lang);
        b.setAttribute('aria-selected', b.dataset.lang === lang ? 'true' : 'false');
      });
      w.querySelectorAll('.tab-panel').forEach(function (p) {
        p.classList.toggle('active', p.dataset.lang === lang);
      });
    });
  }

  function copyCodeFromWrap(wrap, copyBtn) {
    const active = wrap.querySelector('.tab-panel.active');
    if (!active) return;
    const code = active.querySelector('code');
    if (!code) return;
    let text = '';
    code.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        text += node.textContent;
      } else if (node.nodeType === 1) {
        const cl = node.classList;
        if (cl && (cl.contains('ln') || cl.contains('lnt'))) return;
        text += node.textContent;
      }
    });
    navigator.clipboard.writeText(text).then(function () {
      copyBtn.textContent = 'Copied!';
      setTimeout(function () {
        copyBtn.textContent = 'Copy';
      }, 1500);
    }).catch(function () {
      copyBtn.textContent = 'Failed';
      setTimeout(function () {
        copyBtn.textContent = 'Copy';
      }, 1500);
    });
  }

  const savedLang = getLangPreference();

  /* ─── Init Code Tabs (shortcodes + hero terminals) ─────────────────────────── */
  document.querySelectorAll('.code-tabs-wrap, .hero-terminal').forEach(function (wrap) {
    const panels = wrap.querySelectorAll('.tab-panel');
    const tabList = wrap.querySelector('.tab-list');
    if (!tabList || !panels.length) return;

    // Build tab buttons if not already present
    if (!tabList.querySelector('.tab-btn')) {
      const availLangs = [];
      panels.forEach(function (panel) {
        availLangs.push(panel.dataset.lang || 'code');
      });
      const defaultIdx = (savedLang && availLangs.indexOf(savedLang) !== -1) ? availLangs.indexOf(savedLang) : 0;

      panels.forEach(function (panel, i) {
        const lang = panel.dataset.lang || 'code';
        const panelId = panel.id || (wrap.id + '-panel-' + i);
        panel.id = panelId;
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (i === defaultIdx ? ' active' : '');
        btn.type = 'button';
        btn.dataset.lang = lang;
        btn.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', panelId);
        btn.setAttribute('aria-selected', i === defaultIdx ? 'true' : 'false');
        tabList.appendChild(btn);
        panel.classList.toggle('active', i === defaultIdx);
      });
    }

    // Tab click handler
    tabList.addEventListener('click', function (e) {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const lang = btn.dataset.lang;
      setLangPreference(lang);
      switchAllTabs(lang);
    });

    // Copy button
    const copyBtn = wrap.querySelector('.tab-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyCodeFromWrap(wrap, copyBtn);
      });
    }
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
  /* ─── GitHub Button Title Toggle ─────────────────────────────────────── */
  const ghBtn = document.querySelector('.btn-github');
  if (ghBtn) {
    const defaultTitle = 'Open on GitHub';
    const promoTitle = 'Give a star on GitHub';
    const promoStart = 45000;
    const promoEnd = 57000;
    const cycle = 60000;
    let started = null;

    function updateTitle() {
      if (!started) started = performance.now();
      const elapsed = (performance.now() - started) % cycle;
      ghBtn.setAttribute('title', elapsed >= promoStart && elapsed < promoEnd ? promoTitle : defaultTitle);
      requestAnimationFrame(updateTitle);
    }
    requestAnimationFrame(updateTitle);
  }

});
        }
      });
    }, {rootMargin: '-60px 0px -70% 0px', threshold: 0});

    headings.forEach(function (h) {
      observer.observe(h);
    });
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
    }, {threshold: 0.08});
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
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

  /* ─── Home hero code carousel ──────────────────────────────────────────────── */
  const heroCarousel = document.getElementById('hero-carousel');
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.carousel-slide');
    const dotsWrap = heroCarousel.querySelector('.carousel-dots');
    let current = 0;

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = String(i);
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === idx);
      });
      dotsWrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });
      current = idx;
    }

    heroCarousel.querySelector('.carousel-prev').addEventListener('click', function () {
      goTo(current - 1);
    });
    heroCarousel.querySelector('.carousel-next').addEventListener('click', function () {
      goTo(current + 1);
    });
    dotsWrap.addEventListener('click', function (e) {
      const dot = e.target.closest('.carousel-dot');
      if (dot) goTo(parseInt(dot.dataset.index, 10));
    });
  }

});
