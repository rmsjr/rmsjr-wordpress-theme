<div id="carousel-project" class="carousel slide" data-ride="carousel">
  <?php
  /*
      A loop field named "gallery" with sub-fields "slide_title" and "upload"
      Loop fields return an associative array containing *ALL* sub-fields and their values
      NOTE: Values of sub-loop fields are returned when using get() on the parent loop!
  */
  $fields = CFS()->get( 'gallery_images' );
  $imageCount = count($fields);
  ?>

<?php get_template_part('template-parts/widget', 'project-details'); ?>

  <!-- Indicators -->
  <?php if($imageCount > 1): ?>
    <ol class="carousel-indicators">
      <?php for( $i=0; $i < $imageCount; $i ++ ) : ?>
        <li data-target="#carousel-project" data-slide-to="<?= $i ?>" class=" <?php if($i == 0):?> active <?php endif;?>"></li>
      <?php endfor; ?>
    </ol>
  <?php endif; ?>


  <div class="carousel-inner" role="listbox">
    <?php 
    foreach ( $fields as $key => $field ) : ?>
      <div class="item <?php if ($key == 0) :?>active<?php endif ?>">
        <img src="<?php echo $field['gallery_image']; ?>" class="itemImage" id="<?= 'galleryImage' . $key?>" alt="...">
        <div class="carousel-caption">
          <?php echo $field['gallery_image_caption']; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <?php if ($imageCount > 1) : ?>
    <!-- Controls -->
    <a class="left carousel-control" href="#carousel-project" role="button" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#carousel-project" role="button" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  <?php endif; ?>

  <p>What happens when I do this?</p>
</div>