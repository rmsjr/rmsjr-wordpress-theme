<?php
global $data;
global $fields;
$custom_query = rmsjr_custom_query("post", -1);
$data = $custom_query->posts;
$fields = array(
	'listImage' => '',
	'listImageSize' => '',
	'galleryImages' => '',
	'showOverlay' => 0
);
?>

<?php get_template_part('template-parts/content', 'grid'); ?>