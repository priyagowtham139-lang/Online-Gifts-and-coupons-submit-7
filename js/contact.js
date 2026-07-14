document.addEventListener('DOMContentLoaded', () => {

  // ========== Preloader ==========
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => preloader.classList.add('hidden'));
  setTimeout(() => preloader.classList.add('hidden'), 3000);

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
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ========== FAQ Accordion ==========
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ========== Name Field - Alphabets Only ==========
  const formNameInput = document.getElementById('formName');
  if (formNameInput) {
    formNameInput.addEventListener('input', () => {
      const value = formNameInput.value;
      if (/\d/.test(value)) {
        alert('Only alphabets are allowed');
        formNameInput.value = value.replace(/[0-9]/g, '');
      }
    });
  }

  // ========== Email Field - Gmail Only ==========
  const formEmailInput = document.getElementById('formEmail');
  if (formEmailInput) {
    formEmailInput.addEventListener('blur', () => {
      const value = formEmailInput.value.trim();
      if (value && !value.toLowerCase().endsWith('@gmail.com')) {
        alert('Only Gmail addresses are allowed');
        formEmailInput.value = '';
        formEmailInput.focus();
      }
    });
  }

  // ========== Custom Dropdown ==========
  const subjectDropdown = document.getElementById('subjectDropdown');
  const subjectSelected = document.getElementById('subjectSelected');
  const subjectOptions = document.getElementById('subjectOptions');
  const formSubjectInput = document.getElementById('formSubject');

  if (subjectDropdown) {
    subjectSelected.addEventListener('click', (e) => {
      e.stopPropagation();
      subjectDropdown.classList.toggle('open');
    });

    subjectOptions.querySelectorAll('.custom-dropdown-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        subjectOptions.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        subjectSelected.textContent = option.textContent;
        subjectSelected.classList.add('active');
        formSubjectInput.value = option.dataset.value;
        subjectDropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      subjectDropdown.classList.remove('open');
    });
  }

  // ========== Contact Form Submission ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      const toast = document.getElementById('toast');
      const msg = document.getElementById('toastMsg');
      const btn = contactForm.querySelector('.form-submit');
      const original = btn.innerHTML;

      // Validation
      if (!name || !email || !subject || !message) {
        msg.textContent = 'Please fill in all fields.';
        toast.querySelector('i').className = 'fas fa-exclamation-circle';
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toast.querySelector('i').className = 'fas fa-check-circle'; }, 3000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        toast.querySelector('i').className = 'fas fa-exclamation-circle';
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toast.querySelector('i').className = 'fas fa-check-circle'; }, 3000);
        return;
      }

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        contactForm.reset();

        msg.textContent = `Thanks ${name}! We'll get back to you soon.`;
        toast.querySelector('i').className = 'fas fa-check-circle';
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

});

