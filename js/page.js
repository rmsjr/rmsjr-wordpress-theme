define(['jquery'], function ($){

	var page = {

		$contentContainer : $('.content'),

		load : function(page_id, html)
		{
			this.$contentContainer.html(html);
			$(document).trigger('pageLoaded', [parseInt(page_id)]);
			alert('testing herer');
		}

	}

	return page;

});
