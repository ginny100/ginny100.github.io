// @codekit-prepend "/vendor/hammer-2.0.8.js";

$( document ).ready(function() {

  // DOMMouseScroll included for firefox support
  var canScroll = true,
      scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {

      e.preventDefault();

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(1);
      }
      else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }

    }

  });

  $('.side-nav li, .outer-nav li').click(function(){

    if (!($(this).hasClass('is-active'))) {

      var $this = $(this),
          curActive = $this.parent().find('.is-active'),
          curPos = $this.parent().children().index(curActive),
          nextPos = $this.parent().children().index($this),
          lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);

    }

  });

  $('.cta').click(function(){

    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = lastItem;

    updateNavs(lastItem);
    updateContent(curPos, nextPos, lastItem);

  });

  // swipe support for touch devices
  var targetElement = document.getElementById('viewport'),
      mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function(e) {

    updateHelper(e);

  });

  $(document).keyup(function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      updateHelper(e);
    }

  });

  // determine scroll, swipe, and arrow key direction
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0){
      if (curPos !== 0){
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }

  }

  // sync side and outer navigations
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  // update main content area
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    }
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active');
    }

  }

  function outerNav() {

    $('.header--nav-toggle').click(function(){

      $('.perspective').addClass('perspective--modalview');
      setTimeout(function(){
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');

    });

    $('.outer-nav--return, .outer-nav li').click(function(){

      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function(){
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');

    });

  }

  function workSlider() {

    $('.slider--prev, .slider--next').click(function() {

      $('.slider').animate({ opacity : 0 }, 400);

      setTimeout(function(){
      
      let direction = $(this).hasClass('slider--next') ? 1 : -1 // 1 => right, -1 => left
      
      /* there are n elements: 0 -> 1 -> 2 -> ... -> n - 2 -> n - 1
      - n = number of projects = $('.l-section.section .work .work--lockup .slider .slider--item')
      */

      // value1 if some_conditions else value2 => Python
      // some_conditions ? value1 : value2 => Javascript

      let allProjects = $('.l-section.section .work .work--lockup .slider .slider--item');
      let numProjects = allProjects.length;

      // finding the index of the current center element
      for(let i = 0; i < numProjects; ++i){
        // allProjects[i] = current project 
        
        // if current project is the center
        if(allProjects.eq(i).hasClass('slider--item-center')){

          // Find old center, left, right
          let oldCenterId = i;
          let oldLeftId = i == 0 ? numProjects - 1 : i - 1;
          let oldRightId = i == numProjects - 1 ? 0 : i + 1;

          console.log(oldCenterId, oldLeftId, oldRightId);
          
          // Remove old center, left, right
          allProjects.eq(oldCenterId).removeClass('slider--item-center');
          allProjects.eq(oldLeftId).removeClass('slider--item-left');
          allProjects.eq(oldRightId).removeClass('slider--item-right');

          allProjects.addClass('slider--item-hidden');

          // Everything is now hidden
          
          // Find new center
          let newCenterId = oldCenterId + direction;
          if (newCenterId == -1){ newCenterId = numProjects - 1; }
          else if (newCenterId == numProjects) { newCenterId = 0; }
          
          // Find new left
          let newLeftId = oldLeftId + direction;
          if (newLeftId == -1){ newLeftId = numProjects - 1; }
          else if (newLeftId == numProjects) { newLeftId = 0; }

          // Find new right
          let newRightId = oldRightId + direction;
          if (newRightId == -1){ newRightId = numProjects - 1; }
          else if (newRightId == numProjects) { newRightId = 0; }

          console.log(newCenterId, newLeftId, newRightId);
          
          // Add new center, left, right
          allProjects.eq(newCenterId).removeClass('slider--item-hidden').addClass('slider--item-center');
          allProjects.eq(newLeftId).removeClass('slider--item-hidden').addClass('slider--item-left');
          allProjects.eq(newRightId).removeClass('slider--item-hidden').addClass('slider--item-right');

          break;
        }

      }

      // A CSS selector is the first part of a CSS Rule. It is a pattern of elements and other terms that tell the browser which HTML elements should be selected to have the CSS property values inside the rule applied to them.

    }, 400);

    $('.slider').animate({ opacity : 1 }, 400);

    });

  }

  function transitionLabels() {

    $('.work-request--information input').focusout(function(){

      var textVal = $(this).val();

      if (textVal === "") {
        $(this).removeClass('has-value');
      }
      else {
        $(this).addClass('has-value');
      }

      // correct mobile device window position
      window.scrollTo(0, 0);

    });

  }

  outerNav();
  workSlider();
  transitionLabels();

});
