# Swiper Runner
An easy way to use Swiper.js in your project with various options comes with Swiper as API.

> Swiper Runner is a addon for [Swiper.js](https://github.com/nolimits4web/swiper/)

## Usage Example:
Load the superRunner.js file as right after jquery.js and swiper.js loaded.

**MARKUP:** In this code you can see a attribute called "data-swiper-config" and here you can add your carousel configuration provided by [Swiper API](http://idangero.us/swiper/api/) documentation as JSON Objects.

````
<div
   class="swiper-container"
   data-swiper-config='{"loop": true, "autoplay": 3000, "grabCursor": true, "paginationClickable": true}'
>
  <div class="swiper-wrapper">
    ....
    <div class="swiper-slide">Slide X</div>
    ....
  </div>

  <!-- Swiper Pagination -->
  <div class="swiper-pagination"></div>
  <!-- Swiper Nav Prev -->
  <div class="swiper-button-prev"></div>
  <!-- Swiper Nav Next -->
  <div class="swiper-button-next"></div>
</div>
````

**SCRIPT:**
````
var runner = new swiperRunner('.swiper-container');
````
or you can create mullitple slider with with jQuery `.each()` function.
````
$('.swiper-container').each(function() {
	var $this = $(this);

	new swiperRunner($this);
});
````

**Please check examples folder for demos**
