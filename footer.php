<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
?>

		</div><!-- .site-content -->

		<footer id="colophon" class="site-footer" role="contentinfo">

			<?php if ( has_nav_menu( 'social' ) ) : ?>
				<nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Footer Social Links Menu', 'rmsjr' ); ?>">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'social',
							'menu_class'     => 'social-links-menu',
							'depth'          => 1,
							'link_before'    => '<span class="screen-reader-text">',
							'link_after'     => '</span>',
						) );
					?>
				</nav><!-- .social-navigation -->
			<?php endif; ?>
		</footer><!-- .site-footer -->
</div>

<div class="modal fade content-modal" id="projectModal"tabindex="-1" role="dialog">
	<div class="vertical-alignment-helper">
        <div class="modal-dialog vertical-align-center modal-fs">

		  	   <!-- <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4 class="modal-title">Modal title</h4>
		      </div> -->
		    <div class="modal-content">
		      <div class="modal-body">
		        <p>One fine body&hellip;</p>
		      </div>
		    </div><!-- /.modal-content -->
		  </div><!-- /.modal-dialog -->
    </div>
</div><!-- /.modal -->

<?php wp_footer(); ?>
</body>
</html>
