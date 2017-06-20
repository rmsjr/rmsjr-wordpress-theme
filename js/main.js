require.config({
	baseUrl:"/wp-content/themes/rmsjr/js/",
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min",
		'masonry' : "vendor/masonry.pkgd.min",
		'bootstrap' : 'vendor/bootstrap.min',
		'fancybox' : 'vendor/fancybox/jquery.fancybox',
		'imagesLoaded' : 'vendor/imagesloaded.pkgd.min',
		'froogaloop2' : 'vendor/froogaloop2.min',
		'mousewheel' : 'vendor/jquery.mousewheel.min',
		'tinycolor' : 'vendor/tinycolor',
		'vimeoPlayer' : "https://player.vimeo.com/api/player"
	},
	shim: {
		'bootstrap': ['jquery'],
		'fancybox': ['jquery'],
		'masonry': ['jquery'],
		'froogaloop2': ['jquery'],
		'mousewheel' : ['jquery'],
		// 'content-grid': ['jquery', 'masonry', 'imagesLoaded']
		'content-grid-jquery': ['jquery', 'masonry', 'imagesLoaded']
	}
});

require(['require', 'jquery', 'page-scripts', 'content-grid-jquery', 'primary-menu', 'fancybox', 'bootstrap'], function (require, $, PageScripts, contentGrid, primaryMenu)
{
	function displayContent()
	{
		// hide loading display;
		var loadingDisplay = $('.loadingDisplay');
		loadingDisplay.css('opacity',0);

		if($('.intro').data('rmsjr.contentIntro').hidden === true)
		{
			// if not the homepage, hide the intro.
			// else:
			$('html').removeClass('loading');
		}

		loadingDisplay.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
			// do something here
			loadingDisplay.hide();
		});
	}

	$('.intro').contentIntro('hide');

	// Initialize the content grids
	if ($('.grid').length > 0)
	{
		$('.grid').contentGrid({loadedCallback: displayContent});
	}
	else
	{
		displayContent();
		$(window).on("load", displayContent);
	}

	$('.topLogo').on('click', function()
	{
		$('.intro').contentIntro('in');
		return false;
	});

	var pageId = $('.content').attr('id');
	var pageTypeId = $('.content > div').attr('id');

	// run page type scripts
	if (typeof(PageScripts[pageTypeId]) === 'function')
	{
		PageScripts[pageTypeId]();

	}

	// run any page specific scripts
	if (typeof(PageScripts[pageId]) === 'function')
	{
		PageScripts[pageId]();

	}


	// Initialize primary menu nav
	primaryMenu.init();



});