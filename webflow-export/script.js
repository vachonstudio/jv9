// Vachon UX Studio - Interactive JavaScript
// This file contains all the functionality for the static website

// Sample gradient data
const gradients = [
  {
    id: 1,
    name: "Ocean Breeze",
    css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    tailwind: "bg-gradient-to-br from-blue-500 to-purple-600",
    category: "cool",
    colors: ["#667eea", "#764ba2"]
  },
  {
    id: 2,
    name: "Sunset Glow",
    css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    tailwind: "bg-gradient-to-br from-pink-400 to-red-500",
    category: "warm",
    colors: ["#f093fb", "#f5576c"]
  },
  {
    id: 3,
    name: "Forest Mist",
    css: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    tailwind: "bg-gradient-to-br from-blue-500 to-cyan-400",
    category: "cool",
    colors: ["#4facfe", "#00f2fe"]
  },
  {
    id: 4,
    name: "Golden Hour",
    css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    tailwind: "bg-gradient-to-br from-yellow-200 to-orange-300",
    category: "warm",
    colors: ["#ffecd2", "#fcb69f"]
  },
  {
    id: 5,
    name: "Midnight Sky",
    css: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
    tailwind: "bg-gradient-to-br from-slate-700 to-black",
    category: "dark",
    colors: ["#2c3e50", "#000000"]
  },
  {
    id: 6,
    name: "Cotton Candy",
    css: "linear-gradient(135deg, #ffeef8 0%, #f8e8ff 100%)",
    tailwind: "bg-gradient-to-br from-pink-50 to-purple-50",
    category: "light",
    colors: ["#ffeef8", "#f8e8ff"]
  },
  {
    id: 7,
    name: "Electric Dreams",
    css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    tailwind: "bg-gradient-to-br from-teal-200 to-pink-200",
    category: "light",
    colors: ["#a8edea", "#fed6e3"]
  },
  {
    id: 8,
    name: "Deep Space",
    css: "linear-gradient(135deg, #200122 0%, #6f0000 100%)",
    tailwind: "bg-gradient-to-br from-purple-900 to-red-900",
    category: "dark",
    colors: ["#200122", "#6f0000"]
  }
];

// State management
let currentFilter = 'all';
let favorites = JSON.parse(localStorage.getItem('vachon_favorites') || '[]');
let isDarkMode = localStorage.getItem('vachon_theme') === 'dark';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeNavigation();
  initializeGradientGallery();
  initializeContactForm();
  initializeLightbox();
  initializeScrollAnimations();
});

// Theme management
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (isDarkMode) {
    document.body.classList.add('dark');
  }
  
  themeToggle.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    localStorage.setItem('vachon_theme', isDarkMode ? 'dark' : 'light');
  });
}

// Navigation scroll effect
function initializeNavigation() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.style.background = isDarkMode 
        ? 'rgba(10, 10, 10, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)';
    } else {
      header.style.background = isDarkMode 
        ? 'rgba(10, 10, 10, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)';
    }
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Gradient gallery functionality
function initializeGradientGallery() {
  const gradientGrid = document.getElementById('gradientGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Render gradients
  renderGradients();
  
  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active filter
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      currentFilter = this.dataset.filter;
      renderGradients();
    });
  });
}

function renderGradients() {
  const gradientGrid = document.getElementById('gradientGrid');
  
  // Filter gradients based on current filter
  const filteredGradients = currentFilter === 'all' 
    ? gradients 
    : gradients.filter(gradient => gradient.category === currentFilter);
  
  // Clear grid
  gradientGrid.innerHTML = '';
  
  // Render filtered gradients
  filteredGradients.forEach(gradient => {
    const gradientCard = document.createElement('div');
    gradientCard.className = 'gradient-card';
    gradientCard.style.background = gradient.css;
    gradientCard.title = gradient.name;
    
    // Add click handler for lightbox
    gradientCard.addEventListener('click', () => openLightbox(gradient));
    
    gradientGrid.appendChild(gradientCard);
  });
}

