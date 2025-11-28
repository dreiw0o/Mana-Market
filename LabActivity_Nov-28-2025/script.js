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


      
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (!bgMusic || !musicToggleBtn) return;

  bgMusic.volume = 0.3;

  let isMuted = false;
  const savedMutedState = localStorage.getItem('musicMuted');
  if (savedMutedState !== null) isMuted = JSON.parse(savedMutedState);

  const savedTime = parseFloat(localStorage.getItem('bgMusicTime') || '0') || 0;
  const savedPlaying = (localStorage.getItem('bgMusicPlaying') !== null)
    ? JSON.parse(localStorage.getItem('bgMusicPlaying'))
    : true; // default to playing

  bgMusic.muted = isMuted;

  const restoreTime = () => {
    try {
      if (!isNaN(savedTime) && savedTime > 0 && savedTime < bgMusic.duration) {
        bgMusic.currentTime = savedTime;
      }
    } catch (e) {
    }
  };

  if (bgMusic.readyState >= 1) restoreTime();
  else bgMusic.addEventListener('loadedmetadata', restoreTime);

  const tryPlay = () => {
    if (savedPlaying && !bgMusic.muted) {
      bgMusic.play().catch(() => {
        console.log('Autoplay blocked; waiting for user interaction to start audio');
      });
    } else if (savedPlaying && bgMusic.muted) {
      bgMusic.play().catch(() => {});
    }
  };

  tryPlay();


  const startOnInteraction = () => {
    try {
      bgMusic.play().catch(() => {});
    } finally {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    }
  };

  document.addEventListener('click', startOnInteraction);
  document.addEventListener('keydown', startOnInteraction);
  document.addEventListener('touchstart', startOnInteraction);

  const updateBtn = () => {
    if (bgMusic.muted) {
      musicToggleBtn.textContent = '🔇';
      musicToggleBtn.classList.add('muted');
    } else {
      musicToggleBtn.textContent = '🔊';
      musicToggleBtn.classList.remove('muted');
    }
  };
  updateBtn();

  musicToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    localStorage.setItem('musicMuted', JSON.stringify(isMuted));
    if (!bgMusic.paused) localStorage.setItem('bgMusicPlaying', JSON.stringify(true));
    updateBtn();
  });

  let saveInterval = setInterval(() => {
    try {
      localStorage.setItem('bgMusicTime', String(bgMusic.currentTime || 0));
      localStorage.setItem('bgMusicPlaying', JSON.stringify(!bgMusic.paused));
    } catch (e) {}
  }, 1000);

  const saveNow = () => {
    try {
      localStorage.setItem('bgMusicTime', String(bgMusic.currentTime || 0));
      localStorage.setItem('bgMusicPlaying', JSON.stringify(!bgMusic.paused));
    } catch (e) {}
  };
  window.addEventListener('pagehide', saveNow);
  window.addEventListener('beforeunload', saveNow);

  window.addEventListener('unload', () => clearInterval(saveInterval));
});



document.addEventListener('DOMContentLoaded', () => {
  const productCard = document.getElementById('productCard');
  if (!productCard) return;

  function qs(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  const product = qs('product') || 'Unknown Product';
  const price = qs('price') || '';

  const nameEl = document.getElementById('productName');
  const priceEl = document.getElementById('productPrice');
  const imgEl = document.getElementById('productImg');
  const confirmBtn = document.getElementById('confirmBtn');
  const confirmMsg = document.getElementById('confirmMsg');

  if (nameEl) nameEl.textContent = product;
  if (priceEl) priceEl.textContent = price ? ('$' + price) : '';

  const images = {
    'Hades': 'Hades.jpg',
    'Hades 2': 'Hades-2.jpg',
    'Dinkum': 'Dinkum.png',
    'Stardew Valley': 'Stardew-Valley.jpg'
  };

  const imgFile = images[product];
  if (imgFile && imgEl) {
    imgEl.src = imgFile;
    imgEl.style.display = 'block';
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.6';
      setTimeout(() => {
        if (confirmMsg) confirmMsg.style.display = 'block';
        confirmBtn.style.display = 'none';
      }, 700);
    });
  }
});