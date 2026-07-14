document.addEventListener('DOMContentLoaded', () => {

  // ========== Preloader ==========
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader.classList.add('hidden');
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 3000);

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

  // ========== Cart Count ==========
  const cartCounts = document.querySelectorAll('.cart-count');
  function loadCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('giftCart')) || [];
      cartCounts.forEach(el => el.textContent = cart.reduce((s, i) => s + i.quantity, 0));
    } catch (e) { cartCounts.forEach(el => el.textContent = '0'); }
  }
  loadCartCount();

  // ========== Cart Button ==========
  const cartBtn = document.getElementById('cartBtn');
  const cartBtnMobile = document.getElementById('cartBtnMobile');
  if (cartBtn) cartBtn.addEventListener('click', () => { window.location.href = 'cart.html'; });
  if (cartBtnMobile) cartBtnMobile.addEventListener('click', () => { window.location.href = 'cart.html'; });

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

  // ========== Popular Tabs ==========
  const popularTabs = document.querySelectorAll('.popular-tab');
  const popularGrid = document.getElementById('popularGrid');

  const popularGifts = {
    birthday: [
      { name: 'Birthday Hamper', icon: 'fa-gift', rating: 5, reviews: '5.0', price: 49.99, badge: 'Best Seller', desc: 'Curated birthday surprise box', img: 'assets/BD_hamper.webp' },
      { name: 'Photo Collage Frame', icon: 'fa-camera', rating: 4.5, reviews: '4.5', price: 34.99, badge: '-20%', badgeType: 'sale', desc: 'Custom photo frame with memories', img: 'assets/Photo_frame.webp' },
      { name: 'Bluetooth Speaker', icon: 'fa-music', rating: 5, reviews: '5.0', price: 59.99, badge: '', desc: 'Portable wireless speaker', img: 'assets/Speaker_bluetooth.webp' },
      { name: 'Custom Mug Set', icon: 'fa-mug-hot', rating: 4.5, reviews: '4.5', price: 24.99, badge: 'Trending', badgeType: 'new', desc: 'Personalized ceramic mugs', img: 'assets/Custom_mug.webp' }
    ],
    anniversary: [
      { name: 'Romantic Dinner Set', icon: 'fa-glass-cheers', rating: 5, reviews: '5.0', price: 79.99, badge: 'Romantic', desc: 'Elegant dinnerware for two', img: 'assets/Dinner_set.webp' },
      { name: 'Couple Watch Set', icon: 'fa-clock', rating: 4.5, reviews: '4.5', price: 129.99, badge: '-15%', badgeType: 'sale', desc: 'Matching watches for couples', img: 'assets/Couple_watch.webp' },
      { name: 'Personalized Frame', icon: 'fa-heart', rating: 5, reviews: '5.0', price: 39.99, badge: '', desc: 'Custom engraved photo frame', img: 'assets/Personalized_frame (1).webp' },
      { name: 'Spa Gift Basket', icon: 'fa-spa', rating: 4.5, reviews: '4.5', price: 64.99, badge: 'Popular', desc: 'Luxury spa & relaxation set', img: 'assets/Spa_basket.webp' }
    ],
    festival: [
      { name: 'Festival Hamper', icon: 'fa-gift', rating: 5, reviews: '5.0', price: 89.99, badge: 'Best Seller', desc: 'Premium festival gift box', img: 'assets/Festival_hamper.webp' },
      { name: 'Decorative Lights', icon: 'fa-lightbulb', rating: 4.5, reviews: '4.5', price: 29.99, badge: '-30%', badgeType: 'sale', desc: 'LED string lights for decor', img: 'assets/Decorative_lights.webp' },
      { name: 'Sweet Treats Box', icon: 'fa-cookie', rating: 5, reviews: '5.0', price: 34.99, badge: '', desc: 'Assorted gourmet sweets', img: 'assets/Sweet_box.webp' },
      { name: 'Festive Candle Set', icon: 'fa-fire', rating: 4.5, reviews: '4.5', price: 44.99, badge: 'New', badgeType: 'new', desc: 'Scented festival candles', img: 'assets/Festival_candle.webp' }
    ],
    graduation: [
      { name: 'Graduation Trophy', icon: 'fa-trophy', rating: 5, reviews: '5.0', price: 54.99, badge: 'Best Seller', desc: 'Personalized achievement trophy', img: 'assets/Trophy.webp' },
      { name: 'Leather Notebook', icon: 'fa-book', rating: 4.5, reviews: '4.5', price: 29.99, badge: '', desc: 'Premium embossed journal', img: 'assets/Leather_Notebook.webp' },
      { name: 'Smart Watch', icon: 'fa-clock', rating: 5, reviews: '5.0', price: 199.99, badge: '-25%', badgeType: 'sale', desc: 'Fitness & health tracker', img: 'assets/old.webp' },
      { name: 'Laptop Bag', icon: 'fa-briefcase', rating: 4.5, reviews: '4.5', price: 49.99, badge: 'Trending', badgeType: 'new', desc: 'Stylish laptop backpack', img: 'assets/Laptop_bag.webp' }
    ],
    wedding: [
      { name: 'Wedding Album', icon: 'fa-images', rating: 5, reviews: '5.0', price: 69.99, badge: 'Premium', desc: 'Handcrafted photo album', img: 'assets/Wedding.webp' },
      { name: 'Home Decor Set', icon: 'fa-home', rating: 4.5, reviews: '4.5', price: 99.99, badge: '-20%', badgeType: 'sale', desc: 'Elegant home decoration set', img: 'assets/Home_decor.webp' },
      { name: 'Silver Frame', icon: 'fa-certificate', rating: 5, reviews: '5.0', price: 44.99, badge: '', desc: 'Engraved silver picture frame', img: 'assets/Silver_frame.webp' },
      { name: 'Kitchen Bundle', icon: 'fa-utensils', rating: 4.5, reviews: '4.5', price: 84.99, badge: 'Popular', desc: 'Premium kitchen gadget set', img: 'assets/Kitchen_bundle.webp' }
    ],
    kids: [
      { name: 'Toy Robot', icon: 'fa-robot', rating: 5, reviews: '5.0', price: 39.99, badge: 'Best Seller', desc: 'Interactive robot toy', img: 'assets/Toy_robot (1).webp' },
      { name: 'Art Set', icon: 'fa-paint-brush', rating: 4.5, reviews: '4.5', price: 24.99, badge: '-40%', badgeType: 'sale', desc: 'Complete art & craft kit', img: 'assets/Art_set (1).webp' },
      { name: 'Story Books', icon: 'fa-book-open', rating: 5, reviews: '5.0', price: 19.99, badge: '', desc: 'Set of 5 story books', img: 'assets/Story_books (1).webp' },
      { name: 'Puzzle Game', icon: 'fa-puzzle-piece', rating: 4.5, reviews: '4.5', price: 14.99, badge: 'New', badgeType: 'new', desc: 'Educational puzzle set', img: 'assets/Puzzle_game.webp' }
    ]
  };

  function renderStars(count) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(count)) html += '<i class="fas fa-star"></i>';
      else if (i - count < 1) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return html;
  }

  function renderPopularGifts(category) {
    const items = popularGifts[category] || popularGifts.birthday;
    popularGrid.innerHTML = items.map((item, i) => {
      const badgeHtml = item.badge
        ? `<div class="gift-badge${item.badgeType ? ' gift-badge-' + item.badgeType : ''}">${item.badge}</div>`
        : '';
      const priceHtml = item.price % 1 === 0 ? item.price.toFixed(0) : item.price.toFixed(2);
      return `
        <div class="gift-card reveal" style="--i:${i + 1}">
          ${badgeHtml}
          <div class="gift-img">${item.img ? `<img src="${item.img}" alt="${item.name}">` : `<i class="fas ${item.icon}"></i>`}</div>
          <div class="gift-body">
            <h3>${item.name}</h3>
            <div class="gift-rating">${renderStars(item.rating)} <span>(${item.reviews})</span></div>
            <p>${item.desc}</p>
            <div class="gift-footer">
              <span class="gift-price">₹${priceHtml}</span>
              <button class="btn-gift"><i class="fas fa-shopping-cart"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Re-observe reveals
    popularGrid.querySelectorAll('.reveal').forEach(el => {
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe(el);
    });

    // Add to cart for popular gifts
    popularGrid.querySelectorAll('.btn-gift').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.gift-card');
        const name = card.querySelector('h3').textContent;
        const iconEl = card.querySelector('.gift-img i');
        const icon = iconEl ? iconEl.className.replace('fas ', '') : 'fa-gift';
        const priceText = card.querySelector('.gift-price').textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('giftCart')) || []; } catch (e) {}

        const existing = cart.find(item => item.name === name);
        if (existing) { existing.quantity++; }
        else { cart.push({ name, icon, price, quantity: 1 }); }

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

    // 3D tilt on new gift cards
    popularGrid.querySelectorAll('.gift-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2) / 12}deg) rotateY(${(r.width/2 - e.clientX + r.left) / 12}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  popularTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      popularTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPopularGifts(tab.dataset.cat);
    });
  });

  renderPopularGifts('birthday');

  function activatePopularFromHash() {
    const hash = window.location.hash.replace('#popular-', '');
    if (hash && popularGifts[hash]) {
      const targetTab = document.querySelector(`.popular-tab[data-cat="${hash}"]`);
      if (targetTab) {
        targetTab.click();
        setTimeout(() => {
          document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  activatePopularFromHash();
  window.addEventListener('hashchange', activatePopularFromHash);

  document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const match = link.getAttribute('href').match(/popular-(\w+)/);
      if (match) {
        window.location.hash = 'popular-' + match[1];
        activatePopularFromHash();
      }
    });
  });

  // ========== Deals Table ==========
  const dealsData = {
    birthday: { badge: '-30%', icon: 'fa-birthday-cake', title: 'Birthday Special', desc: 'Use code BDAY30 on all birthday gifts', code: 'BDAY30', cat: 'Birthday' },
    anniversary: { badge: '-25%', icon: 'fa-heart', title: 'Anniversary Love', desc: 'Use code LOVE25 on anniversary collection', code: 'LOVE25', cat: 'Anniversary' },
    festival: { badge: '-40%', icon: 'fa-snowflake', title: 'Festive Bonanza', desc: 'Use code FEST40 on all festival items', code: 'FEST40', cat: 'Festival' },
    graduation: { badge: '-20%', icon: 'fa-graduation-cap', title: 'Grad Celebration', desc: 'Use code GRAD20 on graduation gifts', code: 'GRAD20', cat: 'Graduation' },
    wedding: { badge: '-35%', icon: 'fa-ring', title: 'Wedding Bliss', desc: 'Use code WED35 on wedding collection', code: 'WED35', cat: 'Wedding' },
    kids: { badge: '-50%', icon: 'fa-child', title: 'Kids Fun', desc: 'Use code KIDS50 on toys & games', code: 'KIDS50', cat: 'Kids' }
  };

  const dealsBody = document.getElementById('dealsBody');

  function renderDeals(category) {
    const entries = category === 'all' ? Object.entries(dealsData) : [[category, dealsData[category]]];
    dealsBody.innerHTML = entries.map(([key, deal]) => `
      <tr>
        <td>
          <div class="deal-cat">
            <i class="fas ${deal.icon}"></i>
            <span>${deal.cat}</span>
          </div>
        </td>
        <td class="deal-title-cell">${deal.title}</td>
        <td class="deal-desc-cell hide-mobile">${deal.desc}</td>
        <td><span class="deal-badge-cell">${deal.badge}</span></td>
        <td class="coupon-cell">
          <span class="coupon-code" data-code="${deal.code}">
            <span>${deal.code}</span>
            <i class="fas fa-copy"></i>
          </span>
        </td>
      </tr>
    `).join('');

    dealsBody.querySelectorAll('.coupon-code').forEach(el => {
      el.addEventListener('click', () => {
        const code = el.dataset.code;
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toastMsg');
        (navigator.clipboard || { writeText: (t) => { msg.textContent = `Copy: ${code}`; } }).writeText(code).then(() => {
          el.classList.add('copied');
          el.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => {
            el.classList.remove('copied');
            el.innerHTML = `<span>${code}</span> <i class="fas fa-copy"></i>`;
          }, 2000);
          msg.textContent = `Copied "${code}"!`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }).catch(() => {
          msg.textContent = `Code: ${code}`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        });
      });
    });
  }

  const dealsTabs = document.querySelectorAll('.deals-tab');
  dealsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dealsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDeals(tab.dataset.deal);
    });
  });

  renderDeals('all');

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
        }, 2000);
      }, 1500);
    });
  }

  // ========== Smooth Scroll ==========
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
  console.log('%c GiftHaven Categories ', 'font-size:20px; font-weight:bold; background: linear-gradient(135deg, #6c5ce7, #fd79a8); color:#fff; padding:8px 16px; border-radius:8px;');

});

