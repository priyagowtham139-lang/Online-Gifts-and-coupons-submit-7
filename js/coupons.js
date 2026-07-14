document.addEventListener('DOMContentLoaded', () => {

  // ========== Preloader ==========
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader.classList.add('hidden');
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 3000);

  // ========== Scroll Progress =========
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = ((scrollTop / scrollHeight) * 100) + '%';
  });

  // ========== Back to Top ==========
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });

  // ========== Mobile Menu ==========
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
  navLinks.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ========== Scroll Reveal ==========
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe(el);
  });

  // ========== Copy Coupon Code ==========
  window.copyCode = function(code) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    (navigator.clipboard || { writeText: (t) => { msg.textContent = `Copy: ${code}`; } }).writeText(code).then(() => {
      msg.textContent = `Copied "${code}"!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }).catch(() => {
      msg.textContent = `Code: ${code}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    });
  };

  // ========== Coupon Timers (hours-based) ==========
  function startCouponTimers() {
    document.querySelectorAll('.coupon-timer').forEach(el => {
      let totalSeconds = parseInt(el.dataset.hours) * 3600;
      function update() {
        if (totalSeconds <= 0) { el.textContent = 'Expired'; return; }
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        el.textContent = d > 0 ? `${d}d ${h}h ${m}m ${s}s` : h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
        totalSeconds--;
      }
      update();
      setInterval(update, 1000);
    });
  }

  // ========== Expiring Countdown (date-based) ==========
  function startExpiringCountdowns() {
    document.querySelectorAll('.expiring-countdown').forEach(el => {
      const target = new Date(el.dataset.target).getTime();
      if (isNaN(target)) return;

      const daysEl = el.querySelector('.exp-days');
      const hoursEl = el.querySelector('.exp-hours');
      const minsEl = el.querySelector('.exp-mins');
      const secsEl = el.querySelector('.exp-secs');

      function update() {
        const diff = target - new Date().getTime();
        if (diff <= 0) {
          daysEl.textContent = '00';
          hoursEl.textContent = '00';
          minsEl.textContent = '00';
          secsEl.textContent = '00';
          return;
        }
        daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        hoursEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        minsEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        secsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      }
      update();
      setInterval(update, 1000);
    });
  }

  startCouponTimers();
  startExpiringCountdowns();

  // ========== Hero Stats Counter ==========
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterObserver.disconnect();
        document.querySelectorAll('.ch-stat-num').forEach(el => {
          const target = parseFloat(el.dataset.target);
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const current = (1 - Math.pow(1 - progress, 3)) * target;
            el.textContent = Math.floor(current);
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.coupon-hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // ========== CTA Form ==========
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (!input.value.toLowerCase().endsWith('@gmail.com')) {
        alert('Please enter only Gmail address to get a coupon');
        return;
      }
      const btn = e.target.querySelector('button');
      const original = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Coupon Sent!';
        input.value = '';

        const toast = document.getElementById('toast');
        const msg = document.getElementById('toastMsg');
        msg.textContent = 'Your 20% off coupon is on its way!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

  // ========== Auth Modal ==========
  const authModal = document.getElementById('authModal');
  const authOverlay = document.getElementById('authOverlay');
  const authClose = document.getElementById('authClose');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnMobile = document.getElementById('loginBtnMobile');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  const authSwitches = document.querySelectorAll('.auth-switch');

  function openAuth(form) {
    authModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (form) switchAuth(form);
  }

  function closeAuth() {
    authModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function switchAuth(form) {
    authTabs.forEach(t => t.classList.toggle('active', t.dataset.form === form));
    authForms.forEach(f => f.classList.toggle('active', f.id === form + 'Form'));
  }

  if (loginBtn) loginBtn.addEventListener('click', () => openAuth('login'));
  if (loginBtnMobile) loginBtnMobile.addEventListener('click', () => openAuth('login'));
  authOverlay.addEventListener('click', closeAuth);
  authClose.addEventListener('click', closeAuth);

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuth(tab.dataset.form));
  });

  authSwitches.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuth(link.dataset.form);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuth();
  });

  const loginEmail = document.querySelector('#loginForm input[type="email"]');
  if (loginEmail) {
    loginEmail.addEventListener('blur', function() {
      if (this.value && !this.value.endsWith('@gmail.com')) {
        alert('Only Gmail addresses are allowed.');
        this.value = '';
        this.focus();
      }
    });
  }

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.querySelector('input[name="loginRole"]:checked').value;
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    msg.textContent = 'Welcome back! Redirecting...';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
    setTimeout(() => {
      window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
    }, 1000);
  });

  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const fullNameInput = document.querySelector('#signupForm input[placeholder="Full name"]');
  if (fullNameInput) {
    fullNameInput.addEventListener('input', function() {
      if (/[0-9]/.test(this.value)) {
        alert('Only alphabets are allowed in the name field.');
        this.value = this.value.replace(/[0-9]/g, '');
      }
    });
  }

  const signupEmail = document.querySelector('#signupForm input[type="email"]');
  if (signupEmail) {
    signupEmail.addEventListener('blur', function() {
      if (this.value && !this.value.endsWith('@gmail.com')) {
        alert('Only Gmail addresses are allowed.');
        this.value = '';
        this.focus();
      }
    });
  }

  const signupPasswords = document.querySelectorAll('#signupForm input[type="password"]');
  signupPasswords.forEach(function(pwd) {
    pwd.addEventListener('blur', function() {
      if (this.value) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!strongRegex.test(this.value)) {
          alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&#).');
          this.value = '';
          this.focus();
        }
      }
    });
  });

  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const checkbox = document.querySelector('#signupForm .auth-options input[type="checkbox"]');
    if (checkbox && !checkbox.checked) {
      alert('Read and accept the terms and conditions.');
      return;
    }
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    msg.textContent = 'Account created successfully! Welcome to GiftHaven!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    setTimeout(() => { window.location.href = '404.html'; }, 1500);
  });

  // ========== Cart Button ==========
  const cartBtn = document.getElementById('cartBtn');
  const cartBtnMobile = document.getElementById('cartBtnMobile');
  const cartCounts = document.querySelectorAll('.cart-count');

  function loadCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('giftCart')) || [];
      cartCounts.forEach(el => el.textContent = cart.reduce((s, i) => s + i.quantity, 0));
    } catch (e) { cartCounts.forEach(el => el.textContent = '0'); }
  }
  loadCartCount();

  if (cartBtn) cartBtn.addEventListener('click', () => { window.location.href = 'cart.html'; });
  if (cartBtnMobile) cartBtnMobile.addEventListener('click', () => { window.location.href = 'cart.html'; });

  // ========== Smooth Scroll Nav ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Password Toggle ==========
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const field = toggle.closest('.password-field');
      const input = field.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        toggle.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // ========== Console Greeting ==========
  console.log('%c GiftHaven Coupons ', 'font-size:24px; font-weight:bold; background: linear-gradient(135deg, #6c5ce7, #fd79a8); color:#fff; padding:8px 16px; border-radius:8px;');
  console.log('%c Save big with exclusive deals!', 'font-size:14px; color:#a0a0b8;');

});

