<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<!-- sanitize.cssを読み込み -->
	<link href="https://unpkg.com/sanitize.css" rel="stylesheet"/>
	<!-- Google Fontsを読み込み -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
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
