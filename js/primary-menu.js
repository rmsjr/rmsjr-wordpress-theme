define(['jquery', 'page'], function ($, Page) {

	var primaryMenu = {

		menuSelector: $('.siteHeader'),
		menuButtonSelector: $('.menuButton'),
		$menuButtonIcon : $('.menuButton .button-icon'),
		$details : $('.details-container', this.menuSelector),
		$nav : $('.nav-container', this.menuSelector),
		$navMenu : $('.primary-menu', this.menuSelector),
		$navMenuItems : $('.primary-menu li ', this.menuSelector),
		$navMenuCategoryLinks : $('.menu-item-type-taxonomy a'),
		$navMenuPageLinks : $('#menu-primary > .menu-item:not(.current-menu-item) > a'),
		$loadingDisplay : $('.loadingDisplay'),


		init: function()
		{
			// METHOD 1
			this.menuButtonSelector.on('click', $.proxy(this.onClickEnter, this));
			this.$navMenuCategoryLinks.on('click', $.proxy(this.onCategoryClick, this));

			// TODO:: FINISH AJAX PAGE LOADING
			// this.$navMenuPageLinks.on('click', $.proxy(this.onPageClick, this))


				// make the current page first in the list
				this.$navMenuItems.each(function()
				{
					if($(this).hasClass('current-menu-item'))
					{
						$(this).detach().insertBefore('.primary-menu li:first');
					}
				})

		},

		onCategoryClick: function(e)
		{
			$(document).trigger('categorySelect', [parseInt($(e.currentTarget).data('object-id'))]);
			this.$navMenuCategoryLinks.removeClass('active');
			$(e.currentTarget).addClass('active');
			this.close();
			return false;
		},

		onPageClick : function(e)
		{
			var linkObj = $(e.currentTarget);
			var post_id = linkObj.data("object-id");
			var _self = this;

			this.$loadingDisplay.addClass('loaderOnly')
			this.$loadingDisplay.css({'opacity': 1, 'display': 'block'});

			// TODO create ajax Wrapper
			jQuery.ajax(
			{
				type : "post",
				dataType : "html",
				url : themeData.ajax_url,
				data : { action: "load_page", post_id : post_id },
				success: function(response) 
				{
					if (response)
					{
						// _self.close();
						Page.load(post_id, response);
						_self.setActiveMenuItem(e.currentTarget);
						_self.$loadingDisplay.css({'opacity': 0});
					}
					else
					{
						alert("fail");
					}
				}
			})
			return false;
		},


		onClickEnter: function()
		{
			// "expanded" increases the width of the side menu
			this.open();
		},

		onClickExit: function()
		{
			// $('.content').css({'left': 0})
			this.close();
		},

		hideMenuButton : function()
		{
			this.menuButtonSelector.hide();
		},


		displayInfoIcon: function()
		{
			this.menuButtonSelector.show();
			this.$menuButtonIcon.addClass('fa-ellipsis-h');
		},

		displayMenuIcon : function()
		{
			this.menuButtonSelector.show();
			this.$menuButtonIcon.removeClass('fa-ellipsis-h');
		},


		close: function(callback)
		{
			this.menuSelector.removeClass('expanded');
			$('.menu-item a span').addClass('hidden');
			$('html').removeClass('nav-expanded');
			// $('.content, .content-modal').css('left',0)

			if (typeof callback === 'function')
			{
				callback();
			}

			this.menuButtonSelector.off('click');
			this.menuButtonSelector.on('click', $.proxy(this.onClickEnter, this));
		},

		open: function()
		{
			this.menuSelector.addClass('expanded');
			$('html').addClass('nav-expanded');
			$('.menu-item a span').removeClass('hidden');
			// $('.content, .content-modal').css('left',this.menuSelector.width())
			this.menuButtonSelector.off('click');
			this.menuButtonSelector.on('click', $.proxy(this.onClickExit, this));
		},

		displayDetailsContent: function(html)
		{
			this.$nav.hide();
			this.$details.show();
		},

		displayNavigationContent: function()
		{
			this.$details.hide();
			this.$nav.show();
		},

		hideNavigationContent: function()
		{

		},

		hideDetailsContent: function()
		{

		},

		setActiveMenuItem : function()
		{
			this.$navMenuItems.each(function()
			{
				$(this).removeClass('current-menu-item current_page_item');
			})
		},

		setDetailsContent: function(html)
		{
			this.$details.html(html);
			this.displayDetailsContent()
		}
	};

	return primaryMenu;
});




// METHOD 2
// var mouseenterHandler = this.onMouseEnter(thisObj);
// var mouseleaveHandler = this.onMouseLeave(thisObj);
//this.menuSelector.on('mouseenter', mouseenterHandler);
//this.menuSelector.on('mouseleave', mouseleaveHandler);

/* METHOD 2
onMouseEnter: function(thisObj)
{
	return function(e)
	{
		console.log(thisObj.expandedWidth);
		$(this).css('width', thisObj.expandedWidth);
	}
},

onMouseLeave: function(thisObj)
{
	return function(e)
	{
		console.log('mouseleave');
		$(this).css('width', thisObj.baseWidth);
	}
}
*/