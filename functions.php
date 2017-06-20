<?php
/**
 * rmsjr Theme
 */
if ( ! function_exists( 'rmsjr_setup' ) ) :

	function rmsjr_setup()
	{
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 */
		load_theme_textdomain( 'rmsjr', get_template_directory() . '/rmsjr' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		// This theme uses wp_nav_menu() in two locations.
		register_nav_menus( array(
			'primary' => __( 'Primary Menu', 'rmsjr' ),
			'intro' => __( 'Intro Menu', 'rmsjr' ),
		) );

			/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
		 */
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'post-formats', array( 'image', 'gallery', 'video' ) );
		add_image_size( 'taxonomy-thumb', 50 );
		set_post_thumbnail_size( 1200, 9999 );
	}


endif;



if (!function_exists('bootstrapBasicEnqueueScripts')) {
	/**
	 * Enqueue scripts & styles
	 */
	function rmsjrEnqueueScripts() 
	{
		wp_enqueue_script('modernizr-script', get_template_directory_uri() . '/js/vendor/modernizr.min.js');
		wp_enqueue_script('requirejs', get_template_directory_uri() . '/js/vendor/require.js');
		wp_enqueue_script('main-script', get_template_directory_uri() . '/js/main.js', array("requirejs"), false, false);
		wp_localize_script( 'main-script', 'themeData', array('ajax_url' => admin_url( 'admin-ajax.php' ), 'template_url' => get_template_directory_uri()));
		wp_enqueue_style('fancybox-style', get_template_directory_uri() . '/js/vendor/fancybox/jquery.fancybox.css');
		wp_enqueue_style('rmsjr-style', get_template_directory_uri() . '/css/main.css');
    	wp_enqueue_style( 'dashicons' );
	}
}

/**
*
*
* rmsjr_custom_query
*
* Used to generate a custom query object for pulling posts with custom post types on.
* Used in the content widget files primarily to handle the resrouces section.
* @param (string) postType : Post type to retreive
* @param (string) postsPerPage : Post type to retreive
* @return (object) : returns the wp_query object
*
*
*/
if(!function_exists('rmsjr_custom_query')) :
	function rmsjr_custom_query($postType, $postsPerPage = 5) {

		global $wp_query;
		global $post;

		$page = get_query_var('paged');

		// get taxonomy data
		if(is_tax()) {

			global $wp_query;

			// get info about the queried term.
			$term = $wp_query->queried_object;

			//get_query_var()
			$custom_query = om_get_custom_content($postType, array(
				'posts_per_page' => $postsPerPage,
				'paged' => $page,
				'tax_query' => array(
					array(
						'taxonomy' => $term->taxonomy,
						'field' => 'slug',
						'terms' => $term->slug
					)
				)
			), 'query');

		} else if(is_search()) {

		// if search term, get content using search query string
			$custom_query = rmsjr_get_custom_content($postType, array(
				'posts_per_page' => $postsPerPage,
				'paged' => $page,
				's' => $_GET['s']
			), 'query');

		} else {

			if(!$queriedTerm) {
				$custom_query = rmsjr_get_custom_content($postType, 
					array(
						'posts_per_page' => $postsPerPage,
						'paged' => $page
					) , 'query');

			} else {
				$custom_query = rmsjr_get_custom_content($postType, 
					array(
						'posts_per_page' => $postsPerPage,
						'paged' => $page,
						'tax_query' => array(
							array(
								'taxonomy' => $assocTaxonomy,
								'field' => 'slug',
								'terms' => $queriedTerm
							)
						)
					) , 'query');
			}
		}

		return $custom_query;
	}
endif;

/**
*
*
* rmsjr_get_custom_content
*
* similar to 'om_custom_query' but serves simply as a wrapper for get_posts.
* Used in the content widget files (wdigets/content-[]) to setup custom "loops"
* This is used when get_posts can be used to retrive content
* 
* @param (string) postType : Post type to retreive
* @param (array) customArgs: Argument list to supply get posts
* @param (array) return: specify the type of return data you want (data or query)
* @return (object) : returns either the  wp_query object or post Data
*
*
*/
if(!function_exists('rmsjr_get_custom_content')) :
	function rmsjr_get_custom_content ($postType, $customArgs = array(), $return = 'data') {

		global $wp_query;

		$args = array(
			'numberposts' => 10,
			'offset' => 0,
			'category' => '',
			'orderby' => 'post_date',
			'post_type' => $postType,
			'posts_per_page' => 5
		);

		if(!empty($customArgs)) {
			$finalArgs = array_merge($args, $customArgs);
		} else {
			$finalArgs = $args;
		}

		if($return == 'data') {
			$data = get_posts($finalArgs);
			return $data;
		} else if($return == 'query') {
			$query = new WP_Query( $finalArgs );
			return $query;
		} else {
			return false;
		}

	}
