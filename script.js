// JavaScript of responsive navigation menu
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
});


// Javascript for video slider navigation
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".video-slide");
const contents= document.querySelectorAll(".content");

var sliderNav = function(manual){
    btns.forEach((btn) => {
        btn.classList.remove("active");
    });
    

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });


    contents.forEach((content) => {
        content.classList.remove("active");
    });

    btns[manual].classList.add("active");
    slides[manual].classList.add("active");
    contents[manual].classList.add("active");
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});


// Close mobile menu when clicking OUTSIDE the white menu box
const navItems = document.querySelector(".navigation-items");

document.addEventListener("click", (e) => {
  if (!navigation.classList.contains("active")) return;

  const clickedInsideMenuBox = navItems.contains(e.target);
  const clickedBurgerBtn = menuBtn.contains(e.target);

  // close only when clicking on the dark overlay / page (outside the white box)
  if (!clickedInsideMenuBox && !clickedBurgerBtn) {
    navigation.classList.remove("active");
    menuBtn.classList.remove("active");
  }
});




/* =========================================================
   Swipe / Scroll to change slides (ADD-ON)
   - Desktop: mouse wheel over .home changes slides
   - Mobile: swipe LEFT/RIGHT changes slides (vertical scroll stays normal)
   ========================================================= */

   const homeSection = document.querySelector(".home");

   let currentIndex = 0; // default active is index 0
   let isThrottled = false;
   
   function goToSlide(index) {
     // wrap around
     if (index < 0) index = slides.length - 1;
     if (index >= slides.length) index = 0;
   
     currentIndex = index;
     sliderNav(currentIndex);
   }
   
   function nextSlide() {
     goToSlide(currentIndex + 1);
   }
   
   function prevSlide() {
     goToSlide(currentIndex - 1);
   }
   
   function throttle(ms = 900) {
     isThrottled = true;
     setTimeout(() => (isThrottled = false), ms);
   }
   
   // keep currentIndex in sync when user clicks dots
   btns.forEach((btn, i) => {
     btn.addEventListener("click", () => {
       currentIndex = i;
     });
   });
   
   /* -------- Desktop: mouse wheel (only when home is mostly in view) -------- */
   homeSection.addEventListener(
     "wheel",
     (e) => {
       if (navigation.classList.contains("active")) return;
       if (isThrottled) return;
   
       const rect = homeSection.getBoundingClientRect();
       const mostlyInView =
         rect.top <= 0 && rect.bottom >= window.innerHeight * 0.6;
       if (!mostlyInView) return;
   
       if (Math.abs(e.deltaY) < 10) return;
   
       e.preventDefault();
       throttle(900);
   
       if (e.deltaY > 0) nextSlide();
       else prevSlide();
     },
     { passive: false }
   );
   
   /* -------- Mobile: swipe LEFT / RIGHT on the home section -------- */
   let touchStartX = 0;
   let touchStartY = 0;
   
   homeSection.addEventListener(
     "touchstart",
     (e) => {
       if (navigation.classList.contains("active")) return;
       const t = e.touches[0];
       touchStartX = t.clientX;
       touchStartY = t.clientY;
     },
     { passive: true }
   );
   
   homeSection.addEventListener(
     "touchend",
     (e) => {
       if (navigation.classList.contains("active")) return;
       if (isThrottled) return;
   
       const t = e.changedTouches[0];
       const dx = touchStartX - t.clientX;
       const dy = touchStartY - t.clientY;
   
       // If it's mostly vertical, ignore (allow normal scroll)
       if (Math.abs(dy) > Math.abs(dx)) return;
   
       const THRESHOLD = 50;
       if (Math.abs(dx) < THRESHOLD) return;
   
       throttle(900);
   
       if (dx > 0) nextSlide(); // swipe left
       else prevSlide();        // swipe right
     },
     { passive: true }
   );


   ////// KOD ZA CAROUSEL GALLERY///
// ===============================
// GALLERY – YOUR LOOK, BUT STABLE
// ===============================
const galleryEl = document.querySelector(".section-gallery .gallerySwiper");
const galleryWrap = document.querySelector(".section-gallery .gallery");

if (galleryEl) {
  const gallerySwiper = new Swiper(galleryEl, {
    effect: "coverflow",
    centeredSlides: true,
    loop: true,

    slidesPerView: "auto",
    spaceBetween: 0,
    speed: 450,
    grabCursor: true,

    simulateTouch: true,
    touchStartPreventDefault: false,
    touchAngle: 35,

    // ✅ same vibe, less extreme far transforms => less lag
    coverflowEffect: {
      rotate: 205,
      stretch: 110,
      depth: 30,
      
      slideShadows: false
    },

    navigation: {
      nextEl: ".section-gallery .swiper-button-next",
      prevEl: ".section-gallery .swiper-button-prev"
    },

    pagination: {
      el: ".section-gallery .g-dots",
      clickable: true
    },

    keyboard: { enabled: true },

    // ✅ image performance (works great for GitHub Pages)
    preloadImages: false,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2
    },
    watchSlidesProgress: true,

    mousewheel: {
      enabled: true,
      forceToAxis: true,
      thresholdDelta: 30,
      sensitivity: 0.8,
      releaseOnEdges: true
    }
  });

  // -----------------------------
  // Mousewheel only inside gallery
  // -----------------------------
  gallerySwiper.mousewheel.disable();
  if (galleryWrap) {
    galleryWrap.addEventListener("mouseenter", () => gallerySwiper.mousewheel.enable());
    galleryWrap.addEventListener("mouseleave", () => gallerySwiper.mousewheel.disable());
  }

  // -----------------------------
  // Mark 2nd neighbors (far stairs)
  // -----------------------------
  const getNext = (el) => el.nextElementSibling || el.parentElement.firstElementChild;
  const getPrev = (el) => el.previousElementSibling || el.parentElement.lastElementChild;

  function markFarSlides() {
    gallerySwiper.slides.forEach((s) => s.classList.remove("g-far-prev", "g-far-next"));

    const active = gallerySwiper.slides[gallerySwiper.activeIndex];
    if (!active) return;

    const prev1 = getPrev(active);
    const prev2 = prev1 ? getPrev(prev1) : null;
    const next1 = getNext(active);
    const next2 = next1 ? getNext(next1) : null;

    if (prev2) prev2.classList.add("g-far-prev");
    if (next2) next2.classList.add("g-far-next");
  }

  markFarSlides();
  gallerySwiper.on("slideChangeTransitionStart", markFarSlides);
  gallerySwiper.on("transitionEnd", markFarSlides);
  gallerySwiper.on("loopFix", markFarSlides);
}
