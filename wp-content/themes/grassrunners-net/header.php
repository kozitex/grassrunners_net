<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<!-- FAVICONを設定 -->
	<link rel="shortcut icon" href="<?php bloginfo('template_directory'); ?>/img/favicon.ico">
	<link rel="apple-touch-icon" href="<?php bloginfo('template_directory'); ?>/img/apple-touch-icon.png" sizes="180x180">

  <!-- <script async src="https://unpkg.com/es-module-shims@1.5.8/dist/es-module-shims.js"></script>
<script type="importmap">
   {
       "imports": {
           "three": "https://unpkg.com/three@0.142.0/build/three.module.js"
       }
   }
</script> -->

  <!-- <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/"
      }
    }
  </script> -->
  <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.162.0/three.module.js" integrity="sha512-0XQNqFQUDxCJPikfkl+TwMm0YblRLrIoBb7MvYZ4Q7BUoeNBXUvW/PawMUgT2jn3w/AFTxANjy0mJ94ob215mQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> -->
  <!-- <script src="https://unpkg.com/three@0.162.0/build/three.min.js"></script> -->
  <!-- <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script> -->

  <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script> -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/TweenMax.min.js"></script> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/107/three.min.js"></script>

	<!-- sanitize.cssを読み込み -->
	<link href="https://unpkg.com/sanitize.css" rel="stylesheet"/>
	<!-- Google Fontsを読み込み -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<!-- <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> -->
  <!-- <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"> -->
  <!-- <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet"> -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">

  <link href="https://fonts.googleapis.com/css?family=M+PLUS+1p:400,500,700,800&display=swap&subset=japanese" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Noto+Serif+JP:400,500,600,700&display=swap&subset=japanese" rel="stylesheet">
	<!-- FontAwesomeを読み込み -->
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css" integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk" crossorigin="anonymous">

  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'grassrunners-net' ); ?></a>
	<header id="masthead" class="site-header"></header>
