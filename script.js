document.addEventListener('DOMContentLoaded', function() {
    // Hero Section animation
   const hero = document.querySelector('.hero');
         hero.classList.add('loaded');

   // Intro section animation on scroll
    function handleIntersection(entries, observer){
             entries.forEach(entry => {
                if(entry.isIntersecting){
                   entry.target.classList.add('fade-in');
                   observer.unobserve(entry.target);
                }
             });
           }
            const observer = new IntersectionObserver(handleIntersection, {
                 threshold: 0.2
               });
           const introDivs = document.querySelectorAll('.intro-grid div');
           introDivs.forEach(div=> {
             observer.observe(div)
           })


   // Category Section animation on scroll
   function handleIntersectionCategories(entries, observer){
     entries.forEach(entry => {
        if(entry.isIntersecting){
           entry.target.classList.add('fade-in');
           observer.unobserve(entry.target);
        }
     });
   }
   const observerCategories = new IntersectionObserver(handleIntersectionCategories, {
     threshold: 0.2
   });
   const categoryLinks = document.querySelectorAll('.categories-grid a');
   categoryLinks.forEach((link, index)=> {
     link.style.transitionDelay = `${index * 0.1}s`;
     observerCategories.observe(link)
   })


    // Testimonials slider
   const slider = document.querySelector('.testimonial-slider');
   const slides = document.querySelectorAll('.testimonial-slide');
   const prevBtn = document.querySelector('.prev-btn');
   const nextBtn = document.querySelector('.next-btn');
   let currentIndex = 0;


  function updateSlider() {
         slides.forEach((slide, index)=>{
          slide.classList.remove('active')
            });
         slides[currentIndex].classList.add('active');
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

   let autoSlideInterval;

  function startAutoSlide(){
      autoSlideInterval = setInterval(()=>{
         currentIndex = (currentIndex + 1) % slides.length;
             updateSlider();
      }, 5000)
  }
   function stopAutoSlide(){
       clearInterval(autoSlideInterval)
  }

   prevBtn.addEventListener('click', () => {
        stopAutoSlide();
       currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
        startAutoSlide();
   });

   nextBtn.addEventListener('click', () => {
        stopAutoSlide();
       currentIndex = (currentIndex + 1) % slides.length;
       updateSlider();
        startAutoSlide();
   });
  startAutoSlide();

   // Latest resource animation on scroll
     function handleIntersectionLatest(entries, observer){
       entries.forEach(entry => {
          if(entry.isIntersecting){
             entry.target.classList.add('fade-in');
             observer.unobserve(entry.target);
          }
       });
     }
     const observerLatest = new IntersectionObserver(handleIntersectionLatest, {
       threshold: 0.2
     });
     const latestCards = document.querySelectorAll('.latest-card');
     latestCards.forEach(card=> {
       observerLatest.observe(card)
     })

});