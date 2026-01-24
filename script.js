document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle Functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navRight = document.querySelector('.nav-right');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isActive = mobileMenuBtn.classList.contains('active');
    
    if (isActive) {
      // Close menu
      mobileMenuBtn.classList.remove('active');
      navRight.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    } else {
      // Open menu
      mobileMenuBtn.classList.add('active');
      navRight.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  // Toggle menu when hamburger button is clicked
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when overlay is clicked
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuBtn.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Close menu when window is resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuBtn.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Lazy load hero video when in view and respect user preferences
  const heroVideo = document.querySelector('.hero-video');
  const heroSection = document.querySelector('#hero');
  
  if (heroVideo && heroSection) {
    // Check for data saver mode or reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dataSaverEnabled = (navigator.connection && navigator.connection.saveData) || false;
    const isMobile = window.innerWidth <= 768;
    
    // Only load video if conditions are favorable
    if (!prefersReducedMotion && !dataSaverEnabled && !isMobile) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Load video sources when hero section is in view
            const mp4Src = heroVideo.getAttribute('data-src-mp4');
            const webmSrc = heroVideo.getAttribute('data-src-webm');
            
            if (mp4Src || webmSrc) {
              if (mp4Src) {
                const source1 = document.createElement('source');
                source1.src = mp4Src;
                source1.type = 'video/mp4';
                heroVideo.appendChild(source1);
              }
              if (webmSrc) {
                const source2 = document.createElement('source');
                source2.src = webmSrc;
                source2.type = 'video/webm';
                heroVideo.appendChild(source2);
              }
              
              heroVideo.load();
              const playPromise = heroVideo.play();
              if (playPromise !== undefined) {
                playPromise.catch(err => {
                  console.log('Video autoplay prevented:', err);
                });
              }
              
              // Remove data attributes after loading
              heroVideo.removeAttribute('data-src-mp4');
              heroVideo.removeAttribute('data-src-webm');
            }
            
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(heroSection);
    } else {
      // Don't load video, just show poster
      heroVideo.style.display = 'none';
    }
  }
  
  // Flip when More is clicked, unflip when Back is clicked
  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.flip-container');
      if (container) container.classList.add('flipped');
    });
  });

  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.flip-container');
      if (container) container.classList.remove('flipped');
    });
  });

  // Allow tapping/clicking the whole card to toggle flip
  document.querySelectorAll('.flip-container').forEach(container => {
    container.addEventListener('click', () => {
      container.classList.toggle('flipped');
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // If clicking home/top, scroll to very top of page
      if (targetId === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Handle donation amount selection
  document.querySelectorAll('.donation-amount').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.donation-amount').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // Hide/show navbar on scroll
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.classList.add('hide');
    } else {
      // Scrolling up
      navbar.classList.remove('hide');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Scroll animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Optionally unobserve after animation triggers
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animateOnScroll.observe(element);
  });
});

