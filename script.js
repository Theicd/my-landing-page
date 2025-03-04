// Video Modal Functions
function openVideoModal(videoId) {
    console.log('Opening video modal with ID:', videoId);
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('vimeoPlayer');
    
    // הוספת לוג נוסף לבדיקה
    console.log('Setting iframe src to:', `https://player.vimeo.com/video/${videoId}?autoplay=1`);
    
    iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    console.log('Closing video modal');
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('vimeoPlayer');
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Show/Hide Scroll to Top Button
window.onscroll = function() {
  const btn = document.getElementById('scrollToTopBtn');
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.classList.remove('hidden');
  } else {
    btn.classList.add('hidden');
  }
};

// ניקוי כל אירועי ה-onclick בדף והוספת אירועי לחיצה רק לטקסטים המתאימים
function cleanAllOnclickEvents() {
    console.log('Cleaning all onclick events from page');
    
    // הסרת אירועי onclick מכל האלמנטים בדף
    document.querySelectorAll('*[onclick]').forEach(function(element) {
        console.log('Removing onclick from element:', element);
        element.removeAttribute('onclick');
    });
    
    // הסרת אירועי onclick מכל הכרטיסיות
    document.querySelectorAll('.card').forEach(function(card) {
        card.style.cursor = 'default';
        
        // מניעת פתיחת המודל בלחיצה על הכרטיסייה
        card.addEventListener('click', function(e) {
          if (e.target === this) {
            e.stopPropagation();
            return false;
          }
        });
    });
    
    // הוספת אירועי לחיצה רק לטקסטים עם data-video-id
    document.querySelectorAll('[data-video-id]').forEach(function(element) {
        const videoId = element.getAttribute('data-video-id');
        if (videoId) {
            // הוספת אירוע לחיצה חדש
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Opening video from click on element with data-video-id:', videoId);
                openVideoModal(videoId);
            });
            
            // הוספת אירוע מגע למכשירים ניידים
            element.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Opening video from touch on element with data-video-id:', videoId);
                openVideoModal(videoId);
            });
            
            // עיצוב האלמנט כלחיץ
            element.style.cursor = 'pointer';
            element.style.position = 'relative';
            element.style.zIndex = '100';
        }
    });
}

// Initialize event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Close modal when clicking outside
  document.getElementById('videoModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeVideoModal();
    }
  });
  
  // Close button for mobile
  document.querySelector('.close-modal').addEventListener('touchstart', function(e) {
    e.preventDefault();
    closeVideoModal();
  });
  
  // ניקוי כל אירועי ה-onclick בדף
  cleanAllOnclickEvents();
  
  // טיפול במיקום הכותרת "מה נלמד ליצור עם AI?" בהתאם לגודל המסך
  adjustHeadingPosition();
  window.addEventListener('resize', adjustHeadingPosition);
});

// פונקציה לטיפול במיקום הכותרת בהתאם לגודל המסך
function adjustHeadingPosition() {
  const whatWeLearnHeading = document.querySelector('.what-we-learn');
  if (whatWeLearnHeading) {
    if (window.innerWidth <= 768) {
      // טלפון נייד וטאבלט
      whatWeLearnHeading.style.marginTop = '0';
      whatWeLearnHeading.style.marginBottom = '0.5rem';
      
      // התאמת מרווח הסקשן
      const section = whatWeLearnHeading.closest('section');
      if (section) {
        section.style.marginTop = '-20px';
        section.style.paddingTop = '10px';
      }
    } else {
      // מחשב שולחני
      whatWeLearnHeading.style.marginTop = '0';
      whatWeLearnHeading.style.marginBottom = '1rem';
      
      // התאמת מרווח הסקשן
      const section = whatWeLearnHeading.closest('section');
      if (section) {
        section.style.marginTop = '-30px';
        section.style.paddingTop = '10px';
      }
    }
  }
}

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
});