endif;


function rmsjr_list_post_terms_with_images($taxonomy, $post_id)
{
	$args = array(
		'having_images' => true,
		'post_id'       => $post_id,
		'taxonomy'      => $taxonomy,
	);

	$terms = apply_filters( 'taxonomy-images-get-the-terms', '', $args );

	echo '<ul class="terms-list">';
	foreach ($terms as $key => $term)
	{
		$image_url = wp_get_attachment_image_url( $term->image_id, 'taxonomy-thumb', true);
		echo '<li style="background-image:url(' . $image_url .')"><span>' . $term->name . '</span></li>';
	}
	echo '</ul>';
}


function rmsjr_open_grid_content()
{
	global $post;

	// Handle request then generate response using WP_Ajax_Response
	$post_id = $_REQUEST['post_id'];
	$post = get_post($post_id);
	$fields = CFS()->get( 'gallery_images', $post_id);
	$postFormat = get_post_format($post_id);
	setup_postdata($post);

	// get post format

	switch($postFormat)
	{
		case "gallery":
		{
			get_template_part('template-parts/content', 'gallery');
			break;
		}
		case "video":
		{
			get_template_part('template-parts/content', 'video');
			break;
		}
		default :
		{
			get_template_part('template-parts/content', 'project-single');
			break;
		}
	}

	die();
}


function rmsjr_load_page()
{
	global $post;

	// Handle request then generate response using WP_Ajax_Response
	$page_id = $_REQUEST['post_id'];
	$post = get_post($page_id);
	setup_postdata($post);

	// get post format
	get_template_part('template-parts/content');

	die();
}



/**
 * Override hidden label class
 *
 * @param  string $class Hidden label class.
 * @return string
 */
function my_menu_icons_hidden_label_class( $class ) {
    $class = 'hidden';

    return $class;
}


class Menu_With_Description extends Walker_Nav_Menu {
	function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {
		global $wp_query;
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$class_names = $value = '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) );
		$class_names = ' class="' . esc_attr( $class_names ) . '"';

		$output .= $indent . '<li id="menu-item-'. $item->ID . '"' . $value . $class_names .'>';

		$attributes = ! empty( $item->attr_title ) ? ' title="' . esc_attr( $item->attr_title ) .'"' : '';
		$attributes .= ! empty( $item->target ) ? ' target="' . esc_attr( $item->target ) .'"' : '';
		$attributes .= ! empty( $item->xfn ) ? ' rel="' . esc_attr( $item->xfn ) .'"' : '';
		$attributes .= ! empty( $item->url ) ? ' href="' . esc_attr( $item->url ) .'"' : '';
		$attributes .= ' data-object-id="' . esc_attr( $item->object_id ) .'"';


		$item_output = $args->before;
		$item_output .= '<a'. $attributes .'>';
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= '</a>';

		if ($depth == 0 && $item->description != '')
		{
			$item_output .= '<p class="menu-item-description">' . $item->description . '</p>';
		}

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}

// Publishes projects to the "all" category automatically
function add_project_category_automatically($post_ID) {
	global $wpdb;
	if(!has_term('','project_categories',$post_ID)){
		$cat = array(19);
		wp_set_object_terms($post_ID, $cat, 'project_categories');
	}
}


 // ------------------------------------------------------------------
 // Add all your sections, fields and settings during admin_init
 // ------------------------------------------------------------------
 //
 
