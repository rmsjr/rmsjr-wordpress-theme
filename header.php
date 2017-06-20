<?php
/**
 * The template for displaying the header
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js loading" style="background-color: <?php echo CFS()->get('background_color',$post->ID); ?>">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php endif; ?>
	<?php wp_head(); ?>test
</head>

<body <?php body_class(); ?>>

<div class="all">


<div class="intro">
	<i class="fa fa-long-arrow-down" aria-hidden="true"></i>
	<a href="" style="position:absolute; width:100%; bottom:0; display:block; text-align:center; padding:20px;" class="scrollDownIndicator"><i class="fa fa-angle-down" aria-hidden="true" style="color:fff; font-size:48px; color:#fff; display:inline-block"></i></a>
	<div class="vertical-alignment-helper">
		<div class="intro-content vertical-align-center">
			<i class="pack-rmsjr icon-rmsjr-logo-black"></i>
			<h1><?php echo get_option('name'); ?></h1>
			<h2><?php echo get_option('blogdescription'); ?></h2>
			<ul class="social-links">
				<li><a href="<?php echo get_option('facebook-url') ?>"><i class="fa fa-facebook-official" aria-hidden="true"></i></a></li>
				<li><a href="<?php echo get_option('twitter-url') ?>"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
			</ul>
			<?php if ( has_nav_menu( 'primary' ) ) : ?>
						<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
						<?php
							wp_nav_menu( array(
								'theme_location' => 'intro',
								'menu_class'     => 'intro-menu',
							 ) );
						?>
						</nav><!-- .main-navigation -->
			<?php endif; ?>
		</div>
	</div>
</div>


<div class="siteUtilites">
	<div class="loadingDisplay">
			<!--
			<div class="loader">
				<svg class="circular" viewBox="25 25 50 50">
					<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
				</svg>
			</div>
			-->
		<div class="spinner">
			<div class="bounce1"></div>
			<div class="bounce2"></div>
			<div class="bounce3"></div>
		</div>
	</div>
	<div class="topLogo"><a href="#intro" style="background-color:#ff0000"><i class="pack-rmsjr icon-rmsjr-logo-black"></i><span>Rob Sandy</span></a></div>
	<a class ="menuButton"><i class="fa fa-bars button-icon"></i></a>
	<a href="" class="more header-button"><i class="fa fa-times button-icon"></i></a>
</div>

<header class="topHeader contentHeader">
	<div class="background"></div>
</header>

<aside class="siteHeader" style="overflow:hidden;">
	<div class="vertical-alignment-helper">
		<div class="vertical-align-center">
			<div class="nav-container">
				<?php if ( has_nav_menu( 'primary' ) ) : ?>
				<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
				<?php

					$walker = new Menu_With_Description;
					wp_nav_menu( array(
						'theme_location' => 'primary',
						'menu_class'     => 'primary-menu',
						'walker' => $walker
					 ) );
				?>
				</nav><!-- .main-navigation -->
				<?php endif; ?>
			</div>
			<div class="details-container">
			</div>
		</div>
	</div>

<!-- reverse coloring -->
	<header class="topHeader" style="position:absolute">
		<div class="topLogo"><a href="" style="background-color:#ff0000"><i class="pack-rmsjr icon-rmsjr-logo-black"></i><span>Rob Sandy / <?php echo the_title() ?></span></a></div>
		<div class="background"></div>
	</header>
</aside>

<?php global $post ?>
<div class="content" id="<?= $post->post_name ?>">