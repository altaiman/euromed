'use strict';

$(function () {

	// Главный слайдер 
	function introSlider(data) {
		var autoPlaySlides = data.autoPlay || false,
		    autoPlaySlidesSpeed = data.autoPlaySpeed || 1000,
		    slider = $(data.slider),
		    controls = $(slider).find('.controls').get(0);

		function autoPlay(seconds) {
			setInterval(function () {
				$(controls).find('.controls__arrow_next').trigger('click');
			}, seconds);
		}

		// Счётчик слайдов
		function count() {
			var count = $(controls).find('.controls__count'),
			    slides = $(slider).find('.intro__slide').length,
			    active = $(slider).find('.intro__slide.active').index() + 1;

			$(count).text(active + ' / ' + slides).addClass('change');
			setTimeout(function () {
				$(count).removeClass('change');
			}, 100);
		}

		// Следующий слайд
		function nextSlide() {
			var next = $(slider).find('.intro__slide.active').next().get(0) == undefined ? $(slider).find('.intro__slide').first().get(0) : $(slider).find('.intro__slide.active').next().get(0);
			activeContent(next);
		}

		// Предыдущий слайд
		function prevSlide() {
			var prev = $(slider).find('.intro__slide.active').prev().get(0) === undefined ? $(slider).find('.intro__slide').last() : $(slider).find('.intro__slide.active').prev().get(0);
			activeContent(prev);
		}

		// Замена контента
		function activeContent(slide) {
			var active = slide ? slide : $(slider).find('.intro__slide.active'),
			    contentSlide = $(active).find('.intro__slide-content').html(),
			    content = $(slider).find('.intro__content'),
			    link = $(active).data('link'),
			    altSlide = $(active).find('.intro__slide-alt').html(),
			    alt = $(slider).find('.intro__alt');

			$(slider).find('.intro__slide.active').removeClass('active');
			$(active).addClass('active');

			$(content).addClass('change').html(contentSlide);
			$(slider).find('.intro__more').attr('href', link);

			$(alt).addClass('change');

			count();

			setTimeout(function () {
				$(alt).removeClass('change').empty().append(altSlide);
				var gallery = $(alt).find('.gallery').get(0);

				if (gallery) {
					$(gallery).find('.gallery__slides').slick({
						infinite: true,
						// autoplay: 3000,
						slidesToShow: 1,
						arrows: true,
						fade: true,
						prevArrow: $('.controls_gallery .controls__arrow_prev'),
						nextArrow: $('.controls_gallery .controls__arrow_next')
					});
				}
			}, 500);

			setTimeout(function () {
				$(content).removeClass('change');
			}, 300);
		}

		$(slider).find('.intro__slide').first().addClass('active');

		activeContent();

		$(slider).find('.controls__arrow').on('click', function () {
			var direction = $(this).hasClass('controls__arrow_next');

			switch (direction) {
				case true:
					nextSlide();
					break;
				case false:
					prevSlide();
					break;
			}
		});

		if (autoPlaySlides) autoPlay(autoPlaySlidesSpeed);
	}

	introSlider({
		slider: $('[data-slider="intro"]'),
		autoPlay: true,
		autoPlaySpeed: 5000
	});

	introSlider({
		slider: $('[data-slider="specialists"]'),
		autoPlay: true,
		autoPlaySpeed: 5000
	});

	function brandsSlider() {
		function refresh() {
			var slides = $('.brands__list .brand').children().length,
			    current = $('.brand.slick-current'),
			    index = $(current).index() + 1,
			    img = $(current).data('image'),
			    image = $('.brands__image');

			if (String(slides).length === 1) slides = '0' + slides;
			if (String(index).length === 1) index = '0' + index;

			$('.brands__count span').first().text(index);
			$('.brands__count span').last().text(slides);

			$(image).addClass('change');

			setTimeout(function () {
				$(image).css({
					'background-image': 'url(' + img + ')'
				});
				$(image).removeClass('change');
			}, 100);
		}

		$('.brands__list').slick({
			infinite: true,
			fade: true,
			arrows: true,
			autoplay: true,
			autoplaySpeed: 5000,
			pauseOnHover: false,
			prevArrow: $('.controls_brands .controls__arrow_prev'),
			nextArrow: $('.controls_brands .controls__arrow_next')
		});

		$('.brands__list').on('afterChange', refresh);

		refresh();
	}

	brandsSlider();

	function gallery() {
		$('.gallery').each(function (i, gallery) {
			if ($(gallery).hasClass('gallery_spec')) return;

			$(gallery).find('.gallery__slides').slick({
				infinite: true,
				autoplay: 3000,
				slidesToShow: 1,
				arrows: true,
				fade: true,
				prevArrow: $('.controls_gallery .controls__arrow_prev'),
				nextArrow: $('.controls_gallery .controls__arrow_next')
			});

			function titleSetup(title) {
				var delay = 150;

				$(titles).fadeOut(delay, function () {
					$(this).html(title).fadeIn(delay);
				});
			}

			var titles = $(gallery).find('.gallery__title').get(0);

			if (titles) {
				var title = $(gallery).find('.slick-current').data('title');
				titleSetup(title);

				$(gallery).find('.gallery__slides').on('beforeChange', function (e, slick, currentSlide, nextSlide) {
					var index = nextSlide,
					    slide = $(gallery).find('.gallery__item').get(index),
					    title = $(slide).data('title');

					titleSetup(title);
				});
			}
		});
	}

	gallery();

	// Простые слайдеры
	$('.slider').each(function (i, slider) {
		var sl = $(slider).find('.slider__list');

		sl.slick({
			variableWidth: true,
			centerMode: true,
			arrows: true,
			prevArrow: $(slider).find('.controls__arrow_prev'),
			nextArrow: $(slider).find('.controls__arrow_next')
		});

		var bigImg = $(slider).data('bigimg');

		if (bigImg) {
			var big = $('.' + bigImg).get(0);

			$(big).html($(sl).find('.slick-current img').clone());

			$(sl).find('.slider__item').on('click', function (e) {
				e.preventDefault();

				var img = $(this).find('img').clone();

				$(big).empty().html(img);
			});
		}
	});

	// bpopup
	$('[data-bpopup]').on('click', function (e) {
		e.preventDefault();

		var img = $(this).find('img').clone(),
		    imgWrap = '<div class="bpopup-wrap-image"></div>';

		$('body').append(imgWrap);
		$(imgWrap).append(img).bPopup().reposition(300);
	});

	// Карта
	var map = $('#map').get(0);

	if (map) {
		var init = function init() {
			myMap = new ymaps.Map("map", {
				center: [53.334136, 83.793247],
				zoom: 17,
				controls: []
			});

			myPlacemark = new ymaps.Placemark([53.334136, 83.793247], {
				hintContent: 'ТД Ultra'
			});

			myMap.geoObjects.add(myPlacemark);
		};

		ymaps.ready(init);

		var myMap, myPlacemark;
	}

	// Красивые селекты
	$('select').niceSelect();

	// Мобильное меню
	$('.menu').on('click', function () {
		$(this).parent().toggleClass('menu-open');
	});

	// Поиск
	searchComponent();

	function searchComponent() {
		var search = $('.search');

		$('.search__btn').on('click', function () {
			if ($(window).width() > 768) return;

			$(search).toggleClass('search-open');
			$(search).find('input').focus();
		});

		$('.search__clear').on('click', function () {
			$(search).find('.search__field input').val('').focus();
		});
	}

	// Сравнение
	$('.result__compare').twentytwenty({
		before_label: 'До',
		after_label: 'После'
	});

	// tilt js
	$('.sertificate').tilt();

	// Плавающая шапка
	$('body').append($('.header__main').clone().addClass('fixed'));

	$(window).on('scroll', function () {
		if ($(window).width() <= 1000) {
			$('.header__main.fixed.show').removeClass('show');
			return;
		}

		var scroll = $(window).scrollTop();

		if (scroll >= 200) {
			$('.header__main.fixed').addClass('show');
		} else {
			$('.header__main.fixed.show').removeClass('show');
		}
	});

	// Модальные окна
	$('[data-open]').on('click', function (e) {
		e.preventDefault();

		var modal = $('[data-modal="' + $(this).data('open') + '"]').get(0);

		$(modal).bPopup({
			closeClass: 'modal__close'
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6WyIkIiwiaW50cm9TbGlkZXIiLCJkYXRhIiwiYXV0b1BsYXlTbGlkZXMiLCJhdXRvUGxheSIsImF1dG9QbGF5U2xpZGVzU3BlZWQiLCJhdXRvUGxheVNwZWVkIiwic2xpZGVyIiwiY29udHJvbHMiLCJmaW5kIiwiZ2V0Iiwic2Vjb25kcyIsInNldEludGVydmFsIiwidHJpZ2dlciIsImNvdW50Iiwic2xpZGVzIiwibGVuZ3RoIiwiYWN0aXZlIiwiaW5kZXgiLCJ0ZXh0IiwiYWRkQ2xhc3MiLCJzZXRUaW1lb3V0IiwicmVtb3ZlQ2xhc3MiLCJuZXh0U2xpZGUiLCJuZXh0IiwidW5kZWZpbmVkIiwiZmlyc3QiLCJhY3RpdmVDb250ZW50IiwicHJldlNsaWRlIiwicHJldiIsImxhc3QiLCJzbGlkZSIsImNvbnRlbnRTbGlkZSIsImh0bWwiLCJjb250ZW50IiwibGluayIsImFsdFNsaWRlIiwiYWx0IiwiYXR0ciIsImVtcHR5IiwiYXBwZW5kIiwiZ2FsbGVyeSIsInNsaWNrIiwiaW5maW5pdGUiLCJzbGlkZXNUb1Nob3ciLCJhcnJvd3MiLCJmYWRlIiwicHJldkFycm93IiwibmV4dEFycm93Iiwib24iLCJkaXJlY3Rpb24iLCJoYXNDbGFzcyIsImJyYW5kc1NsaWRlciIsInJlZnJlc2giLCJjaGlsZHJlbiIsImN1cnJlbnQiLCJpbWciLCJpbWFnZSIsIlN0cmluZyIsImNzcyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsInBhdXNlT25Ib3ZlciIsImVhY2giLCJpIiwidGl0bGVTZXR1cCIsInRpdGxlIiwiZGVsYXkiLCJ0aXRsZXMiLCJmYWRlT3V0IiwiZmFkZUluIiwiZSIsImN1cnJlbnRTbGlkZSIsInNsIiwidmFyaWFibGVXaWR0aCIsImNlbnRlck1vZGUiLCJiaWdJbWciLCJiaWciLCJjbG9uZSIsInByZXZlbnREZWZhdWx0IiwiaW1nV3JhcCIsImJQb3B1cCIsInJlcG9zaXRpb24iLCJtYXAiLCJpbml0IiwibXlNYXAiLCJ5bWFwcyIsIk1hcCIsImNlbnRlciIsInpvb20iLCJteVBsYWNlbWFyayIsIlBsYWNlbWFyayIsImhpbnRDb250ZW50IiwiZ2VvT2JqZWN0cyIsImFkZCIsInJlYWR5IiwibmljZVNlbGVjdCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwic2VhcmNoQ29tcG9uZW50Iiwic2VhcmNoIiwid2luZG93Iiwid2lkdGgiLCJmb2N1cyIsInZhbCIsInR3ZW50eXR3ZW50eSIsImJlZm9yZV9sYWJlbCIsImFmdGVyX2xhYmVsIiwidGlsdCIsInNjcm9sbCIsInNjcm9sbFRvcCIsIm1vZGFsIiwiY2xvc2VDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsRUFBRSxZQUFXOztBQUVaO0FBQ0EsVUFBU0MsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDMUIsTUFBSUMsaUJBQWlCRCxLQUFLRSxRQUFMLElBQWlCLEtBQXRDO0FBQUEsTUFDQ0Msc0JBQXNCSCxLQUFLSSxhQUFMLElBQXNCLElBRDdDO0FBQUEsTUFFQ0MsU0FBU1AsRUFBRUUsS0FBS0ssTUFBUCxDQUZWO0FBQUEsTUFHQ0MsV0FBV1IsRUFBRU8sTUFBRixFQUFVRSxJQUFWLENBQWUsV0FBZixFQUE0QkMsR0FBNUIsQ0FBZ0MsQ0FBaEMsQ0FIWjs7QUFLQSxXQUFTTixRQUFULENBQWtCTyxPQUFsQixFQUEyQjtBQUMxQkMsZUFBWSxZQUFXO0FBQ3RCWixNQUFFUSxRQUFGLEVBQVlDLElBQVosQ0FBaUIsdUJBQWpCLEVBQTBDSSxPQUExQyxDQUFrRCxPQUFsRDtBQUNBLElBRkQsRUFFR0YsT0FGSDtBQUdBOztBQUVEO0FBQ0EsV0FBU0csS0FBVCxHQUFpQjtBQUNoQixPQUFJQSxRQUFRZCxFQUFFUSxRQUFGLEVBQVlDLElBQVosQ0FBaUIsa0JBQWpCLENBQVo7QUFBQSxPQUNDTSxTQUFTZixFQUFFTyxNQUFGLEVBQVVFLElBQVYsQ0FBZSxlQUFmLEVBQWdDTyxNQUQxQztBQUFBLE9BRUNDLFNBQVNqQixFQUFFTyxNQUFGLEVBQVVFLElBQVYsQ0FB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Q0FBakI7O0FBRUFwQixHQUFFcUcsTUFBRixFQUFVcEQsRUFBVixDQUFhLFFBQWIsRUFBdUIsWUFBVztBQUNqQyxNQUFJakQsRUFBRXFHLE1BQUYsRUFBVUMsS0FBVixNQUFxQixJQUF6QixFQUErQjtBQUM5QnRHLEtBQUUsMEJBQUYsRUFBOEJzQixXQUE5QixDQUEwQyxNQUExQztBQUNBO0FBQ0E7O0FBRUQsTUFBSXVGLFNBQVM3RyxFQUFFcUcsTUFBRixFQUFVUyxTQUFWLEVBQWI7O0FBRUEsTUFBSUQsVUFBVSxHQUFkLEVBQW1CO0FBQ2xCN0csS0FBRSxxQkFBRixFQUF5Qm9CLFFBQXpCLENBQWtDLE1BQWxDO0FBQ0EsR0FGRCxNQUVPO0FBQ05wQixLQUFFLDBCQUFGLEVBQThCc0IsV0FBOUIsQ0FBMEMsTUFBMUM7QUFDQTtBQUNELEVBYkQ7O0FBZUE7QUFDQXRCLEdBQUUsYUFBRixFQUFpQmlELEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFVBQVNzQixDQUFULEVBQVk7QUFDeENBLElBQUVRLGNBQUY7O0FBRUEsTUFBSWdDLFFBQVEvRyxFQUFFLGtCQUFnQkEsRUFBRSxJQUFGLEVBQVFFLElBQVIsQ0FBYSxNQUFiLENBQWhCLEdBQXFDLElBQXZDLEVBQTZDUSxHQUE3QyxDQUFpRCxDQUFqRCxDQUFaOztBQUVBVixJQUFFK0csS0FBRixFQUFTOUIsTUFBVCxDQUFnQjtBQUNmK0IsZUFBWTtBQURHLEdBQWhCO0FBR0EsRUFSRDtBQVVBLENBdlVEIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG5cblx0Ly8g0JPQu9Cw0LLQvdGL0Lkg0YHQu9Cw0LnQtNC10YAgXG5cdGZ1bmN0aW9uIGludHJvU2xpZGVyKGRhdGEpIHtcblx0XHR2YXIgYXV0b1BsYXlTbGlkZXMgPSBkYXRhLmF1dG9QbGF5IHx8IGZhbHNlLFxuXHRcdFx0YXV0b1BsYXlTbGlkZXNTcGVlZCA9IGRhdGEuYXV0b1BsYXlTcGVlZCB8fCAxMDAwLFxuXHRcdFx0c2xpZGVyID0gJChkYXRhLnNsaWRlciksXG5cdFx0XHRjb250cm9scyA9ICQoc2xpZGVyKS5maW5kKCcuY29udHJvbHMnKS5nZXQoMCk7XG5cblx0XHRmdW5jdGlvbiBhdXRvUGxheShzZWNvbmRzKSB7XG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRcdFx0JChjb250cm9scykuZmluZCgnLmNvbnRyb2xzX19hcnJvd19uZXh0JykudHJpZ2dlcignY2xpY2snKTtcblx0XHRcdH0sIHNlY29uZHMpO1xuXHRcdH1cblxuXHRcdC8vINCh0YfRkdGC0YfQuNC6INGB0LvQsNC50LTQvtCyXG5cdFx0ZnVuY3Rpb24gY291bnQoKSB7XG5cdFx0XHR2YXIgY291bnQgPSAkKGNvbnRyb2xzKS5maW5kKCcuY29udHJvbHNfX2NvdW50JyksXG5cdFx0XHRcdHNsaWRlcyA9ICQoc2xpZGVyKS5maW5kKCcuaW50cm9fX3NsaWRlJykubGVuZ3RoLFxuXHRcdFx0XHRhY3RpdmUgPSAkKHNsaWRlcikuZmluZCgnLmludHJvX19zbGlkZS5hY3RpdmUnKS5pbmRleCgpKzE7XG5cblx0XHRcdCQoY291bnQpLnRleHQoYWN0aXZlKycgLyAnK3NsaWRlcykuYWRkQ2xhc3MoJ2NoYW5nZScpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JChjb3VudCkucmVtb3ZlQ2xhc3MoJ2NoYW5nZScpO1xuXHRcdFx0fSwgMTAwKVxuXHRcdH1cblxuXHRcdC8vINCh0LvQtdC00YPRjtGJ0LjQuSDRgdC70LDQudC0XG5cdFx0ZnVuY3Rpb24gbmV4dFNsaWRlKCkge1xuXHRcdFx0dmFyIG5leHQgPSAoJChzbGlkZXIpLmZpbmQoJy5pbnRyb19fc2xpZGUuYWN0aXZlJykubmV4dCgpLmdldCgwKSA9PSB1bmRlZmluZWQpID8gJChzbGlkZXIpLmZpbmQoJy5pbnRyb19fc2xpZGUnKS5maXJzdCgpLmdldCgwKSA6ICQoc2xpZGVyKS5maW5kKCcuaW50cm9fX3NsaWRlLmFjdGl2ZScpLm5leHQoKS5nZXQoMCk7XG5cdFx0XHRhY3RpdmVDb250ZW50KG5leHQpO1xuXHRcdH1cblxuXHRcdC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcblx0XHRmdW5jdGlvbiBwcmV2U2xpZGUoKSB7XG5cdFx0XHR2YXIgcHJldiA9ICgkKHNsaWRlcikuZmluZCgnLmludHJvX19zbGlkZS5hY3RpdmUnKS5wcmV2KCkuZ2V0KDApID09PSB1bmRlZmluZWQpID8gJChzbGlkZXIpLmZpbmQoJy5pbnRyb19fc2xpZGUnKS5sYXN0KCkgOiAkKHNsaWRlcikuZmluZCgnLmludHJvX19zbGlkZS5hY3RpdmUnKS5wcmV2KCkuZ2V0KDApO1xuXHRcdFx0YWN0aXZlQ29udGVudChwcmV2KTtcblx0XHR9XG5cblx0XHQvLyDQl9Cw0LzQtdC90LAg0LrQvtC90YLQtdC90YLQsFxuXHRcdGZ1bmN0aW9uIGFjdGl2ZUNvbnRlbnQoc2xpZGUpIHtcblx0XHRcdHZhciBhY3RpdmUgPSAoc2xpZGUpID8gc2xpZGUgOiAkKHNsaWRlcikuZmluZCgnLmludHJvX19zbGlkZS5hY3RpdmUnKSxcblx0XHRcdFx0Y29udGVudFNsaWRlID0gJChhY3RpdmUpLmZpbmQoJy5pbnRyb19fc2xpZGUtY29udGVudCcpLmh0bWwoKSxcblx0XHRcdFx0Y29udGVudCA9ICQoc2xpZGVyKS5maW5kKCcuaW50cm9fX2NvbnRlbnQnKSxcblx0XHRcdFx0bGluayA9ICQoYWN0aXZlKS5kYXRhKCdsaW5rJyksXG5cdFx0XHRcdGFsdFNsaWRlID0gJChhY3RpdmUpLmZpbmQoJy5pbnRyb19fc2xpZGUtYWx0JykuaHRtbCgpLFxuXHRcdFx0XHRhbHQgPSAkKHNsaWRlcikuZmluZCgnLmludHJvX19hbHQnKTtcblxuXHRcdFx0JChzbGlkZXIpLmZpbmQoJy5pbnRyb19fc2xpZGUuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JChhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdFx0JChjb250ZW50KS5hZGRDbGFzcygnY2hhbmdlJykuaHRtbChjb250ZW50U2xpZGUpO1xuXHRcdFx0JChzbGlkZXIpLmZpbmQoJy5pbnRyb19fbW9yZScpLmF0dHIoJ2hyZWYnLCBsaW5rKTtcblxuXHRcdFx0JChhbHQpLmFkZENsYXNzKCdjaGFuZ2UnKTtcblxuXHRcdFx0Y291bnQoKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JChhbHQpLnJlbW92ZUNsYXNzKCdjaGFuZ2UnKS5lbXB0eSgpLmFwcGVuZChhbHRTbGlkZSk7XG5cdFx0XHRcdHZhciBnYWxsZXJ5ID0gJChhbHQpLmZpbmQoJy5nYWxsZXJ5JykuZ2V0KDApO1xuXG5cdFx0XHRcdGlmIChnYWxsZXJ5KSB7XG5cdFx0XHRcdFx0JChnYWxsZXJ5KS5maW5kKCcuZ2FsbGVyeV9fc2xpZGVzJykuc2xpY2soe1xuXHRcdFx0XHRcdFx0aW5maW5pdGU6IHRydWUsXG5cdFx0XHRcdFx0XHQvLyBhdXRvcGxheTogMzAwMCxcblx0XHRcdFx0XHRcdHNsaWRlc1RvU2hvdzogMSxcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGZhZGU6IHRydWUsXG5cdFx0XHRcdFx0XHRwcmV2QXJyb3c6ICQoJy5jb250cm9sc19nYWxsZXJ5IC5jb250cm9sc19fYXJyb3dfcHJldicpLFxuXHRcdFx0XHRcdFx0bmV4dEFycm93OiAkKCcuY29udHJvbHNfZ2FsbGVyeSAuY29udHJvbHNfX2Fycm93X25leHQnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCA1MDApO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKGNvbnRlbnQpLnJlbW92ZUNsYXNzKCdjaGFuZ2UnKTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXG5cdFx0JChzbGlkZXIpLmZpbmQoJy5pbnRyb19fc2xpZGUnKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGFjdGl2ZUNvbnRlbnQoKTtcblxuXHRcdCQoc2xpZGVyKS5maW5kKCcuY29udHJvbHNfX2Fycm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGlyZWN0aW9uID0gJCh0aGlzKS5oYXNDbGFzcygnY29udHJvbHNfX2Fycm93X25leHQnKTtcblx0XHRcdFxuXHRcdFx0c3dpdGNoIChkaXJlY3Rpb24pIHtcblx0XHRcdFx0Y2FzZSB0cnVlOlxuXHRcdFx0XHRcdG5leHRTbGlkZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGZhbHNlOlxuXHRcdFx0XHRcdHByZXZTbGlkZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHRpZiAoYXV0b1BsYXlTbGlkZXMpIGF1dG9QbGF5KGF1dG9QbGF5U2xpZGVzU3BlZWQpO1xuXHR9XG5cblx0aW50cm9TbGlkZXIoe1xuXHRcdHNsaWRlcjogJCgnW2RhdGEtc2xpZGVyPVwiaW50cm9cIl0nKSxcblx0XHRhdXRvUGxheTogdHJ1ZSxcblx0XHRhdXRvUGxheVNwZWVkOiA1MDAwXG5cdH0pXG5cblx0aW50cm9TbGlkZXIoe1xuXHRcdHNsaWRlcjogJCgnW2RhdGEtc2xpZGVyPVwic3BlY2lhbGlzdHNcIl0nKSxcblx0XHRhdXRvUGxheTogdHJ1ZSxcblx0XHRhdXRvUGxheVNwZWVkOiA1MDAwXG5cdH0pXG5cblx0ZnVuY3Rpb24gYnJhbmRzU2xpZGVyKCkge1xuXHRcdGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdFx0XHR2YXIgc2xpZGVzID0gJCgnLmJyYW5kc19fbGlzdCAuYnJhbmQnKS5jaGlsZHJlbigpLmxlbmd0aCxcblx0XHRcdFx0Y3VycmVudCA9ICQoJy5icmFuZC5zbGljay1jdXJyZW50JyksXG5cdFx0XHRcdGluZGV4ID0gJChjdXJyZW50KS5pbmRleCgpKzEsXG5cdFx0XHRcdGltZyA9ICQoY3VycmVudCkuZGF0YSgnaW1hZ2UnKSxcblx0XHRcdFx0aW1hZ2UgPSAkKCcuYnJhbmRzX19pbWFnZScpO1xuXG5cdFx0XHRpZiAoU3RyaW5nKHNsaWRlcykubGVuZ3RoID09PSAxKSBzbGlkZXMgPSAnMCcrc2xpZGVzO1xuXHRcdFx0aWYgKFN0cmluZyhpbmRleCkubGVuZ3RoID09PSAxKSBpbmRleCA9ICcwJytpbmRleDtcblxuXHRcdFx0JCgnLmJyYW5kc19fY291bnQgc3BhbicpLmZpcnN0KCkudGV4dChpbmRleCk7XG5cdFx0XHQkKCcuYnJhbmRzX19jb3VudCBzcGFuJykubGFzdCgpLnRleHQoc2xpZGVzKTtcblxuXHRcdFx0JChpbWFnZSkuYWRkQ2xhc3MoJ2NoYW5nZScpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKGltYWdlKS5jc3Moe1xuXHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnK2ltZysnKSdcblx0XHRcdFx0fSlcblx0XHRcdFx0JChpbWFnZSkucmVtb3ZlQ2xhc3MoJ2NoYW5nZScpO1xuXHRcdFx0fSwgMTAwKVxuXHRcdH1cblxuXHRcdCQoJy5icmFuZHNfX2xpc3QnKS5zbGljayh7XG5cdFx0XHRpbmZpbml0ZTogdHJ1ZSxcblx0XHRcdGZhZGU6IHRydWUsXG5cdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRhdXRvcGxheTogdHJ1ZSxcbiAgXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcbiAgXHRcdFx0cGF1c2VPbkhvdmVyOiBmYWxzZSxcblx0XHRcdHByZXZBcnJvdzogJCgnLmNvbnRyb2xzX2JyYW5kcyAuY29udHJvbHNfX2Fycm93X3ByZXYnKSxcblx0XHRcdG5leHRBcnJvdzogJCgnLmNvbnRyb2xzX2JyYW5kcyAuY29udHJvbHNfX2Fycm93X25leHQnKVxuXHRcdH0pO1xuXHRcdFxuXHRcdCQoJy5icmFuZHNfX2xpc3QnKS5vbignYWZ0ZXJDaGFuZ2UnLCByZWZyZXNoKTtcblxuXHRcdHJlZnJlc2goKTtcblx0fVxuXG5cdGJyYW5kc1NsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGdhbGxlcnkoKSB7XG5cdFx0JCgnLmdhbGxlcnknKS5lYWNoKGZ1bmN0aW9uKGksIGdhbGxlcnkpIHtcblx0XHRcdGlmICgkKGdhbGxlcnkpLmhhc0NsYXNzKCdnYWxsZXJ5X3NwZWMnKSkgcmV0dXJuO1xuXG5cdFx0XHQkKGdhbGxlcnkpLmZpbmQoJy5nYWxsZXJ5X19zbGlkZXMnKS5zbGljayh7XG5cdFx0XHRcdGluZmluaXRlOiB0cnVlLFxuXHRcdFx0XHRhdXRvcGxheTogMzAwMCxcblx0XHRcdFx0c2xpZGVzVG9TaG93OiAxLFxuXHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdGZhZGU6IHRydWUsXG5cdFx0XHRcdHByZXZBcnJvdzogJCgnLmNvbnRyb2xzX2dhbGxlcnkgLmNvbnRyb2xzX19hcnJvd19wcmV2JyksXG5cdFx0XHRcdG5leHRBcnJvdzogJCgnLmNvbnRyb2xzX2dhbGxlcnkgLmNvbnRyb2xzX19hcnJvd19uZXh0Jylcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiB0aXRsZVNldHVwKHRpdGxlKSB7XG5cdFx0XHRcdHZhciBkZWxheSA9IDE1MDtcblx0XHRcdFx0XG5cdFx0XHRcdCQodGl0bGVzKS5mYWRlT3V0KGRlbGF5LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmh0bWwodGl0bGUpLmZhZGVJbihkZWxheSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciB0aXRsZXMgPSAkKGdhbGxlcnkpLmZpbmQoJy5nYWxsZXJ5X190aXRsZScpLmdldCgwKTtcblxuXHRcdFx0aWYgKHRpdGxlcykge1xuXHRcdFx0XHR2YXIgdGl0bGUgPSAkKGdhbGxlcnkpLmZpbmQoJy5zbGljay1jdXJyZW50JykuZGF0YSgndGl0bGUnKTtcblx0XHRcdFx0dGl0bGVTZXR1cCh0aXRsZSk7XG5cblx0XHRcdFx0JChnYWxsZXJ5KS5maW5kKCcuZ2FsbGVyeV9fc2xpZGVzJykub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGUsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkge1xuXHRcdFx0XHRcdHZhciBpbmRleCA9IG5leHRTbGlkZSxcblx0XHRcdFx0XHRcdHNsaWRlID0gJChnYWxsZXJ5KS5maW5kKCcuZ2FsbGVyeV9faXRlbScpLmdldChpbmRleCksXG5cdFx0XHRcdFx0XHR0aXRsZSA9ICQoc2xpZGUpLmRhdGEoJ3RpdGxlJyk7XG5cblx0XHRcdFx0XHR0aXRsZVNldHVwKHRpdGxlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXG5cdGdhbGxlcnkoKTtcblxuXG5cdC8vINCf0YDQvtGB0YLRi9C1INGB0LvQsNC50LTQtdGA0Ytcblx0JCgnLnNsaWRlcicpLmVhY2goZnVuY3Rpb24oaSwgc2xpZGVyKSB7XG5cdFx0dmFyIHNsID0gJChzbGlkZXIpLmZpbmQoJy5zbGlkZXJfX2xpc3QnKTtcblxuXHRcdHNsLnNsaWNrKHtcblx0XHRcdHZhcmlhYmxlV2lkdGg6IHRydWUsXG5cdFx0XHRjZW50ZXJNb2RlOiB0cnVlLFxuXHRcdFx0YXJyb3dzOiB0cnVlLFxuXHRcdFx0cHJldkFycm93OiAkKHNsaWRlcikuZmluZCgnLmNvbnRyb2xzX19hcnJvd19wcmV2JyksXG5cdFx0XHRuZXh0QXJyb3c6ICQoc2xpZGVyKS5maW5kKCcuY29udHJvbHNfX2Fycm93X25leHQnKVxuXHRcdH0pXG5cblx0XHR2YXIgYmlnSW1nID0gJChzbGlkZXIpLmRhdGEoJ2JpZ2ltZycpO1xuXG5cdFx0aWYgKGJpZ0ltZykge1xuXHRcdFx0dmFyIGJpZyA9ICQoJy4nK2JpZ0ltZykuZ2V0KDApO1xuXG5cdFx0XHQkKGJpZykuaHRtbCgkKHNsKS5maW5kKCcuc2xpY2stY3VycmVudCBpbWcnKS5jbG9uZSgpKTtcblxuXHRcdFx0JChzbCkuZmluZCgnLnNsaWRlcl9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciBpbWcgPSAkKHRoaXMpLmZpbmQoJ2ltZycpLmNsb25lKCk7XG5cblx0XHRcdFx0JChiaWcpLmVtcHR5KCkuaHRtbChpbWcpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH0pO1xuXG5cdC8vIGJwb3B1cFxuXHQkKCdbZGF0YS1icG9wdXBdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBpbWcgPSAkKHRoaXMpLmZpbmQoJ2ltZycpLmNsb25lKCksXG5cdFx0XHRpbWdXcmFwID0gJzxkaXYgY2xhc3M9XCJicG9wdXAtd3JhcC1pbWFnZVwiPjwvZGl2Pic7XG5cblx0XHQkKCdib2R5JykuYXBwZW5kKGltZ1dyYXApO1xuXHRcdCQoaW1nV3JhcCkuYXBwZW5kKGltZykuYlBvcHVwKCkucmVwb3NpdGlvbigzMDApO1xuXHRcdFxuXG5cdH0pXG5cblx0Ly8g0JrQsNGA0YLQsFxuXHR2YXIgbWFwID0gJCgnI21hcCcpLmdldCgwKTtcblxuXHRpZiAobWFwKSB7XG5cdFx0eW1hcHMucmVhZHkoaW5pdCk7XG5cblx0ICAgIHZhciBteU1hcCwgXG5cdCAgICAgICAgbXlQbGFjZW1hcms7XG5cblx0ICAgIGZ1bmN0aW9uIGluaXQoKXsgXG5cdCAgICAgICAgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwXCIsIHtcblx0ICAgICAgICAgICAgY2VudGVyOiBbNTMuMzM0MTM2LCA4My43OTMyNDddLFxuXHQgICAgICAgICAgICB6b29tOiAxNyxcblx0ICAgICAgICAgICAgY29udHJvbHM6IFtdXG5cdCAgICAgICAgfSk7IFxuXHQgICAgICAgIFxuXHQgICAgICAgIG15UGxhY2VtYXJrID0gbmV3IHltYXBzLlBsYWNlbWFyayhbNTMuMzM0MTM2LCA4My43OTMyNDddLCB7XG5cdCAgICAgICAgICAgIGhpbnRDb250ZW50OiAn0KLQlCBVbHRyYSdcblx0ICAgICAgICB9KTtcblx0ICAgICAgICBcblx0ICAgICAgICBteU1hcC5nZW9PYmplY3RzLmFkZChteVBsYWNlbWFyayk7XG5cdCAgICB9XG5cdH1cblxuXHQvLyDQmtGA0LDRgdC40LLRi9C1INGB0LXQu9C10LrRgtGLXG5cdCQoJ3NlbGVjdCcpLm5pY2VTZWxlY3QoKTtcblxuXHQvLyDQnNC+0LHQuNC70YzQvdC+0LUg0LzQtdC90Y5cblx0JCgnLm1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdtZW51LW9wZW4nKTtcblx0fSk7XG5cblx0Ly8g0J/QvtC40YHQulxuXHRzZWFyY2hDb21wb25lbnQoKTtcblxuXHRmdW5jdGlvbiBzZWFyY2hDb21wb25lbnQoKSB7XG5cdFx0dmFyIHNlYXJjaCA9ICQoJy5zZWFyY2gnKTtcblxuXHRcdCQoJy5zZWFyY2hfX2J0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSByZXR1cm47XG5cblx0XHRcdCQoc2VhcmNoKS50b2dnbGVDbGFzcygnc2VhcmNoLW9wZW4nKTtcblx0XHRcdCQoc2VhcmNoKS5maW5kKCdpbnB1dCcpLmZvY3VzKCk7XG5cdFx0fSk7XG5cblx0XHQkKCcuc2VhcmNoX19jbGVhcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JChzZWFyY2gpLmZpbmQoJy5zZWFyY2hfX2ZpZWxkIGlucHV0JykudmFsKCcnKS5mb2N1cygpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8g0KHRgNCw0LLQvdC10L3QuNC1XG5cdCQoJy5yZXN1bHRfX2NvbXBhcmUnKS50d2VudHl0d2VudHkoe1xuXHRcdGJlZm9yZV9sYWJlbDogJ9CU0L4nLFxuXHRcdGFmdGVyX2xhYmVsOiAn0J/QvtGB0LvQtSdcblx0fSk7XG5cblx0Ly8gdGlsdCBqc1xuXHQkKCcuc2VydGlmaWNhdGUnKS50aWx0KCk7XG5cblx0Ly8g0J/Qu9Cw0LLQsNGO0YnQsNGPINGI0LDQv9C60LBcblx0JCgnYm9keScpLmFwcGVuZCgkKCcuaGVhZGVyX19tYWluJykuY2xvbmUoKS5hZGRDbGFzcygnZml4ZWQnKSk7XG5cblx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gMTAwMCkge1xuXHRcdFx0JCgnLmhlYWRlcl9fbWFpbi5maXhlZC5zaG93JykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cblx0XHRpZiAoc2Nyb2xsID49IDIwMCkge1xuXHRcdFx0JCgnLmhlYWRlcl9fbWFpbi5maXhlZCcpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy5oZWFkZXJfX21haW4uZml4ZWQuc2hvdycpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyDQnNC+0LTQsNC70YzQvdGL0LUg0L7QutC90LBcblx0JCgnW2RhdGEtb3Blbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIG1vZGFsID0gJCgnW2RhdGEtbW9kYWw9XCInKyQodGhpcykuZGF0YSgnb3BlbicpKydcIl0nKS5nZXQoMCk7XG5cblx0XHQkKG1vZGFsKS5iUG9wdXAoe1xuXHRcdFx0Y2xvc2VDbGFzczogJ21vZGFsX19jbG9zZSdcblx0XHR9KTtcblx0fSk7XG5cbn0pOyJdfQ==
