document.addEventListener('DOMContentLoaded', () => {
  
  document.querySelectorAll('.topnav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          
          const offset = 60;
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });


  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    const toggleScrollBtn = () => {
      scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    };
    window.addEventListener('scroll', toggleScrollBtn);

    toggleScrollBtn();
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  const greetingElement = document.getElementById('greeting');
  if (greetingElement) {
    greetingElement.textContent = "Welcome to the internet! - Bo Burnham";
  }


  const contactForm = document.getElementById('contactForm');
  const thankYouMsg = document.getElementById('thankYouMsg');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); 
      
      alert("Thanks for contacting me! I’ll get back to you in five minutes.");
      
      contactForm.style.display = 'none';
      if (thankYouMsg) thankYouMsg.style.display = 'block';
    });
  }

});
