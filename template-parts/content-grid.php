<?php
global $data;
global $fields;
?>
<?php if($data): ?>
	<ul class="grid">
		<li class="grid-sizer"></li>
		<?php foreach($data as $post) : ?>
			<?php
				setup_postdata($post);
				$useFancybox = false;
				$fields['listImage'] = CFS()->get('list_image',$post->ID);
				$fields['listSize'] = CFS()->get('list_image_size',$post->ID);
				$fields['galleryImages']  = CFS()->get( 'gallery_images' );
				$fields['showOverlay'] = CFS()->get( 'show_overlay' );
				$postFormat = get_post_format($post->ID);
				$itemLink = get_the_permalink();
				$termString = "";

				if (get_post_format($post->ID) == "gallery")
				{
					$relVal = $post->post_name . "-gallery";
				}

				if ($useFancybox)
				{
					$linkClass = 'fancybox';

					if ($postFormat != '')
					{
						$linkClass .= '-'.$postFormat;
					}
				}

				if (!empty($fields['listSize']))
				{
					foreach ($fields['listSize'] as $key => $value)
					{
						$listImageSizeKey = $key;
					}
				}
				else
				{
					$listImageSize = 2;
				}


				$itemClass = "item" . ' item-width' . $listImageSizeKey;

				if (empty($fields['listImage']))
				{
					$itemClass .= " no-image";
				}
				

				if ($fields['showOverlay'] == 1)
				{
					$itemClass .= ' showOverlay';
				}

				$terms = $post->post_type == 'projects' ? get_the_terms( $post, 'project_categories' ) : get_the_terms( $post, 'category' );

				if ( $terms && ! is_wp_error( $terms ) ) : 

				$projectCategories = array();

				foreach ( $terms as $term ) {
					if($term->term_id != 19)
					{
						$projectCategories[] = $term->name;
					}
					$termString .= $term->term_id . " ";
				}

				$project_categories_string = join( ", ", $projectCategories );

				endif;
			?>

			<?php if($listImageSizeKey == 5) :?>
				<li class="<?= $itemClass ?> item-fs" style="background-image:url(http://rmsjr/templates/test-background.png);">
						<div class="itemHeader">
						<div style="width:75px; height:80px; position:absolute; top:20px; background-color:#00bfff; color:#000;">DEC 21</div>
						<p style="margin-left:100px;">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p></div>
				</li>

				<!-- 
				<li class="<?= $itemClass ?> item-fs" style="background-image:url(http://rmsjr/templates/test-background.png);">
						<div class="itemHeader">
						<div style="width:75px; height:80px; position:absolute; top:20px; background-color:#00bfff; color:#000;">DEC 21</div>
						<p style="margin-left:100px;">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p></div>
				</li> -->

			<?php else :?>
				<li class="<?= $itemClass ?>" data-categories="<?= trim($termString) ?>">
					<div class="itemcontent">
						<a href="<?= $itemLink ?>"  data-post-format="<?= get_post_format() ?>" data-postid="<?= $post->ID ?>" data-relative-url = "<?= wp_make_link_relative( $itemLink )?>" data-background-color="<?php echo CFS()->get('background_color',$post->ID); ?>">
							<div class="overlay">
								<header class="grid-item-header">



									<h2><?= $post->post_title ?></h2>
									<?php if($post->post_type == 'post'): ?>
										<span class="date"><?php the_time('m/d/y') ?></span>
									<?php endif; ?>
									<?php if(!empty($project_categories_string)) : ?>
										<?php printf( '<span>%s</span>', esc_html( $project_categories_string ) ); ?>
									<?php endif; ?>



									<?php if(CFS()->get( 'show_overlay' ) == 1) : ?>
										<?php the_excerpt() ?>
									<?php endif; ?>
								</header>
							</div>

						<?php if(!empty($fields['galleryImages']) && $useFancybox == true):?>
							<?php foreach ( $fields['galleryImages'] as $key => $field ) : ?>
								<?php if($key == 0):?>
									<a href="<?= $field['gallery_image']; ?>" class="<?= $linkClass ?>" rel="<?= $relVal ?>" data-post-format="<?= get_post_format() ?>" data-postid="<?= $post->ID ?>"><img src="<?= $fields['listImage'] ?>" /></a>
								<?php else: ?>
									<a href="<?= $field['gallery_image']; ?>" rel="><?= $relVal ?>" title="<?= $field['gallery_image_caption']; ?>"></a>
								<?php endif; ?>
							<?php endforeach; ?>
						<?php else : ?>
							<?php if (!empty($fields['listImage'])) : ?>
								<img class="list-image" src="<?= $fields['listImage'] ?>"/>
							<?php endif; ?>
						<?php endif; ?>
						</a> 
					</div>
				</li>
			<?php endif; ?>
		<?php endforeach; ?>
	</ul>
<?php else : ?>
	<article class="pad-left pad-right">
		<p class="content-notification"><?php _e('There are no projects at this time', 'overit'); ?></p>
	</article>
<?php endif ?>