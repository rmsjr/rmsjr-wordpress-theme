define(['jquery', 'utils','mousewheel'], function ($, Utils) {



	var ContentIntro = function (jqo, options)
	{
		this.options = options;
		this.$jqo = $(jqo);
		this.hidden = false;
		$(window).on("mousewheel", $.proxy(this.scrollHandler, this));
		$(window).on("resize", $.proxy(this.resizeHandler, this));
		this.$introMenu = $('.intro-menu');
	};

	ContentIntro.DEFAULTS = {
	};

	ContentIntro.prototype = {

		scrollHandler : function(e)
		{

			// e.detaY < -1 means the user is scrolling down
			if (e.deltaY <= -1)
			{
				this.out();
				$(window).off('mousewheel');
			}

		},


		transitionEndHandler : function(e)
		{
			console.log(e);
			// this.$jqo.hide();

			// add a document class to handle this stuff

			if(e.target.offsetTop < 0)
			{
				this.$jqo.css('visibility', 'hidden');
				$('html').removeClass('loading');
				this.hidden = true;
			}
			else
			{

			}

			this.$jqo.removeClass('animate');
		},

		resizeHandler : function()
		{
			if (this.hidden)
			{
				this.hide();
			}
		},

		onNavClick : function(e)
		{
			// if it's the current page
			if ($(e.currentTarget).parent().hasClass('current-menu-item'))
			{
				this.out();
				return false;
			}

		},

		show : function()
		{
			// alert('open');
			// this.$jqo.show();
			this.hidden = false;
			this.$jqo.css('display', 'block');
			Utils.disableScrolling();
			this.$jqo.css('visibility', 'visible');
			this.$jqo.css({'top': 0});
			$(window).on("mousewheel", $.proxy(this.scrollHandler, this));
			this.$introMenu.find('li a').on('click', $.proxy(this.onNavClick, this));
			$('.scrollDownIndicator').on('click', $.proxy(this.out, this));
			this.$jqo.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", $.proxy(this.transitionEndHandler , this))
		},

		in : function()
		{
			this.$jqo.addClass('animate');
			this.show();
		},

		isVisible : function()
		{
			return !this.hidden;
		},

		out : function()
		{
			this.$jqo.addClass('animate');
			this.hide();
			return false;
		},

		hide: function()
		{
			this.hidden = true;
			this.$jqo.css({'top': ($(window).height() * -1)});
		}
	}


	$.fn.contentIntro = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('rmsjr.contentIntro');
			var options = $.extend({}, ContentIntro.DEFAULTS, $this.data(), typeof option === 'object' && option);

			if (!data) {
				$this.data('rmsjr.contentIntro', (data = new ContentIntro(this, options)));
			}

			if (typeof option === 'string')
			{

				if (option === 'isVisible')
				{
					alert('test' + data.isVisible());
					return data.isVisible();
				}
				else
				{
					data[option]();
				}
			} else if (options.show) {
				data.show();
			}

		});
	};

	$.fn.contentIntro.Constructor = ContentIntro;

	return ContentIntro;

});