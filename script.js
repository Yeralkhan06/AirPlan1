// ====== Menu overlay (display:none -> flex) ======
const openMenuBtn = document.getElementById('openMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');

openMenuBtn && openMenuBtn.addEventListener('click', () => {
  menuOverlay.style.display = 'flex';
  menuOverlay.setAttribute('aria-hidden', 'false');
  openMenuBtn.setAttribute('aria-expanded', 'true');
  // запрет прокрутки страницы
  document.body.style.overflow = 'hidden';
});
closeMenuBtn && closeMenuBtn.addEventListener('click', () => {
  menuOverlay.style.display = 'none';
  menuOverlay.setAttribute('aria-hidden', 'true');
  openMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
});

// Закрытие по клику за пределами меню-inner
menuOverlay && menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    menuOverlay.style.display = 'none';
    menuOverlay.setAttribute('aria-hidden', 'true');
    openMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ====== Accordion (измерение высоты скрытого блока) ======
document.querySelectorAll('.accordion-item').forEach(item => {
  const header = item.querySelector('.accordion-header');
  const body = item.querySelector('.accordion-body');
  const content = body.querySelector('.box');

  // ensure initial state (height 0)
  body.style.height = '0px';

  header.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.accordion-body').style.height = '0px';
      i.querySelector('.triangle').style.transform = '';
    });

    if (!isActive) {
      item.classList.add('active');
      // set height to scrollHeight
      const h = content.scrollHeight;
      body.style.height = h + 'px';
      item.querySelector('.triangle').style.transform = 'rotate(180deg)';
    }
  });
});

// ====== Swiper init (slider) ======
const swiper = new Swiper('.mySwiper', {
  loop: true,
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  pagination: { el: '.swiper-pagination', clickable: true },
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: { delay: 5000, disableOnInteraction: false },
});

// ====== Slideshow (аватары <-> контент) ======
document.querySelectorAll('.avatar').forEach(avatar => {
  avatar.addEventListener('click', () => {
    const target = avatar.dataset.target;
    document.querySelectorAll('.avatar').forEach(a => a.classList.remove('active'));
    avatar.classList.add('active');

    document.querySelectorAll('.content-item').forEach(ci => ci.classList.remove('active'));
    const targetItem = document.querySelector('.content-item[data-id="' + target + '"]');
    if (targetItem) targetItem.classList.add('active');
  });
});

// ====== Order form: AJAX POST JSON to webdev-api.loftschool.com/sendmail ======
const orderForm = document.getElementById('orderForm');
const orderFeedback = document.getElementById('orderFeedback');

orderForm && orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  orderFeedback.textContent = '';
  orderFeedback.style.color = '';

  const fd = new FormData(orderForm);
  const payload = {
    name: (fd.get('name') || '').trim(),
    phone: (fd.get('phone') || '').trim(),
    comment: (fd.get('comment') || '').trim(),
    to: (fd.get('to') || '').trim()
  };

  // Простая валидация
  if (!payload.name || !payload.phone || !payload.to) {
    orderFeedback.style.color = '#f88';
    orderFeedback.textContent = 'Пожалуйста, заполните обязательные поля.';
    return;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(payload.to)) {
    orderFeedback.style.color = '#f88';
    orderFeedback.textContent = 'Введите корректный email.';
    return;
  }

  // Отправка через fetch (JSON)
  fetch('https://webdev-api.loftschool.com/sendmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.status) {
      orderFeedback.style.color = '#8f8';
      orderFeedback.textContent = data.message || 'Сообщение успешно отправлено (эмуляция).';
      orderForm.reset();
    } else {
      orderFeedback.style.color = '#f88';
      orderFeedback.textContent = (data && data.message) ? data.message : 'Ошибка отправки. Попробуйте позже.';
    }
  })
  .catch(err => {
    console.error(err);
    orderFeedback.style.color = '#f88';
    orderFeedback.textContent = 'Ошибка сети. Попробуйте ещё раз.';
  });
});

// ====== Demo: перехват поиска (чтобы не отправлять куда-то) ======
const searchForm = document.getElementById('search');
searchForm && searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Поиск (демо): ' + new FormData(searchForm).get('from') + ' → ' + new FormData(searchForm).get('to'));
});
