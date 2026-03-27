/* ==================== NAVIGATION ==================== */

// Mobile hamburger toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Services dropdown on mobile (click to open/close)
const servicesItem = document.querySelector('.nav-item-services');
if (servicesItem && window.innerWidth <= 768) {
  servicesItem.addEventListener('click', (e) => {
    if (e.target.closest('a') && !e.target.classList.contains('service-toggle')) {
      return; // Allow normal link navigation
    }
    servicesItem.classList.toggle('open');
  });
}

// Close dropdowns on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
  }
});

// Active nav link highlighting
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    // Simple matching - handles relative paths
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        href.endsWith(currentPage)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', updateActiveNav);

// Sticky nav backdrop enhancement
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    if (window.scrollY > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

/* ==================== SCROLL REVEAL ==================== */

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach(el => observer.observe(el));

/* ==================== GALLERY LIGHTBOX ==================== */

class Lightbox {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.lightbox = null;
    this.init();
  }

  init() {
    // Create lightbox HTML if not exists
    if (!document.getElementById('lightbox')) {
      const lightboxHTML = `
        <div id="lightbox" class="lightbox">
          <div class="lightbox-content">
            <div class="lightbox-nav lightbox-prev">❮</div>
            <img id="lightbox-img" src="" alt="">
            <div class="lightbox-nav lightbox-next">❯</div>
            <div class="lightbox-close">✕</div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    this.lightbox = document.getElementById('lightbox');
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    closeBtn.addEventListener('click', () => this.close());
    prevBtn.addEventListener('click', () => this.prev());
    nextBtn.addEventListener('click', () => this.next());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Attach click handlers to gallery images
    this.attachGalleryListeners();
  }

  attachGalleryListeners() {
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    this.images = Array.from(galleryImages);

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => {
        this.currentIndex = index;
        this.open(img.src);
      });
    });
  }

  open(src) {
    const img = this.lightbox.querySelector('#lightbox-img');
    img.src = src;
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.open(this.images[this.currentIndex].src);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.open(this.images[this.currentIndex].src);
  }
}

// Initialize lightbox when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
  });
} else {
  new Lightbox();
}

/* ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ==================== FORM HANDLING ==================== */

// Add simple form validation feedback
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!isValid) {
      e.preventDefault();
      alert('Please fill in all required fields.');
    }
  });

  // Remove error styling on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
});

/* ==================== UTILITY: Stagger Animation ==================== */

function staggerElements(selector, delay = 0.1) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.setProperty('animation-delay', `${i * delay}s`);
  });
}

// Apply to hero content on page load
if (document.querySelector('.hero-content')) {
  document.addEventListener('DOMContentLoaded', () => {
    staggerElements('.hero-content > *', 0.1);
  });
}

/* ==================== ACCESSIBILITY & POLISH ==================== */

// Keyboard navigation for dropdowns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-item-services').forEach(item => {
      item.classList.remove('open');
    });
  }
});
