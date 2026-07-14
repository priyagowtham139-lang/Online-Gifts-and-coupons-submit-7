document.addEventListener('DOMContentLoaded', () => {

  // ========== Preloader ==========
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader.classList.add('hidden');

  window.addEventListener('load', () => {
    hidePreloader();
    initCountdown();
    startCouponTimers();
  });
  setTimeout(hidePreloader, 3000);

  // ========== Scroll Progress ==========
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

  // ========== Active Nav Link ==========
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' }).observe(sections[0]);
  if (sections.length > 1)
    for (let i = 1; i < sections.length; i++) {
      const s = sections[i];
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
          }
        });
      }, { rootMargin: '-50% 0px -50% 0px' }).observe(s);
    }

  // ========== Scroll Reveal ==========
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target._revealed = true;
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe(document.querySelectorAll('.reveal')[0]);
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe(el);
  });

  // ========== Hero Countdown ==========
  function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59);

    function update() {
      const diff = endDate - new Date();
      if (diff <= 0) return;
      daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
      hoursEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      minutesEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      secondsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  // ========== Coupon Timers ==========
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

  // ========== Testimonials Slider ==========
  let currentSlide = 0;
  const testiTrack = document.getElementById('testimonialTrack');
  if (testiTrack) {
    const testiCards = testiTrack.querySelectorAll('.testimonial-card');
    const testiDots = document.getElementById('sliderDots');

    testiCards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      testiDots.appendChild(dot);
    });

    function goToSlide(n) {
      currentSlide = n;
      testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      testiDots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }
    window.moveTestimonial = (dir) => {
      currentSlide = (currentSlide + dir + testiCards.length) % testiCards.length;
      goToSlide(currentSlide);
    };

    let autoSlide = setInterval(() => window.moveTestimonial(1), 5000);
    testiTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
    testiTrack.addEventListener('mouseleave', () => { autoSlide = setInterval(() => window.moveTestimonial(1), 5000); });
  }

  // ========== Animated Counters ==========
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterObserver.disconnect();
        document.querySelectorAll('.stat-number, .stat-number-lg').forEach(el => {
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

  const statSection = document.querySelector('.stats-section');
  if (statSection) counterObserver.observe(statSection);

  // ========== Newsletter Form ==========
  const newsletterForm = document.getElementById('newsletterForm');
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
          triggerConfetti();
        }, 2000);
      }, 1500);
    });
  }

  // ========== Confetti Effect ==========
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiActive = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 8 + 4;
      this.color = ['#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894', '#0984e3', '#e17055'][Math.floor(Math.random() * 6)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 10;
      this.velX = (Math.random() - 0.5) * 4;
      this.velY = Math.random() * 4 + 2;
      this.gravity = 0.05;
    }
    update() {
      this.velY += this.gravity;
      this.x += this.velX;
      this.y += this.velY;
      this.rotation += this.rotSpeed;
      return this.y < canvas.height + 20;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      ctx.restore();
    }
  }

  function triggerConfetti() {
    confettiActive = true;
    for (let i = 0; i < 100; i++) {
      const p = new ConfettiPiece();
      p.y = Math.random() * canvas.height * -1;
      p.x = Math.random() * canvas.width;
      confettiPieces.push(p);
    }
    if (!confettiActive) animateConfetti();
  }

  function animateConfetti() {
    if (!confettiActive && confettiPieces.length === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces = confettiPieces.filter(p => p.update());
    confettiPieces.forEach(p => p.draw());
    if (confettiPieces.length > 0 || confettiActive) requestAnimationFrame(animateConfetti);
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

  // ========== Hero Slideshow ==========
  const slides = document.querySelectorAll('.hero-slide');
  const headings = document.querySelectorAll('.hero-heading');
  const slideDots = document.getElementById('slideDots');
  let currentHeroSlide = 0;
  let heroAutoSlide;

  if (slides.length > 0 && slideDots) {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => goToHeroSlide(i));
      slideDots.appendChild(dot);
    });

    function goToHeroSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
      headings.forEach(h => h.classList.remove('active'));
      headings[index].classList.add('active');
      slideDots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
      currentHeroSlide = index;
    }

    function moveHeroSlide(dir) {
      goToHeroSlide((currentHeroSlide + dir + slides.length) % slides.length);
    }

    function resetHeroAuto() {
      clearInterval(heroAutoSlide);
      heroAutoSlide = setInterval(() => moveHeroSlide(1), 4000);
    }

    document.getElementById('slidePrev').addEventListener('click', () => { moveHeroSlide(-1); resetHeroAuto(); });
    document.getElementById('slideNext').addEventListener('click', () => { moveHeroSlide(1); resetHeroAuto(); });

    resetHeroAuto();
  }

  // ========== Mouse Gradient Effect ==========
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      heroSection.style.setProperty('--mouse-x', (e.clientX / window.innerWidth * 100) + '%');
      heroSection.style.setProperty('--mouse-y', (e.clientY / window.innerHeight * 100) + '%');
    });
  }

  // ========== Card 3D Tilt Effects ==========
  document.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2) / 12}deg) rotateY(${(r.width/2 - e.clientX + r.left) / 12}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2) / 15}deg) rotateY(${(r.width/2 - e.clientX + r.left) / 15}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.coupon-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2) / 20}deg) rotateY(${(r.width/2 - e.clientX + r.left) / 20}deg) translateX(8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

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

  // Add to cart from gift cards
  document.querySelectorAll('.btn-gift').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.gift-card');
      const name = card ? card.querySelector('h3').textContent : 'Item';
      const iconEl = card ? card.querySelector('.gift-img i') : null;
      const icon = iconEl ? iconEl.className.replace('fas ', '') : 'fa-gift';
      const priceText = card ? card.querySelector('.gift-price').textContent.trim() : '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

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
  console.log('%c GiftHaven ', 'font-size:24px; font-weight:bold; background: linear-gradient(135deg, #6c5ce7, #fd79a8); color:#fff; padding:8px 16px; border-radius:8px;');
  console.log('%c Built with HTML, CSS & JavaScript', 'font-size:14px; color:#a0a0b8;');

});
