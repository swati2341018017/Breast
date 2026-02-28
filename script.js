/* ===== script.js — Breast Cancer Awareness Website ===== */
$(document).ready(function () {

  // ===== Scroll Progress Bar =====
  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const scrollPercent = (scrollTop / docHeight) * 100;
    $('#scroll-progress').css('width', scrollPercent + '%');
  });

  // ===== Dark Mode Toggle =====
  const darkKey = 'bcaDarkMode';
  if (localStorage.getItem(darkKey) === 'true') {
    $('body').addClass('dark-mode');
    $('#dark-icon').removeClass('fa-moon').addClass('fa-sun');
  }
  $('#dark-toggle').on('click', function () {
    $('body').toggleClass('dark-mode');
    const isDark = $('body').hasClass('dark-mode');
    localStorage.setItem(darkKey, isDark);
    $('#dark-icon').toggleClass('fa-moon fa-sun');
  });

  // ===== Animated Counters (Intersection Observer) =====
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        const duration = 2000;
        const step = Math.ceil(target / (duration / 30));
        let current = 0;
        const timer = setInterval(function () {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          entry.target.textContent = current.toLocaleString() + suffix;
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  // ===== Scroll Reveal =====
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // ===== Accordion Toggle (Self-Exam & FAQ) =====
  $('.custom-accordion .accordion-button').on('click', function () {
    const target = $($(this).data('target'));
    const isOpen = target.hasClass('show');
    // Close all in same accordion
    $(this).closest('.custom-accordion').find('.accordion-collapse').removeClass('show').slideUp(300);
    $(this).closest('.custom-accordion').find('.accordion-button').addClass('collapsed');
    if (!isOpen) {
      target.addClass('show').slideDown(300);
      $(this).removeClass('collapsed');
    }
  });

  // ===== Risk Factor Tabs =====
  $('.risk-tab-btn').on('click', function () {
    const tabId = $(this).data('tab');
    $('.risk-tab-btn').removeClass('active');
    $(this).addClass('active');
    $('.risk-tab-pane').removeClass('active').hide();
    $('#' + tabId).addClass('active').fadeIn(300);
  });

  // ===== BMI Calculator =====
  $('#bmi-form').on('submit', function (e) {
    e.preventDefault();
    const age = parseFloat($('#bmi-age').val());
    const weight = parseFloat($('#bmi-weight').val());
    const height = parseFloat($('#bmi-height').val()) / 100; // cm to m
    if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
      $('#bmi-result').html('<i class="fas fa-exclamation-circle"></i> Please enter valid values.')
        .css({ background: '#fef2f2', color: '#dc2626' }).addClass('show');
      return;
    }
    const bmi = (weight / (height * height)).toFixed(1);
    let category, color, bg, suggestion;
    if (bmi < 18.5) {
      category = 'Underweight'; bg = '#dbeafe'; color = '#1e40af';
      suggestion = 'Being underweight may affect your immune system. Consider a balanced, nutrient-rich diet.';
    } else if (bmi < 25) {
      category = 'Normal Weight'; bg = '#dcfce7'; color = '#166534';
      suggestion = 'Great! Maintaining a healthy weight reduces breast cancer risk by up to 30%.';
    } else if (bmi < 30) {
      category = 'Overweight'; bg = '#fef9c3'; color = '#854d0e';
      suggestion = 'Higher BMI may increase breast cancer risk. Regular exercise and balanced diet can help.';
    } else {
      category = 'Obese'; bg = '#fef2f2'; color = '#dc2626';
      suggestion = 'Obesity is a known risk factor for breast cancer. Please consult a healthcare professional.';
    }
    $('#bmi-result').html(
      '<div style="font-size:2rem;margin-bottom:0.5rem">' + bmi + '</div>' +
      '<div style="font-size:1.1rem;margin-bottom:0.8rem">' + category + '</div>' +
      '<div style="font-size:0.9rem;font-weight:400">' + suggestion + '</div>' +
      (age > 40 ? '<div style="margin-top:0.8rem;font-size:0.85rem;font-weight:400;opacity:0.8"><i class="fas fa-info-circle"></i> At age ' + age + ', regular mammograms are strongly recommended.</div>' : '')
    ).css({ background: bg, color: color }).addClass('show');
  });

  // ===== Survivor Stories Carousel =====
  let currentSlide = 0;
  const slides = $('.story-slide');
  const dots = $('.carousel-dot');
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.removeClass('active');
    dots.removeClass('active');
    $(slides[index]).addClass('active');
    $(dots[index]).addClass('active');
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }
  $('.carousel-btn.next').on('click', nextSlide);
  $('.carousel-btn.prev').on('click', prevSlide);
  dots.on('click', function () {
    currentSlide = $(this).data('index');
    showSlide(currentSlide);
  });
  // Auto-play every 5 seconds
  let autoPlay = setInterval(nextSlide, 5000);
  $('.story-carousel').on('mouseenter', function () { clearInterval(autoPlay); });
  $('.story-carousel').on('mouseleave', function () { autoPlay = setInterval(nextSlide, 5000); });

  // ===== Contact Form Validation =====
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    let valid = true;
    $('.form-error').removeClass('show');
    const name = $('#contact-name').val().trim();
    const email = $('#contact-email').val().trim();
    const message = $('#contact-message').val().trim();
    if (!name) { $('#name-error').addClass('show'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#email-error').addClass('show'); valid = false; }
    if (!message || message.length < 10) { $('#message-error').addClass('show'); valid = false; }
    if (valid) {
      $('#contact-success').addClass('show');
      this.reset();
      setTimeout(function () { $('#contact-success').removeClass('show'); }, 4000);
    }
  });

  // ===== Active Nav Link on Scroll =====
  const sections = $('section[id]');
  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop() + 100;
    sections.each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        $('.navbar-custom .nav-link').removeClass('active');
        $('.navbar-custom .nav-link[href="#' + id + '"]').addClass('active');
      }
    });
  });

  // ===== Smooth Scroll for Nav Links =====
  $('.navbar-custom .nav-link').on('click', function (e) {
    const href = $(this).attr('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = $(href);
      if (target.length) {
        $('html, body').animate({ scrollTop: target.offset().top - 70 }, 600);
        // Close mobile nav
        $('.navbar-collapse').collapse('hide');
      }
    }
  });

});
