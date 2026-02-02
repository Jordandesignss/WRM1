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

  // Initialize fade-in animations
  document.querySelectorAll('.animate-fade-in').forEach(element => {
    animateOnScroll.observe(element);
  });

  // Initialize scale-up animations
  document.querySelectorAll('.animate-scale-up').forEach(element => {
    animateOnScroll.observe(element);
  });

  // Strategic Focus Slider Functionality
  let currentSlide = 0;
  const totalSlides = 5;
  let cardsPerView = 3;
  
  function updateCardsPerView() {
    if (window.innerWidth <= 480) {
      cardsPerView = 1;
    } else if (window.innerWidth <= 768) {
      cardsPerView = 2;
    } else {
      cardsPerView = 3;
    }
  }
  
  function createDots() {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const maxSlide = Math.ceil(totalSlides / cardsPerView) - 1;
    
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }
  }
  
  function updateSliderPosition() {
    const track = document.getElementById('objectivesTrack');
    if (!track) return;
    
    const cardWidth = 100 / cardsPerView;
    const translateX = -(currentSlide * cardWidth);
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update button states
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const maxSlide = Math.ceil(totalSlides / cardsPerView) - 1;
    
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide >= maxSlide;
  }
  
  window.moveSlider = function(direction) {
    const maxSlide = Math.ceil(totalSlides / cardsPerView) - 1;
    
    if (direction === 1 && currentSlide < maxSlide) {
      currentSlide++;
    } else if (direction === -1 && currentSlide > 0) {
      currentSlide--;
    }
    
    updateSliderPosition();
  }
  
  window.goToSlide = function(slideIndex) {
    const maxSlide = Math.ceil(totalSlides / cardsPerView) - 1;
    currentSlide = Math.min(slideIndex, maxSlide);
    updateSliderPosition();
  }
  
  function initializeSlider() {
    updateCardsPerView();
    createDots();
    updateSliderPosition();
  }
  
  // Initialize slider if elements exist
  if (document.getElementById('objectivesSlider')) {
    initializeSlider();
  }
  
  // Reinitialize on window resize
  window.addEventListener('resize', () => {
    if (document.getElementById('objectivesSlider')) {
      updateCardsPerView();
      currentSlide = 0; // Reset to first slide on resize
      createDots();
      updateSliderPosition();
    }
  });

  // Touch/Swipe functionality for objectives slider on mobile and tablet
  const objectivesSlider = document.querySelector('.objectives-slider');
  if (objectivesSlider) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isDragging = false;

    objectivesSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isDragging = true;
    }, { passive: true });

    objectivesSlider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
    }, { passive: true });

    objectivesSlider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous slide
          window.moveSlider(-1);
        } else {
          // Swipe left - go to next slide
          window.moveSlider(1);
        }
      }
    }, { passive: true });
  }
  
  // Team Members Toggle Functionality
  window.toggleAdditionalTeamMembers = function() {
    const additionalMembers = document.querySelectorAll('.additional-team-member');
    const viewMoreBtn = document.getElementById('teamViewMoreBtn');
    
    if (!additionalMembers.length || !viewMoreBtn) return;
    
    const isVisible = additionalMembers[0].style.display !== 'none';
    
    if (isVisible) {
      // Hide additional members
      additionalMembers.forEach(member => {
        member.style.display = 'none';
      });
      viewMoreBtn.textContent = 'View More Team Members';
    } else {
      // Show additional members with animation
      additionalMembers.forEach((member, index) => {
        member.style.display = 'flex';
        // Trigger animation
        setTimeout(() => {
          member.classList.add('animate-in');
        }, index * 100);
      });
      viewMoreBtn.textContent = 'View Less';
    }
  }
  
  // Member Description Toggle Functionality
  window.toggleDescription = function(memberName) {
    const preview = document.querySelector(`#desc-${memberName} .description-preview`);
    const full = document.querySelector(`#desc-${memberName} .description-full`);
    
    if (!preview || !full) return;
    
    if (preview.style.display !== 'none') {
      // Show full description
      preview.style.display = 'none';
      full.style.display = 'inline';
    } else {
      // Show preview description
      preview.style.display = 'inline';
      full.style.display = 'none';
    }
  }

  // Awards Slider Functionality
  let currentAwardSlide = 0;
  const totalAwards = 11;
  let awardsPerView = 3;
  let awardsAutoPlay;
  
  function updateAwardsPerView() {
    if (window.innerWidth <= 480) {
      awardsPerView = 1;
    } else if (window.innerWidth <= 768) {
      awardsPerView = 1.5;
    } else if (window.innerWidth <= 1024) {
      awardsPerView = 2;
    } else {
      awardsPerView = 3;
    }
  }
  
  function createAwardsDots() {
    const dotsContainer = document.getElementById('awardsDots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    
    for (let i = 0; i < maxSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `award-dot ${i === 0 ? 'active' : ''}`;
      dot.onclick = () => goToAwardSlide(i);
      dot.setAttribute('aria-label', `Go to award slide ${i + 1}`);
      dotsContainer.appendChild(dot);
    }
  }
  
  function updateAwardsPosition() {
    const track = document.getElementById('awardsTrack');
    if (!track) return;
    
    const slideWidth = 320; // slide width (300px) + gap (20px)
    const translateX = -(currentAwardSlide * slideWidth * Math.floor(awardsPerView));
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    const dots = document.querySelectorAll('.award-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentAwardSlide);
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.awards-prev');
    const nextBtn = document.querySelector('.awards-next');
    const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    
    if (prevBtn) prevBtn.disabled = currentAwardSlide === 0;
    if (nextBtn) nextBtn.disabled = currentAwardSlide >= maxSlides - 1;
    
    // Animate visible slides
    const slides = document.querySelectorAll('.award-slide');
    slides.forEach((slide, index) => {
      const startIndex = currentAwardSlide * Math.floor(awardsPerView);
      const endIndex = startIndex + Math.floor(awardsPerView);
      
      if (index >= startIndex && index < endIndex) {
        setTimeout(() => {
          slide.style.animation = 'slideInFromRight 0.6s ease-out forwards';
        }, (index - startIndex) * 150);
      }
    });
  }
  
  window.moveAwardsSlider = function(direction) {
    const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    
    if (direction === 1 && currentAwardSlide < maxSlides - 1) {
      currentAwardSlide++;
    } else if (direction === -1 && currentAwardSlide > 0) {
      currentAwardSlide--;
    }
    
    updateAwardsPosition();
  }
  
  window.goToAwardSlide = function(slideIndex) {
    const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    currentAwardSlide = Math.min(slideIndex, maxSlides - 1);
    updateAwardsPosition();
  }
  
  function initializeAwardsSlider() {
    updateAwardsPerView();
    createAwardsDots();
    updateAwardsPosition();
    
    // Initial animation for visible slides
    const slides = document.querySelectorAll('.award-slide');
    slides.forEach((slide, index) => {
      if (index < Math.floor(awardsPerView)) {
        setTimeout(() => {
          slide.classList.add('animate-in');
        }, index * 200);
      }
    });
  }
  
  // Initialize awards slider if elements exist
  if (document.getElementById('awardsTrack')) {
    setTimeout(initializeAwardsSlider, 200);
    
    // Reinitialize on window resize
    window.addEventListener('resize', () => {
      updateAwardsPerView();
      currentAwardSlide = 0;
      createAwardsDots();
      updateAwardsPosition();
    });

    // Auto-play functionality - DISABLED
    // awardsAutoPlay = setInterval(() => {
    //   const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    //   if (currentAwardSlide < maxSlides - 1) {
    //     window.moveAwardsSlider(1);
    //   } else {
    //     currentAwardSlide = 0;
    //     updateAwardsPosition();
    //   }
    // }, 6000);

    // Pause auto-play on hover - DISABLED
    // const awardsSection = document.querySelector('.awards-section');
    // if (awardsSection) {
    //   awardsSection.addEventListener('mouseenter', () => {
    //     clearInterval(awardsAutoPlay);
    //   });
      
    //   awardsSection.addEventListener('mouseleave', () => {
    //     awardsAutoPlay = setInterval(() => {
    //       const maxSlides = Math.ceil(totalAwards / Math.floor(awardsPerView));
    //       if (currentAwardSlide < maxSlides - 1) {
    //         window.moveAwardsSlider(1);
    //       } else {
    //         currentAwardSlide = 0;
    //         updateAwardsPosition();
    //       }
    //     }, 6000);
    //   });
    // }

    // Touch/Swipe functionality for mobile and tablet
    const awardsSlider = document.querySelector('.awards-slider');
    if (awardsSlider) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isDragging = false;

      awardsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isDragging = true;
      }, { passive: true });

      awardsSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
      }, { passive: true });

      awardsSlider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // Swipe right - go to previous slide
            window.moveAwardsSlider(-1);
          } else {
            // Swipe left - go to next slide
            window.moveAwardsSlider(1);
          }
        }
      }, { passive: true });
    }
  }
});

