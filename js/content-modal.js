define(['jquery', 'utils', 'primary-menu', 'tinycolor', 'vimeoPlayer'], function ($, Utils, PrimaryMenu, TinyColor, Vimeo){

	var contentModal =
	{
		projectModal : $('#projectModal'),
		postFormat : '',
		modalHidden : false,
		popstate : false,
		scrollPossible : false,
		vimeoPlayer:null,
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

		open:function(html, linkObj)
		{
			if (Utils.isScrollPossible())
			{
				$('.all').css('padding-right', 15);
			}


			var _self = this;
			var relativeUrl = linkObj.data("relative-url");
			var url = linkObj.attr('href');
			var stateObj = { foo: "bar" };
			var backgroundColorString = linkObj.data("background-color") != "" ? linkObj.data("background-color") : '';
			var backgroundColor = TinyColor(backgroundColorString);
			backgroundColor.setAlpha(1);

			// TODO: DUPE
			var projectModal = _self.projectModal;

			var projectDetails = $('.project-details', html);
			var finalHtml = Utils.removeElements(html, '.project-details');
			_self.postFormat = linkObj.data("post-format");
			_self.modalHidden = false;

			linkObj.data("url", linkObj.attr('href'));
			projectModal.find('.modal-body').html(finalHtml);
			projectModal.remove('.project-details');
			projectModal.addClass(_self.postFormat);

			PrimaryMenu.close();

			if(_self.postFormat == 'video')
			{
				// intialize vimeo video.
				// this needs to work for the static page as well.
				var iframe = document.querySelector('#project-video');
				_self.vimeoPlayer = new Vimeo(iframe);
			}


			// TODO: extend modal or create modal wrapper
			projectModal.on('show.bs.modal', function(e)
			{
				console.log('show');
				var modal = this;
				var stateObj = { foo: "bar" };
				history.pushState(stateObj, "page 2", relativeUrl);

				PrimaryMenu.setDetailsContent(projectDetails.html());
				PrimaryMenu.hideMenuButton();
				projectModal.removeClass('modal-video modal-article modal-gallery');


				$('.modal').css('background-color', backgroundColor.toRgbString());

				Utils.setColorTheme(backgroundColorString);

				//TODO:
				// $('html').css('overflow', 'hidden');

				if (_self.postFormat == 'gallery')
				{
					var projectCarousel = $('#carousel-project');
					var item = $('.carousel .item:eq(0)');
					var itemImage = item.find('.itemImage');
					projectModal.addClass('modal-gallery');

					projectModal.css('overflow', 'hidden');
					projectCarousel.carousel();
					item.css('visibility', 'hidden'); 

					$('.carousel .item').each( function()
					{
						var carouselItem = $(this);
						$(window).on('resize', function()
						{
							_self.resizeCarouselImageToFit(carouselItem);
						})
					});

					projectCarousel.on('slide.bs.carousel', function(e)
					{
						_self.resizeCarouselImageToFit($(e.relatedTarget));
					})
				}
				else if(_self.postFormat == 'video')
				{
					projectModal.addClass('modal-video');
					// $('.videoWrapper iframe').css({'height': $(window).height() - ($('.contentHeader').height() * 2), 'width': '100%'});

					// pause the active video.
					// Try and trigger this by sending an event from content-intro
					$('.topLogo').on('click', function(){

							_self.vimeoPlayer.pause();
					})

				}
				else
				{
					projectModal.addClass('modal-article');
				}

				projectModal.on('shown.bs.modal', function(e)
				{
					$('.more').css('display', 'block');

					if (_self.postFormat == 'gallery')
					{
						_self.resizeCarouselImageToFit(item, function()
						{
							item.css('visibility', 'visible');
						});
					}
					PrimaryMenu.displayInfoIcon();
					projectModal.off('shown.bs.modal');
				})

				projectModal.off('show.bs.modal');
			})

			$('.more').on('click', function(e)
			{
				_self.close(); 
				return false;
			})

			window.onpopstate = function()
			{
				if (!_self.modalHidden)
				{
					_self.popstate = true;
					_self.close(); 
				}
			}

			projectModal.modal('show', linkObj.data());

		},

		close:function()
		{
			var _self = this;
			var projectModal = _self.projectModal;
			projectModal.on('hide.bs.modal', function(e)
			{
				PrimaryMenu.hideMenuButton();
				if (!_self.modalHidden)
				{
					if (!_self.popstate)
					{
						window.history.go(-1);
					}
					_self.modalHidden = true;
				}
				else
				{
					return false;
				}

				if (_self.postFormat == 'video' && _self.vimeoPlayer != null)
				{
					_self.vimeoPlayer.pause();
				}

				$('.more').hide().off('click');
				PrimaryMenu.close(function()
				{
					PrimaryMenu.displayNavigationContent();
				});
				projectModal.off('hide.bs.modal');
			});

			projectModal.on('hidden.bs.modal', function(e)
			{
				// $('html').css('overflow', 'auto');

				if (_self.postFormat== 'gallery')
				{
					projectModal.css('overflow', 'auto');
				}

				projectModal.removeClass(_self.postFormat);
				_self.popstate = false;


				projectModal.off('hide');
				projectModal.off('hidden.bs.modal');
				$('.all').css('padding-right', 0);
				Utils.removeColorTheme();
				PrimaryMenu.displayMenuIcon();
			});

			projectModal.modal('hide');

		}

	}

	return contentModal;
});