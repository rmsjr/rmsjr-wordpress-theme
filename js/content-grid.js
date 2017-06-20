define(['jquery', 'masonry', 'imagesLoaded'], function ($, Masonry, ImagesLoaded) {

	var contentGrid = {

		itemSelector: $('.item a'),
		useFancybox: false,
		windowWidth: $(window).width(),
		windowHeight: $(window).height(),
		scrollPosition: 0,
		fsItemWidth:0,
		gutterWidth:0,


		init: function()
		{
			this.itemSelector.on('click', this.onItemClick)

			if(this.useFancybox)
			{
				$(".fancybox-gallery").fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
					padding:0,
				});

				$(".fancybox").fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
					width: "100%",
					height: "100%",
					padding:0,
				});
			}

			if ($('.item-fs:eq(0)').length)
			{
				this.gutterWidth = $('.item-fs:eq(0)').css('margin-top').replace(/[^-\d\.]/g, '') * 4;
				$('.item-fs').css({"height": this.windowHeight - (this.gutterWidth)});
				this.fsItemWidth =  $('.item-fs:eq(0)').width();
			}


			$(window).on("resize", this.resizeHandler);
			$(window).on("scroll", this.scrollHandler);
			// $(document).on("load", this.loadHandler);

			contentGrid.anchorHeader();
			var grid = document.querySelector('.grid');
			var msnry = new Masonry( '.grid', {
			  columnWidth: '.grid-sizer',
			  itemSelector: '.item',
			});

			ImagesLoaded( grid ).on( 'progress', function() {
			// layout Masonry after each image loads
				msnry.layout();
			});

			ImagesLoaded( grid ).on( 'done', function() {
				alert('done');
				$(document).trigger('gridLoaded');
			}); 

		},

		isScrollPossible : function()
		{
			return $('.all').height() > $(window).height();
		},

		getLength:function()
		{
			return $('.grid').length;
		},

		loadHandler: function(e)
		{


		},

		resizeHandler : function(e)
		{
			contentGrid.fsItemWidth = $('.grid').width() - (contentGrid.gutterWidth * .5);

			console.log('grid-width');
			console.log($('.grid').width()- contentGrid.gutterWidth);

			if($('.item-fs').length)
			{
				$('.item-fs').css({"height": $(window).height() - (contentGrid.gutterWidth)});
			}

			contentGrid.windowWidth = $(window).width();
			contentGrid.windowHeight = $(window).height();
			contentGrid.anchorHeader();
		},

		scrollHandler : function(e)
		{
			if ($(window).scrollTop() > 0)
			{
				scrollPosition = $(window).scrollTop();
			}
			contentGrid.anchorHeader();
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
				$(".item-fs").each( function()
				{
					$(this).height($(window).height() - (contentGrid.gutterWidth + topHeaderHeight))
					var $header = $(this).find(".itemHeader");

					headerParentPostion = $(this).offset().top - $(window).scrollTop();
					headerParentBottomOffset = headerParentPostion + $(this).height() - topHeaderHeight;

					// console.log(headerParentPostion);

					$(this).width(contentGrid.fsItemWidth)

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
				$(itemImage).css('max-height', windowHeight);

				$(itemImage).css({'margin-top': (windowHeight - itemImage[0].height) * .5 });

				if(typeof callback === 'function')
				{
					callback();
				}
				
			}, 0)
		},

		openProjectModal: function(html, linkObj)
		{

			if (contentGrid.isScrollPossible())
			{
				$('.all').css('padding-right', 15);
			}

			var relativeUrl = linkObj.data("relative-url");
			var postFormat = linkObj.data("post-format");
			var url = linkObj.attr('href');
			var stateObj = { foo: "bar" };
			var projectModal = $('#projectModal');
			var modalHidden = false;
			var popstate = false;
			var projectCategories = linkObj.data("project-categories").split(" ");

			console.log("test" + projectCategories);

			projectModal.find('.modal-body').html(html);
			projectModal.addClass(postFormat);
			projectModal.modal();


			// TODO: extend modal or create modal wrapper
			projectModal.on('show.bs.modal', function(e)
			{
				console.log('show');
				var modal = this;
				var stateObj = { foo: "bar" };
				history.pushState(stateObj, "page 2", relativeUrl);

				// $('html').css('overflow', 'hidden');

				if (postFormat == 'gallery')
				{
					var projectCarousel = $('#carousel-project');
					var item = $('.carousel .item:eq(0)');
					var itemImage = item.find('.itemImage');

					projectModal.css('overflow', 'hidden');
					projectCarousel.carousel();
					item.css('visibility', 'hidden');

					$('.carousel .item').each( function()
					{
						var carouselItem = $(this);
						$(window).on('resize', function()
						{
							contentGrid.resizeCarouselImageToFit(carouselItem);
						})
					});

					projectCarousel.on('slide.bs.carousel', function(e)
					{
						contentGrid.resizeCarouselImageToFit($(e.relatedTarget));
					})
				}

				projectModal.on('shown.bs.modal', function(e)
				{
					$('.more').css('display', 'block');

					if (postFormat == 'gallery')
					{
						contentGrid.resizeCarouselImageToFit(item, function()
						{
							item.css('visibility', 'visible');
						});
					}
					projectModal.off('shown.bs.modal');
				})

				projectModal.off('show.bs.modal');
			})



			window.onpopstate = function()
			{
				if (!modalHidden)
				{
					popstate = true;
					projectModal.modal('hide');
				}
			}
			

			$('.more').on('click', function(e)
			{
				projectModal.modal('hide');
				return false;
			})


			projectModal.on('hide.bs.modal', function(e)
			{
				if (!modalHidden)
				{
					if (!popstate)
					{
						window.history.go(-1);
					}
					modalHidden = true;

				}
				else
				{
					return false;
				}

				$('.more').hide().off('click');
				projectModal.off('hide.bs.modal');
			});

			projectModal.on('hidden.bs.modal', function(e)
			{
				// $('html').css('overflow', 'auto');

				if (postFormat == 'gallery')
				{
					projectModal.css('overflow', 'auto');
				}

				projectModal.removeClass(postFormat);
				popstate = false;

				projectModal.off('hide');
				projectModal.off('hidden.bs.modal');
				$('.all').css('padding-right', 0);
				//projectModal.off('show');
				//projectModal.off('shown');
			});

			projectModal.modal('show');

		},

		onItemClick: function(e)
		{
			var linkObj = $(this);
			var post_id = linkObj.data("postid");

			$('.loadingDisplay').addClass('loaderOnly')
			$('.loadingDisplay').css({'opacity': 1, 'display': 'block'});

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
						contentGrid.openProjectModal(response, linkObj);
						$('.loadingDisplay').css({'opacity': 0});
					}
					else
					{
						alert("fail");
					}
				}
			})
			return false;
		}
	};

	return contentGrid;
});