// Lightbox functionality
function initializeLightbox() {
  const lightbox = document.getElementById('gradientLightbox');
  const closeBtn = document.getElementById('lightboxClose');
  
  closeBtn.addEventListener('click', closeLightbox);
  
  // Close on outside click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openLightbox(gradient) {
  const lightbox = document.getElementById('gradientLightbox');
  const lightboxGradient = document.getElementById('lightboxGradient');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const gradientCode = document.getElementById('gradientCode');
  const copyCSS = document.getElementById('copyCSS');
  const copyTailwind = document.getElementById('copyTailwind');
  const favoriteBtn = document.getElementById('favoriteBtn');
  
  // Set content
  lightboxGradient.style.background = gradient.css;
  lightboxTitle.textContent = gradient.name;
  gradientCode.textContent = `/* CSS */\nbackground: ${gradient.css};\n\n/* Tailwind */\nclass="${gradient.tailwind}"`;
  
  // Update favorite button
  const isFavorite = favorites.includes(gradient.id);
  favoriteBtn.textContent = isFavorite ? '💙 Favorited' : '🤍 Favorite';
  favoriteBtn.className = isFavorite ? 'btn-favorite favorited' : 'btn-favorite';
  
  // Set up button handlers
  copyCSS.onclick = () => copyToClipboard(gradient.css, 'CSS copied!');
  copyTailwind.onclick = () => copyToClipboard(gradient.tailwind, 'Tailwind class copied!');
  favoriteBtn.onclick = () => toggleFavorite(gradient.id);
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('gradientLightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(message);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification(message);
  });
}

function toggleFavorite(gradientId) {
  const index = favorites.indexOf(gradientId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(gradientId);
  }
  
  localStorage.setItem('vachon_favorites', JSON.stringify(favorites));
  
  // Update favorite button
  const favoriteBtn = document.getElementById('favoriteBtn');
  const isFavorite = favorites.includes(gradientId);
  favoriteBtn.textContent = isFavorite ? '💙 Favorited' : '🤍 Favorite';
  favoriteBtn.className = isFavorite ? 'btn-favorite favorited' : 'btn-favorite';
  
  showNotification(isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }
    
    // Simulate form submission
    submitContactForm(data);
  });
}

function submitContactForm(data) {
  // Show loading state
  const submitBtn = document.querySelector('#contactForm button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
  }, 2000);
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.project-card, .blog-card, .gradient-card').forEach(el => {
    observer.observe(el);
  });
}

// Utility functions
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    zIndex: '9999',
    animation: 'slideInRight 0.3s ease',
    fontSize: '14px',
    fontWeight: '500'
  });
  
  // Add animation keyframes if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Portfolio card interactions
document.addEventListener('click', function(e) {
  if (e.target.closest('.project-card')) {
    const card = e.target.closest('.project-card');
    
    if (card.classList.contains('protected')) {
      showNotification('This content requires premium access. Sign up to unlock!');
    } else {
      showNotification('Project details would open here. This is a demo.');
    }
  }
});

// Blog card interactions
document.addEventListener('click', function(e) {
  if (e.target.closest('.blog-card') || e.target.closest('.read-more')) {
    e.preventDefault();
    showNotification('Blog post would open here. This is a demo.');
  }
});

// Signup button interaction
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('signup-btn')) {
    showNotification('Signup form would open here. This is a demo.');
  }
});

// Hero button interactions
document.addEventListener('click', function(e) {
  if (e.target.textContent === 'View Portfolio') {
    document.getElementById('portfolio').scrollIntoView({
      behavior: 'smooth'
    });
  }
  
  if (e.target.textContent === 'Get In Touch') {
    document.getElementById('contact').scrollIntoView({
      behavior: 'smooth'
    });
  }
});

// Add some dynamic effects
function addDynamicEffects() {
  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const heroGradient = document.querySelector('.hero-gradient');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (heroGradient) {
      heroGradient.style.transform = `translateY(${rate}px)`;
    }
  });
  
  // Mouse move effect for project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

// Initialize dynamic effects after a delay
setTimeout(addDynamicEffects, 1000);

// Export for global access (if needed)
window.VachonStudio = {
  gradients,
  showNotification,
  toggleFavorite,
  openLightbox,
  closeLightbox
};