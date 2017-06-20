<?php
get_header();

	/*
	 * Include the post format-specific template for the content. If you want to
	 * use this in a child theme, then include a file called called content-___.php
	 * (where ___ is the post format) and that will be used instead.
	 */
	while ( have_posts() ) : the_post();

	 echo('SINGLE!');
		get_template_part( 'template-parts/content', get_post_format());

	// End of the loop.
	endwhile;

get_footer();
?>