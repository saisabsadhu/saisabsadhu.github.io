/* ─── Visit Counter ─────────────────────────────────────────────────────── */
/*
 * Uses CountAPI (countapi.xyz) — free, no signup.
 * One-time setup after deploying to GitHub Pages:
 *   1. Open your browser console on the live site and run:
 *        fetch('https://api.countapi.xyz/set/saisab-portfolio/visits?value=234')
 *      This seeds the counter at 234.
 *   2. After that, every page load auto-increments via the hit endpoint below.
 *
 * NAMESPACE below ('saisab-portfolio') must match what you used in step 1.
 */
(function () {
  const BASE = 0; // offset already baked into CountAPI via the one-time seed above
  const NAMESPACE = 'saisab-portfolio';
  const KEY = 'visits';
  const countEl = document.getElementById('visitCount');

  fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
    .then(r => r.json())
    .then(data => {
      if (countEl && data.value) {
        countEl.textContent = (data.value + BASE).toLocaleString();
      }
    })
    .catch(() => {
      if (countEl) countEl.textContent = '234+';
    });
})();

/* ─── Theme Toggle ──────────────────────────────────────────────────────── */

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ─── Mobile Menu ───────────────────────────────────────────────────────── */

const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ─── Abstract Toggle ───────────────────────────────────────────────────── */

document.querySelectorAll('.abstract-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.pub-card');
    const abstract = card.querySelector('.pub-abstract');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    abstract.hidden = expanded;
  });
});

/* ─── BibTeX Toggle ─────────────────────────────────────────────────────── */

document.querySelectorAll('.bibtex-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.pub-card');
    const bibtex = card.querySelector('.pub-bibtex');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    bibtex.hidden = expanded;
  });
});

/* ─── BibTeX Copy ───────────────────────────────────────────────────────── */

document.querySelectorAll('.copy-bibtex-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const code = btn.closest('.pub-bibtex').querySelector('.bibtex-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

/* ─── Card click → open abstract ────────────────────────────────────────── */

document.querySelectorAll('.pub-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.abstract-toggle') ||
        e.target.closest('.bibtex-toggle') ||
        e.target.closest('.copy-bibtex-btn') ||
        e.target.closest('.pub-link-btn') ||
        e.target.closest('a')) return;
    const btn = card.querySelector('.abstract-toggle');
    btn.click();
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.querySelector('.abstract-toggle').click();
    }
  });
});

/* ─── Nav Social Icons — appear when hero leaves view ───────────────────── */

const navSocial = document.getElementById('navSocial');
const heroSection = document.getElementById('hero');

const heroVisibilityObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    navSocial.classList.toggle('visible', !entry.isIntersecting);
  });
}, { threshold: 0.1 });

heroVisibilityObserver.observe(heroSection);

/* ─── Active Nav Link on Scroll ─────────────────────────────────────────── */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* ─── Fade-in on Scroll ─────────────────────────────────────────────────── */

const fadeTargets = document.querySelectorAll(
  '.research-card, .pub-card, .timeline-item, .ach-card, .skill-group, .conf-item'
);

fadeTargets.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeTargets.forEach(el => fadeObserver.observe(el));

/* ─── Nav Active Style ───────────────────────────────────────────────────── */

const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--accent);
    background-color: var(--accent-muted);
  }
`;
document.head.appendChild(style);
