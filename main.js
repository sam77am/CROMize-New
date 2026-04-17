/* ============================================
   CROMIZE — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ──────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Mobile nav toggle ──────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── FAQ accordion ──────────────────────────
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Intersection Observer for fade-up ──────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Tabs ───────────────────────────────────
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    tabsEl.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const container = tabsEl.closest('[data-tabs-container]') || document;
        container.querySelectorAll('[data-tab-panel]').forEach(panel => {
          panel.style.display = panel.dataset.tabPanel === target ? '' : 'none';
        });
      });
    });
  });

  // ── Pricing toggle (monthly / annual) ──────
  const toggleEl = document.getElementById('billing-toggle');
  if (toggleEl) {
    toggleEl.addEventListener('change', () => {
      const annual = toggleEl.checked;
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
      document.querySelectorAll('.billing-label').forEach((el, i) => {
        el.style.opacity = (i === 0 && !annual) || (i === 1 && annual) ? '1' : '0.4';
      });
    });
  }

  // ── Smooth counter animation ──────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── Score ring animation ───────────────────
  document.querySelectorAll('.score-ring').forEach(ring => {
    const fill = ring.querySelector('.fill');
    const score = parseInt(ring.dataset.score || 72);
    const radius = 52;
    const circ = 2 * Math.PI * radius;
    fill.setAttribute('stroke-dasharray', circ);
    fill.setAttribute('stroke-dashoffset', circ);
    fill.style.stroke = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--gold)' : 'var(--red)';
    setTimeout(() => {
      fill.style.strokeDashoffset = circ * (1 - score / 100);
    }, 400);
  });

  // ── Progress bar animation ─────────────────
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          const pct = fill.dataset.pct || '0';
          setTimeout(() => { fill.style.width = pct + '%'; }, 200);
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.progress-bar').forEach(el => progressObserver.observe(el));

  // ── Copy to clipboard ─────────────────────
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  });

  // ── Toast notification ─────────────────────
  window.showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:var(--bg-elevated);border:1px solid var(--border-strong);
      border-radius:var(--r-md);padding:14px 20px;font-size:.875rem;
      color:var(--text-primary);box-shadow:var(--shadow-lg);
      transform:translateY(10px);opacity:0;transition:all .25s ease;
      display:flex;align-items:center;gap:10px;max-width:360px;
    `;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    const color = type === 'success' ? 'var(--green)' : type === 'error' ? 'var(--red)' : 'var(--gold)';
    toast.innerHTML = `<span style="color:${color};font-weight:700">${icon}</span> ${msg}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.transform = 'translateY(10px)'; toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ── Contact form ───────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type=submit]');
      btn.textContent = 'Sending…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      window.showToast('Message sent! We\'ll get back to you within 24 hours.');
      contactForm.reset(); btn.textContent = 'Send Message'; btn.disabled = false;
    });
  }

  // ── Dashboard sidebar toggle (mobile) ──────
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ── Mark issue as fixed ────────────────────
  document.querySelectorAll('[data-mark-fixed]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.issue-card');
      if (!card) return;
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      btn.textContent = '✓ Marked Fixed';
      btn.style.background = 'var(--green-dim)';
      btn.style.color = 'var(--green)';
      btn.style.borderColor = 'rgba(34,197,94,0.3)';
      window.showToast('Issue marked as fixed. We\'ll check back in 14 days.');
    });
  });

  // ── Onboarding steps ──────────────────────
  window.nextStep = (currentStep, totalSteps) => {
    const current = document.getElementById('step-' + currentStep);
    const next = document.getElementById('step-' + (currentStep + 1));
    if (current) { current.style.display = 'none'; }
    if (next)    { next.style.display = 'block'; }
    updateStepProgress(currentStep + 1, totalSteps);
  };

  window.prevStep = (currentStep) => {
    const current = document.getElementById('step-' + currentStep);
    const prev = document.getElementById('step-' + (currentStep - 1));
    if (current) { current.style.display = 'none'; }
    if (prev)    { prev.style.display = 'block'; }
    updateStepProgress(currentStep - 1, document.querySelectorAll('[id^=step-]').length);
  };

  function updateStepProgress(step, total) {
    document.querySelectorAll('.step-indicator').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === step);
      el.classList.toggle('done', i + 1 < step);
    });
    const bar = document.querySelector('.onboarding-progress-fill');
    if (bar) bar.style.width = ((step - 1) / (total - 1) * 100) + '%';
  }

  // ── Active nav link highlight ──────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath) && currentPath !== '') {
      link.style.color = 'var(--gold)';
    }
  });

  // ── Sidebar active link ────────────────────
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && window.location.pathname.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

});
