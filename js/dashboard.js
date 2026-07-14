const hamburgerBtn = document.getElementById('dashHamburgerBtn');
const sidebar = document.getElementById('dashSidebar');
const overlay = document.getElementById('dashOverlay');
const navLinks = sidebar.querySelectorAll('.dash-nav a');
const dashTopbar = document.getElementById('dashTopbar');

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  const icon = hamburgerBtn.querySelector('i');
  if (sidebar.classList.contains('open')) {
    icon.className = 'fas fa-times';
  } else {
    icon.className = 'fas fa-bars';
  }
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  hamburgerBtn.querySelector('i').className = 'fas fa-bars';
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    link.blur();
    sidebar.style.cssText = 'transition:none!important;transform:translateX(-100%)!important;visibility:hidden!important;pointer-events:none!important;';
    overlay.style.cssText = 'transition:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;';
    hamburgerBtn.querySelector('i').className = 'fas fa-bars';
    if (link.id === 'dashLogout') {
      window.location.href = 'index.html';
    } else {
      window.location.href = link.href;
    }
  });
});

// Filter buttons toggle
document.querySelectorAll('.dash-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.querySelectorAll('.dash-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Keep dashboard content visible without entrance delays
const revealElements = document.querySelectorAll('.dash-section, .dash-topbar, .dash-card, .dash-stat-card, .dash-wishlist-item, .dash-quick-link, .dash-help-card, .dash-security-card, .dash-address-card, .dash-info-card');
revealElements.forEach(el => {
  el.classList.remove('reveal');
  el.classList.add('visible');
  el.style.opacity = '1';
  el.style.transform = 'none';
});

// Ripple effect on quick links and cards
document.querySelectorAll('.dash-quick-link, .dash-help-card').forEach(el => {
  el.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(108,92,231,0.12);border-radius:50%;
      transform:scale(0);animation:ripple 0.6s ease-out;
      pointer-events:none;z-index:0;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Table row stagger animation
document.querySelectorAll('.dash-table tbody tr').forEach((row, i) => {
  row.style.animationDelay = `${i * 0.08}s`;
});

// Notification badge subtle glow
document.querySelectorAll('.badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.boxShadow = '0 0 12px rgba(108,92,231,0.5)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.boxShadow = '';
  });
});