 function eg_settings_api_init() {
 	// Add the section to reading settings so we can add our
 	// fields to it
 	add_settings_section('custom-settings',
		'Custom settings',
		'eg_setting_section_callback_function',
		'general');
 	
 	// Add the field with the names and function to use for our new
 	// settings, put it in our new section
 	add_settings_field('contact-phone',
		'Contact Phone Number',
		'eg_setting_callback_function',
		'general',
		'custom-settings');
	add_settings_field('company-name',
		'Company Name',
		'companyname_callback_function',
		'general',
		'custom-settings');
	add_settings_field('company-street',
		'Company Street',
		'companystreet_callback_function',
		'general',
		'custom-settings');
	add_settings_field('company-city',
		'Company City',
		'companycity_callback_function',
		'general',
		'custom-settings');
	add_settings_field('company-state',
		'Company State',
		'companystate_callback_function',
		'general',
		'custom-settings');
	add_settings_field('company-zip',
		'Company Zip',
		'companyzip_callback_function',
		'general',
		'custom-settings');
	
	add_settings_field('facebook',
		'Facebook URL',
		'facebook_callback_function',
		'general',
		'custom-settings');
		
	add_settings_field('twitter',
		'Twitter URL',
		'twitter_callback_function',
		'general',
		'custom-settings');
			
	add_settings_field('vimeo',
		'Vimeo URL',
		'vimeo_callback_function',
		'general',
		'custom-settings');

	add_settings_field('name',
		'Name',
		'name_callback_function',
		'general',
		'custom-settings');

	add_settings_field('email',
		'Email',
		'email_callback_function',
		'general',
		'custom-settings');

 	// Register our setting so that $_POST handling is done for us and
 	// our callback function just has to echo the <input>
 	register_setting('general','contact-phone');
	register_setting('general','company-name');
	register_setting('general','company-street');
	register_setting('general','company-city');
	register_setting('general','company-state');
	register_setting('general','company-zip');
	register_setting('general','facebook-url');
	register_setting('general','twitter-url');
	register_setting('general','vimeo-url');
	register_setting('general','name');
	register_setting('general','email');
 }// eg_settings_api_init()
 

 
  
 // ------------------------------------------------------------------
 // Settings section callback function
 // ------------------------------------------------------------------
 //
 // This function is needed if we added a new section. This function 
 // will be run at the start of our section
 //
 
 function eg_setting_section_callback_function() {
 	echo '<p>Additional website information</p>';
 }
 
 // ------------------------------------------------------------------
 // Callback function for our example setting
 // ------------------------------------------------------------------
 //
 // creates a checkbox true/false option. Other types are surely possible
 //
 
 function eg_setting_callback_function() {
 	echo '<input name="contact-phone" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('contact-phone').'" class="code" />';
 }
 function companyname_callback_function() {
 	echo '<input name="company-name" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('company-name').'" class="code" />';
 }
 function companystreet_callback_function() {
 	echo '<input name="company-street" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('company-street').'" class="code" />';
 }
 function companycity_callback_function() {
 	echo '<input name="company-city" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('company-city').'" class="code" />';
 }
  function companystate_callback_function() {
 	echo '<input name="company-state" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('company-state').'" class="code" />';
 }
  function companyzip_callback_function() {
 	echo '<input name="company-zip" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('company-zip').'" class="code" />';
 }
  function facebook_callback_function() {
 	echo '<input name="facebook-url" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('facebook-url').'" class="code" />';
 }
 function twitter_callback_function() {
 	echo '<input name="twitter-url" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('twitter-url').'" class="code" />';
 }
 function vimeo_callback_function() {
 	echo '<input name="vimeo-url" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('vimeo-url').'" class="code" />';
 }
  function name_callback_function() {
 	echo '<input name="name" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('name').'" class="code" />';
 }
   function email_callback_function() {
 	echo '<input name="email" id="gv_thumbnails_insert_into_excerpt" type="text" value="'.get_option('email').'" class="code" />';
 }

add_action('admin_init', 'eg_settings_api_init');
add_filter( 'menu_icons_hidden_label_class', 'my_menu_icons_hidden_label_class' );
add_action('publish_projects', 'add_project_category_automatically');
add_action( 'after_setup_theme', 'rmsjr_setup' );
add_action('wp_ajax_open_grid_content', 'rmsjr_open_grid_content' );
add_action('wp_ajax_nopriv_open_grid_content', 'rmsjr_open_grid_content' );
add_action('wp_ajax_load_page', 'rmsjr_load_page' );
add_action('wp_ajax_nopriv_load_page', 'rmsjr_load_page' );
add_action('wp_enqueue_scripts', 'rmsjrEnqueueScripts');

?>