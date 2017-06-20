define(['jquery', 'tinycolor'], function ($, TinyColor){

var utils = 
{
		isScrollPossible : function()
		{
			return $('.all').height() > $(window).height();
		},

		removeElements : function(text, selector)
		{
			var wrapped = $("<div>" + text + "</div>");
			wrapped.find(selector).remove();
			return wrapped.html();
		},

		disableScrolling: function()
		{
			$('html').addClass('loading');
		},

		setColorTheme : function(backgroundColor)
		{
			backgroundColorBrightness = TinyColor(backgroundColor).getBrightness();
			this.removeColorTheme();

			if (backgroundColorBrightness >= 128)
			{
				$('html').addClass('theme-light');
			}
			else
			{
				$('html').addClass('theme-dark');
			}
		},

		removeColorTheme: function ()
		{
			 $("html").removeClass("theme-dark theme-light")
		},

		getCookie: function() {
		  var value = "; " + document.cookie;
		  var parts = value.split("; " + name + "=");
		  if (parts.length == 2) return parts.pop().split(";").shift();
		}, 

		storage : (function() 
		{
			var uid = new Date;
			var storage;
			var result;
			try {
				(storage = window.sessionStorage).setItem(uid, uid);
				result = storage.getItem(uid) == uid;
				storage.removeItem(uid);
				return result && storage;
			} catch (exception) {}
		}())
}

return utils;

});