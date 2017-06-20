define(['jquery', 'content-intro', 'utils', 'primary-menu'], function ($, ContentIntro, Utils, PrimaryMenu) {

	var pageScripts = 
	{
		home: function()
		{

		},

		projects: function()
		{
			if (Utils.storage)
			{

				if(Utils.storage.introSeen === undefined)
				{
					$('.intro').contentIntro('show');
					Utils.storage.setItem('introSeen', true);
				}
			}
			else
			{
				$('.intro').contentIntro('show');
			}
		},

		projectSingle:function()
		{
			//alert('single project');
			var projectDetails = $('.project-details');

			PrimaryMenu.setDetailsContent(projectDetails.html());
			$('.project-details').remove();
			PrimaryMenu.displayInfoIcon();
		}
	};

	return pageScripts;

});