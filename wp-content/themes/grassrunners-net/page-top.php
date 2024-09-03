<?php get_header(); ?>
<main id="main" class="loading">

  <!-- MV -->
  <section id="mv">
    <div id="movie">
      <video id="video" poster="<?php echo get_bloginfo('template_directory'); ?>/img/bg.png" muted loop autoplay playsinline>
        <source src="<?php echo get_bloginfo('template_directory'); ?>/video/movie02.mov" type="video/mp4">
      </video>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <div class="section-title">
      <div class="main animate">About</div>
      <div class="sub animate">自己紹介</div>
    </div>
    <div class="text animate">
        <p>フリーランスでシステムエンジニアをやっています。以前は社内SEでしたが、ひきこもりや障害者の支援など、社会福祉の分野に関わる仕事や活動がしたく、勤めていた会社を退職しました。</p>
        <p>ITを仕事にしたきっかけは中学生の時、BASICというプログラミング言語と出会ったことでした。雑誌に掲載されていたサンプルプログラムを打ち込んでは、ここをこう変えたらこう動くんじゃないか、と自分なりのカスタマイズを夢中になって1日中やっていました。</p>
        <p>学習塾の社内SEとして勤務を始めてからは、自社ホームページのデザインやコーディング、Web業務アプリケーションの開発、情報セキュリティ関連規程の整備、インフラやソフトウェアの導入・運用・保守、職員向けIT研修のインストラクターなど、生徒・保護者や職員が利用するIT全般の様々な業務に関わらせていただきました。</p>
        <p>入社した頃はまだ社内にIT自体が浸透しておらず、専門技術を使うことよりも、技術を翻訳して職員に理解してもらう役割が求められていたと思います。できるだけユーザー1人ひとりと直接会話をすることや、理解しやすい言葉で伝えるということを大事にしていました。</p>
        <p>入社時には50ほどだった拠点数が200近くへと会社規模も大きくなった頃には、社内にITの利活用が浸透したことや部門の信頼獲得に貢献したことなど地道な活動が評価され、運用・保守チームのリーダーや情報システム部門の管理職も経験させていただきました。</p>
        <p>しかし、改めて今後の人生の歩み方を考えた時に、もっと社会課題に直接関われるような活動をしたいという思いと、システムエンジニアとしてユーザーと直接関わりながら、自らの手を動かして物作りをしたいという思いを強く持つようになり、16年勤めた会社を退職しました。</p>
        <p>現在は、何らかの事情や理由で家から出ることが難しい人たちに向けて、プログラミングの楽しさや面白さ、職業としての可能性を知ってもらうための活動をしたいと考えています。</p>
        <p>私にはITのことしかできませんが、自分の技術や経験を活かせる機会が必ずあると信じています。多くの人が互いに思いやり、助け合える社会に一歩でも近付くことを目指して活動していきます！</p>
    </div>
  </section>

  <!-- WORKS -->
  <section id="works">
    <div class="section-title">
      <div class="main animate">Works</div>
      <div class="sub animate">実績</div>
    </div>
    <ul id="works-list" class="animate">
      <?php
        $args = array(
          'post_type' => 'post',
          'post_status' => 'publish',
          'category_name' => 'works',
          'posts_per_page' => -1,
          'orderby' => 'date',
          'order' => 'ASC',
        );
        $query = new WP_QUERY( $args );
        if ( $query->have_posts() ) :
          while ( $query->have_posts() ) : $query->the_post();
            $kind = get_field('sample-image-kind');
            if ($kind == 'url') {
              $url = get_field('sample-image-url');
            } else {
              $url = get_field('sample-image-img');
            }
      ?>
      <li data-cli="<?php the_field('client-name'); ?>" data-img="<?php the_post_thumbnail_url(); ?>" data-mov="<?php echo $url; ?>" data-url="<?php the_field('client-url'); ?>">
        <img src="<?php the_post_thumbnail_url(); ?>" alt="<?php the_title(); ?>">
      </li>
      <?php
          endwhile;
        endif;wp_reset_postdata();
      ?>
    </ul>
  </section>

  <!-- PROVISION -->
  <section id="provision">
    <div class="section-title">
      <div class="main animate">Provision</div>
      <div class="sub animate">ご提供できるもの</div>
    </div>
    <ul class="card">
      <li class="animate" style="transition-delay: 0ms;">
        <div class="title"><i class="fa-sharp fa-light fa-display-code"></i>デザインからのコーディング</div>
        <div class="body">
          デザインデータを元に、Webサイトの作成（コーディング）を承ります。<br>
          <br>
          デザインの意図をできる限り忠実にWebサイトに反映させることを重視しています。<br>
          デバイスや画面サイズに柔軟に対応して、可読性や動線を損なわないことはもちろん、必要に応じてアニメーションやインタラクトなどをご提案して、Webサイトの訴求力を高めるお手伝いができればと考えています。
        </div>
      </li>
      <li class="animate" style="transition-delay: 200ms;">
        <div class="title"><i class="fa-sharp fa-light fa-laptop-mobile"></i>Webページ・アプリ制作</div>
        <div class="body">
          ホームページ、ブログ、コーポレートサイト、商品販売サイト、ランディングページなど、Webサイトの制作に関すること全般や、スマホアプリの制作を承ります。<br>
          <br>
          対応可能なプログラム言語は主に、HTML/CSS、Javascript、PHP、flutterなどです。その他にWordpressや、Git、Dockerなども取り扱っております。
        </div>
      </li>
      <li class="animate" style="transition-delay: 400ms;">
        <div class="title"><i class="fa-sharp fa-light fa-message-question"></i>その他、サポート</div>
        <div class="body">
          その他、Webサイト制作にまつわるサーバーやドメインの手配、環境構築・設定作業や、継続的・定期的な更新作業やメンテナンスに関するご相談なども承っております。<br>
          お気軽にお問い合わせください。
        </div>
      </li>
    </ul>
  </section>

  <!-- LINKS -->
  <section id="links">
    <div class="section-title">
      <div class="main animate">Links</div>
      <div class="sub animate">各種リンク</div>
    </div>
    <div class="table animate">
      <div class="table-line">
        <div class="column1">MAIL</div>
        <div class="column2">kozitex@grassrunners.net</div>
      </div>
      <div class="table-line">
        <div class="column1">TWITTER</div>
        <div class="column2"><a href="https://twitter.com/kozitex" target="_blank">@kozitex&nbsp;&nbsp;&nbsp;<i class="fa-sharp fa-regular fa-window-restore"></i></a></div>
      </div>
      <div class="table-line">
        <div class="column1">GIT HUB</div>
        <div class="column2"><a href="https://github.com/kozitex" target="_blank">github.com/kozitex/&nbsp;&nbsp;&nbsp;<i class="fa-sharp fa-regular fa-window-restore"></i></a></div>
      </div>
      <div class="table-line">
        <div class="column1">TWITCH</div>
        <div class="column2"><a href="https://www.twitch.tv/grassrunners" target="_blank">twitch.tv/grassrunners&nbsp;&nbsp;&nbsp;<i class="fa-sharp fa-regular fa-window-restore"></i></a></div>
      </div>
    </div>
  </section>

  <!-- COMMON -->
  <div id="cursor"></div>
  <div id="stalker"></div>
  <div id="loader">loading</div>
  <div id="modal-bg">
    <div id="modal-wrap">
      <div id="modal-box">
        <img id="modal-img" src="" alt="">
        <div id="modal-title"></div>
        <div id="modal-close"><i class="fa-sharp fa-light fa-xmark"></i></div>
      </div>
    </div>
  </div>
</main>
<?php get_footer(); ?>
