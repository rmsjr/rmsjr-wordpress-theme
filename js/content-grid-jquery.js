define(['jquery', 'utils', 'masonry', 'imagesLoaded', 'content-modal', 'mediaModal', 'froogaloop2', ], function ($, Utils, Masonry, ImagesLoaded, ContentModal) {

	var ContentGrid = function (jqo, options)
	{
		this.options = options;
		this.$jqo = $(jqo);
		this.$itemJqo = $(this.options.itemSelector);
		this.$loadingDisplay = this.options.loadingDisplay;
		this.$itemJqo.on('click', $.proxy(this.onItemClick, this));
		this.windowWidth = $(window).width();
		this.windowHeight =  $(window).height();
		this.scrollPosition = 0;
		this.fsItemWidth = 0;
		this.gutterWidth = 0;
		this.loadedCallback = options.loadedCallback;
		this.grid = document.querySelector('.grid');
		this.msnry = undefined;


		$(window).on("resize", $.proxy(this.resizeHandler,this));
		$(window).on("scroll", $.proxy(this.scrollHandler, this));

		if ($('.list-image').length)
		{
			ImagesLoaded( this.grid ).on( 'done', $.proxy(this.loadHandler, this));
		}
		else
		{
			$(window).on('load', $.proxy(this.loadHandler, this));
		}
		
		$(document).on('categorySelect', $.proxy(this.onCategorySelect, this))
	};

	ContentGrid.DEFAULTS = {
		itemSelector : '.item a',
		loadingDisplay : $('.loadingDisplay'),
		useFancybox: false,
		loadedCallback: undefined,
		parentSelector:""
	};

	ContentGrid.prototype = {

		getLength:function()
		{
			return this.$jqo.length;
		},

		onCategorySelect: function(e, eventData)
		{
			$('.item').each(function()
			{
				var projectCategories = ($(this).data('categories')).toString().split(' ');
				var inActiveCategory = false;

				for(var i=0; i<projectCategories.length; i++)
				{
					console.log(parseInt(projectCategories[i]));
					if(parseInt(projectCategories[i]) != eventData)
					{
						inActiveCategory = false;
					}
					else
					{
						inActiveCategory = true;
						break;
					}
				}

				if(!inActiveCategory)
				{
					$(this).hide().css({'left': 0, 'top': 0})
				}
				else
				{
					$(this).show();
				}

			});

			this.msnry.layout();
		},

		loadHandler: function(e)
		{
			if( !Utils.isScrollPossible())
			{
				$('.all').css('padding-right', 0);
			}

			this.msnry = new Masonry( '.grid', {
			  columnWidth: '.grid-sizer',
			  itemSelector: '.item',
			  percentPostion: true,
			  gutter: 0,
			});



			this.anchorHeader();
			/* FULL SCREEN */
			// _self.anchorHeader();
			//$('.item-fs').height($(window).height());


			this.msnry.layout();

			if (typeof this.loadedCallback === 'function')
			{
				/* FULL SCREEN */
				 //_self.anchorHeader();


				this.loadedCallback();
			}

		},

		resizeHandler : function(e)
		{
			if($('.item-fs').length)
			{
				$('.item-fs').css({"height": $(window).height() - (this.gutterWidth)});
			}

			this.windowWidth = $(window).width();
			this.windowHeight = $(window).height();

			_self = this;

			resizeDone = setTimeout(function(){
				_self.msnry.layout();
			}, 250)
			this.anchorHeader();
		},

		scrollHandler : function(e)
		{
			if ($(window).scrollTop() > 0)
			{
				scrollPosition = $(window).scrollTop();
			}
			 this.anchorHeader();
		},

		anchorHeader: function ()
		{
			// console.log("offset left" + parentOffsetLeft)
			if ($(".item-fs").length)
			{
				var headerParentPostion = $(".itemHeader").parent().offset().top - $(window).scrollTop();
				var headerParentBottomOffset = headerParentPostion + $(".itemHeader").parent().height();
				var parentOffsetLeft = $('.item-fs').offset().left;
				var parentOffsetRight = $(window).width() - ($('.item-fs').offset().left + $('.item-fs').width());
				var topHeaderHeight = $('.topHeader').length ? $('.topHeader').outerHeight() : 0;
				var _self = this;

				/* NOT FULL SCREEN */
				this.fsItemWidth = this.$jqo.width() - (this.gutterWidth * .5);

				/* FULL SCREEN */
				// this.fsItemWidth = $(window).width();
				// this.$jqo.css('overflow', 'visible');
				// $('.content').css('overflow', 'visible');
				/* END FULL SCREEN */

				$(".item-fs").each( function()
				{

					/* FULL SCREEN */
					// $(this).css({'left': -75, 'right': 0, 'margin-left':0, 'margin-right': 0});
					// $(this).height($(window).height());
					/* END FULL SCREEN */

					/* NOT FULL SCREEN */
					$(this).height($(window).height() - (_self.gutterWidth + topHeaderHeight))

					var $header = $(this).find(".itemHeader");

					headerParentPostion = $(this).offset().top - $(window).scrollTop();
					headerParentBottomOffset = headerParentPostion + $(this).height() - topHeaderHeight;

					// console.log(headerParentPostion);

					$(this).width(_self.fsItemWidth)

					if (headerParentPostion <= topHeaderHeight & (headerParentBottomOffset - $header.outerHeight()) > 0)
					{
						//console.log("HEADER FIXED");
						$header.css({position: "fixed", top:topHeaderHeight, bottom: "auto", left:parentOffsetLeft, right:parentOffsetRight});
					}
					else
					{
						//console.log( headerParentBottomOffset - $header.outerHeight());

						if((headerParentBottomOffset - $header.outerHeight()) <= 0 && Math.abs(headerParentBottomOffset - $header.outerHeight()) <= $header.outerHeight())
						{
							$header.css({position: "absolute", bottom:0, top:"auto", left:0, right:0});
						}
						else
						{
							$header.css({position: "static", top:"auto", bottom:"auto", left:'auto', right:parentOffsetRight});
						}
					}
				}) 
			}

		},

		resizeCarouselImageToFit : function(item, callback)
		{
			var itemImage = item.find('.itemImage');
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();

			// hack that is lame but works to get the actual image size;
			// not sure if it will work online;
			// vertical center image:  (Display table / table cell breaks the animations)
			setTimeout(function ()
			{
				// alert($('.contentHeader').height());
				$(itemImage).css('max-height', windowHeight - ($('.contentHeader').height() * 2));
				$(itemImage).css({'margin-top': (windowHeight - itemImage[0].height) * .5 });

				if(typeof callback === 'function')
				{
					callback();
				}
				
			}, 0)
		},

		onItemClick : function (e)
		{
			var linkObj = $(e.currentTarget);
			var post_id = linkObj.data("postid");
			var _self = this;

			this.$loadingDisplay.addClass('loaderOnly')
			this.$loadingDisplay.css({'opacity': 1, 'display': 'block'});

			// TODO create ajax Wrapper
			jQuery.ajax(
			{
				type : "post",
				dataType : "html",
				url : themeData.ajax_url,
				data : { action: "open_grid_content", post_id : post_id },
				success: function(response) 
				{
					if (response)
					{
						ContentModal.open(response, linkObj);
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

	}

	$.fn.contentGrid = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('rmsjr.contentGrid');
			var options = $.extend({}, ContentGrid.DEFAULTS, $this.data(), typeof option === 'object' && option);

			if (!data) {
				$this.data('rmsjr.contentGrid', (data = new ContentGrid(this, options)));
			}

			if (typeof option === 'string') {
				data[option]();
			} else if (options.show) {
				data.show();
			}

		});
	};

	$.fn.contentGrid.Constructor = ContentGrid;

	return ContentGrid;
});