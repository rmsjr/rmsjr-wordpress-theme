<?php global $post ?>


<div class="project-details">

<?php if($post->post_type == 'projects') :?>
	<h1><?= the_title() ?></h1>
	<p><?= the_excerpt() ?></p>
	<h3><?php echo __('Software Used', 'rmsjr') ?></h3>
	<?php rmsjr_list_post_terms_with_images('software_used', $post->ID) ?>
<?php elseif($post->post_type == 'post') :?>

	<h1><?= the_title() ?></h1>
	<dl>
		<dd>Author: <?php  the_author();?></dd>
		<dd>Posted on: <?php the_time('l, F jS, Y') ?></dd>
	</dl>
<?php endif; ?>
</div>