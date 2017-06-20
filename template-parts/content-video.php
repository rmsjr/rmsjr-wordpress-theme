<div id="project-video" class="">
  <?php
  /*
      A loop field named "gallery" with sub-fields "slide_title" and "upload"
      Loop fields return an associative array containing *ALL* sub-fields and their values
      NOTE: Values of sub-loop fields are returned when using get() on the parent loop!
  */
$vimeoUrl = CFS()->get( 'vimeo_url' );
/*
You may want to use oEmbed discovery instead of hard-coding the oEmbed endpoint.
*/
$oembed_endpoint = 'http://vimeo.com/api/oembed';

// Create the URLs
$json_url = $oembed_endpoint . '.json?url=' . rawurlencode($vimeoUrl) . '&api=1&width=720&height=480&autoplay=true&player_id=project-video-player';


// Curl helper function
function curl_get($url) { 
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); 
    $return = curl_exec($curl);
    curl_close($curl);
    return $return;
}

$oembed = json_decode(curl_get($json_url ));
?>

  <?php get_template_part('template-parts/widget', 'project-details'); ?>

  <!-- Indicators -->
  <?php if(!empty($vimeoUrl)): ?>
        <div class="videoWrapper">
        <?php echo html_entity_decode($oembed->html) ?>
        </div>
  <?php endif; ?>

</div>