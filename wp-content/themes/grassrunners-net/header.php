<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<!-- FAVICONを設定 -->
	<link rel="shortcut icon" href="<?php bloginfo('template_directory'); ?>/img/favicon.ico">
	<link rel="apple-touch-icon" href="<?php bloginfo('template_directory'); ?>/img/apple-touch-icon.png" sizes="180x180">
	<!-- sanitize.cssを読み込み -->
	<link href="https://unpkg.com/sanitize.css" rel="stylesheet"/>
	<!-- Google Fontsを読み込み -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Serif+JP&display=swap" rel="stylesheet">
	<!-- FontAwesomeを読み込み -->
  <script src="https://kit.fontawesome.com/a2dc0bb3f8.js" crossorigin="anonymous"></script>
  <!-- GSAPを読み込み -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <!-- Three.jsを読み込み -->
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/"
      }
    }
  </script>
  <!-- JSを読み込み -->
  <script type="module" src="<?php bloginfo('template_directory'); ?>/js/main.js"></script>
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'grassrunners-net' ); ?></a>
	<header id="masthead" class="site-header"></header>
