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

  // ========== Navbar ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
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

  // ========== Animated Counters ==========
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterObserver.disconnect();
        document.querySelectorAll('.fhero-number').forEach(el => {
          const target = parseFloat(el.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const current = (1 - Math.pow(1 - progress, 3)) * target;
            el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.featured-hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

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

  // ========== Cart Functionality ==========
  const cartBtn = document.getElementById('cartBtn');
  const cartBtnMobile = document.getElementById('cartBtnMobile');
  const cartCounts = document.querySelectorAll('.cart-count');

  function loadCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('giftCart')) || [];
      cartCounts.forEach(el => el.textContent = cart.reduce((s, i) => s + i.quantity, 0));
    } catch (e) {
      cartCounts.forEach(el => el.textContent = '0');
    }
  }
  loadCartCount();

  if (cartBtn) cartBtn.addEventListener('click', () => { window.location.href = 'cart.html'; });
  if (cartBtnMobile) cartBtnMobile.addEventListener('click', () => { window.location.href = 'cart.html'; });

  document.querySelectorAll('.btn-gift').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name || 'Item';
      const icon = btn.dataset.icon || 'fa-gift';
      const price = parseFloat(btn.dataset.price) || 0;

      let cart = [];
      try { cart = JSON.parse(localStorage.getItem('giftCart')) || []; } catch (e) {}

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, icon, price, quantity: 1 });
      }

      try { localStorage.setItem('giftCart', JSON.stringify(cart)); } catch (e) {}
      loadCartCount();
      cartCounts.forEach(el => {
        el.style.transform = 'scale(1.4)';
        setTimeout(() => el.style.transform = 'scale(1)', 300);
      });

      const toast = document.getElementById('toast');
      const msg = document.getElementById('toastMsg');
      msg.textContent = `${name} added to cart!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    });
  });

  // ========== Newsletter Form ==========
  const newsletterForm = document.getElementById('featuredNewsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (!input.value.endsWith('@gmail.com')) {
        alert('Please enter only Gmail address for the subscription.');
        return;
      }
      const btn = e.target.querySelector('button');
      const original = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        input.value = '';

        const toast = document.getElementById('toast');
        const msg = document.getElementById('toastMsg');
        msg.textContent = 'You\'re subscribed! Check your inbox.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

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

  // ========== Card 3D Tilt Effects ==========
  document.querySelectorAll('.gift-card, .special-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2) / 12}deg) rotateY(${(r.width/2 - e.clientX + r.left) / 12}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
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
  console.log('%c GiftHaven Featured ', 'font-size:24px; font-weight:bold; background: linear-gradient(135deg, #6c5ce7, #fd79a8); color:#fff; padding:8px 16px; border-radius:8px;');
  console.log('%c Discover trending gifts!', 'font-size:14px; color:#a0a0b8;');

});

