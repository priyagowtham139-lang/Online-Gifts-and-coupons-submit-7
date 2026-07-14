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

  if (loginBtn) {
    loginBtn.addEventListener('click', () => openAuth('login'));
  }
  if (loginBtnMobile) {
    loginBtnMobile.addEventListener('click', () => openAuth('login'));
  }
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

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
      const loginEmail = loginForm.querySelector('input[type="email"]');
      if (loginEmail) {
        loginEmail.addEventListener('blur', function() {
          if (this.value && !this.value.endsWith('@gmail.com')) {
            alert('Only Gmail addresses are allowed.');
            this.value = '';
            this.focus();
          }
        });
      }

      loginForm.addEventListener('submit', (e) => {
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
    }

    if (signupForm) {
      const fullNameInput = signupForm.querySelector('input[placeholder="Full name"]');
      if (fullNameInput) {
        fullNameInput.addEventListener('input', function() {
          if (/[0-9]/.test(this.value)) {
            alert('Only alphabets are allowed in the name field.');
            this.value = this.value.replace(/[0-9]/g, '');
          }
        });
      }

      const signupEmail = signupForm.querySelector('input[type="email"]');
      if (signupEmail) {
        signupEmail.addEventListener('blur', function() {
          if (this.value && !this.value.endsWith('@gmail.com')) {
            alert('Only Gmail addresses are allowed.');
            this.value = '';
            this.focus();
          }
        });
      }

      const signupPasswords = signupForm.querySelectorAll('input[type="password"]');
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

      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const checkbox = signupForm.querySelector('.auth-options input[type="checkbox"]');
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
    }

  // ========== Reviews Filter ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      reviewCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const rating = card.dataset.rating;
          const category = card.dataset.category;
          if (filter === rating || filter === category) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });

  // ========== Review Likes ==========
  document.querySelectorAll('.review-likes').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('liked');
      const countSpan = el.cloneNode(true);
      const current = parseInt(el.textContent.trim()) || 0;
      if (el.classList.contains('liked')) {
        el.innerHTML = el.innerHTML.replace(/\d+/, current + 1);
      } else {
        el.innerHTML = el.innerHTML.replace(/\d+/, Math.max(0, current - 1));
      }
    });
  });

  // ========== Star Rating Input ==========
  const starContainer = document.getElementById('starRatingInput');
  if (starContainer) {
    const stars = starContainer.querySelectorAll('i');
    const label = document.getElementById('ratingLabel');
    let selected = 0;

    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    function updateStars(value) {
      stars.forEach((star, i) => {
        star.className = i < value ? 'fas fa-star active' : 'far fa-star';
      });
    }

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const value = parseInt(star.dataset.value);
        stars.forEach((s, i) => {
          s.className = i < value ? 'fas fa-star hover' : 'far fa-star';
        });
        label.textContent = labels[value];
      });

      star.addEventListener('mouseleave', () => {
        updateStars(selected);
        label.textContent = selected ? labels[selected] : 'Select rating';
      });

      star.addEventListener('click', () => {
        selected = parseInt(star.dataset.value);
        updateStars(selected);
        label.textContent = labels[selected];
      });
    });
  }

  // ========== Name Field - Alphabets Only ==========
  const reviewNameInput = document.getElementById('reviewName');
  if (reviewNameInput) {
    reviewNameInput.addEventListener('input', () => {
      const value = reviewNameInput.value;
      if (/\d/.test(value)) {
        alert('Only alphabets are allowed');
        reviewNameInput.value = value.replace(/[0-9]/g, '');
      }
    });
  }

  // ========== Email Field - Gmail Only ==========
  const reviewEmailInput = document.getElementById('reviewEmail');
  if (reviewEmailInput) {
    reviewEmailInput.addEventListener('blur', () => {
      const value = reviewEmailInput.value.trim();
      if (value && !value.toLowerCase().endsWith('@gmail.com')) {
        alert('Only Gmail addresses are allowed');
        reviewEmailInput.value = '';
        reviewEmailInput.focus();
      }
    });
  }

  // ========== Review Form Submission ==========
  const reviewForm = document.getElementById('reviewForm');
  const reviewConfirm = document.getElementById('reviewConfirm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (reviewConfirm && !reviewConfirm.checked) {
        alert('Please accept the confirmation by checking the checkbox');
        reviewConfirm.focus();
        return;
      }

      const btn = reviewForm.querySelector('.review-submit');
      const original = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Review Submitted!';

        const toast = document.getElementById('toast');
        const msg = document.getElementById('toastMsg');
        msg.textContent = 'Thank you! Your review has been submitted successfully.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          reviewForm.reset();
          if (starContainer) {
            const stars = starContainer.querySelectorAll('i');
            stars.forEach(s => s.className = 'far fa-star');
            document.getElementById('ratingLabel').textContent = 'Select rating';
          }
        }, 2000);
      }, 1500);
    });
  }

  // ========== Rating Bars Animation ==========
  const ratingSection = document.querySelector('.rating-breakdown');
  if (ratingSection) {
    const barFills = ratingSection.querySelectorAll('.bar-fill');
    barFills.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
    });

    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          barFills.forEach(bar => {
            const targetWidth = bar.dataset.width || bar.getAttribute('style').match(/width:\s*([^;]+)/);
            if (targetWidth) {
              setTimeout(() => {
                bar.style.width = targetWidth[1] || targetWidth;
              }, 200);
            }
          });
        }
      });
    }, { threshold: 0.3 }).observe(ratingSection);
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

  const statSection = document.querySelector('.testi-stats-section');
  if (statSection) counterObserver.observe(statSection);

  // ========== Cart Count ==========
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
  console.log('%c Testimonials Page', 'font-size:14px; color:#a0a0b8;');
});