// Initialize Embla Carousel
document.addEventListener("DOMContentLoaded", function() {
  const setupCarousel = (element) => {
    if (!element) return;
    
    const viewport = element.querySelector(".embla__viewport");
    const prevBtn = element.querySelector(".embla__prev");
    const nextBtn = element.querySelector(".embla__next");
    const dotsContainer = element.querySelector(".embla__dots");
    
    if (!viewport) return;
    
    const embla = EmblaCarousel(viewport, { 
      loop: true,
      dragFree: true,
      containScroll: "trimSnaps"
    });
    
    if (prevBtn) prevBtn.addEventListener("click", () => embla.scrollPrev());
    if (nextBtn) nextBtn.addEventListener("click", () => embla.scrollNext());
    
    const slides = embla.slideNodes();
    if (dotsContainer && slides.length > 1) {
      const dots = Array.from(Array(slides.length)).map((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("w-2", "h-2", "rounded-full", "bg-gray-300");
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => embla.scrollTo(index));
        dotsContainer.appendChild(dot);
        return dot;
      });
      
      embla.on("select", () => {
        const selected = embla.selectedScrollSnap();
        dots.forEach((dot, index) => {
          dot.classList.toggle("bg-primary", index === selected);
          dot.classList.toggle("bg-gray-300", index !== selected);
        });
      });
    }
    
    embla.reInit();
  };
  
  document.querySelectorAll(".embla").forEach(setupCarousel);
});

// Facebook video embed mobile compatibility fix
document.addEventListener('DOMContentLoaded', function() {
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // If on mobile, enhance the Facebook video handling
  if (isMobile) {
    const fbIframe = document.querySelector('iframe[src*="facebook.com/plugins/video"]');
    
    if (fbIframe) {
      console.log('Facebook video iframe detected on mobile');
      
      // Ensure mobile fallback link is visible
      const mobileFallback = document.querySelector('.mobile-fallback');
      if (mobileFallback) {
        mobileFallback.style.display = 'block';
      }
      
      // Add proper mobile attributes to iframe
      const fbVideoURL = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbIframe.src)}&autoplay=1&mute=1&playsinline=1&controls=0&loop=1`;
      fbIframe.src = fbVideoURL;
      fbIframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen;');
      
      // Try reloading the iframe after a delay
      setTimeout(function() {
        console.log('Reloading Facebook iframe');
        const originalSrc = fbIframe.src;
        // Add cache buster
        fbIframe.src = originalSrc + '&_=' + new Date().getTime();
      }, 1000);
      
      // Force iframe reload on orientation change
      window.addEventListener('orientationchange', function() {
        console.log('Orientation changed, reloading video');
        setTimeout(function() {
          const originalSrc = fbIframe.src;
          fbIframe.src = '';
          setTimeout(function() {
            fbIframe.src = originalSrc;
          }, 100);
        }, 500);
      });
      
      // Add click event to play video
      fbIframe.addEventListener('click', function() {
        this.contentWindow.postMessage({event: 'command', func: 'playVideo'}, '*');
      });
      
      // Add touch event to play video
      fbIframe.addEventListener('touchstart', function() {
        this.contentWindow.postMessage({event: 'command', func: 'playVideo'}, '*');
      });
    } else {
      console.log('Facebook video iframe not found on mobile');
    }
  }
});

// ניקוי כל אירועי ה-onclick מהכרטיסיות והאלמנטים בתוכן
window.addEventListener('load', function() {
    console.log('Cleaning onclick events from cards after page load');
    
    // הסרת אירועי onclick מכל הכרטיסיות
    document.querySelectorAll('.card').forEach(function(card) {
        if (card.hasAttribute('onclick')) {
            console.log('Removing onclick from card after page load');
            card.removeAttribute('onclick');
        }
        card.style.cursor = 'default';
        
        // מניעת פתיחת המודל בלחיצה על הכרטיסייה
        card.addEventListener('click', function(e) {
          if (e.target === this) {
            e.stopPropagation();
            return false;
          }
        });
    });
    
    // הפעלת הניקוי גם לאחר טעינת העמוד
    console.log('Running cleanup after full page load');
    setTimeout(function() {
        console.log('Running delayed cleanup');
        // הסרת אירועי onclick מכל האלמנטים בדף
        document.querySelectorAll('*[onclick]').forEach(function(element) {
            // אם זה לא אחד מהטקסטים עם data-video-id
            if (!element.hasAttribute('data-video-id')) {
                console.log('Removing onclick from element in delayed cleanup');
                element.removeAttribute('onclick');
            }
        });
    }, 1000);
    
    // הפעלת המודל רק בלחיצה על הטקסט "לדוגמא לחצו כאן"
    document.querySelectorAll('[data-video-id]').forEach(function(element) {
        const videoId = element.getAttribute('data-video-id');
        if (videoId) {
            // הסרת אירוע onclick אם קיים
            element.removeAttribute('onclick');
            
            // הוספת אירוע לחיצה חדש
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                openVideoModal(videoId);
            });
            
            // הוספת אירוע מגע למכשירים ניידים
            element.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                e.preventDefault();
                openVideoModal(videoId);
            });
            
            // עיצוב האלמנט כלחיץ
            element.style.cursor = 'pointer';
        }
    });
});
