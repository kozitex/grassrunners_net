<?php get_header(); ?>
<div id="video-area">
    <video id="video" poster="<?php echo get_bloginfo('template_directory'); ?>/img/bg.png" webkit-playsinline playsinline muted autoplay loop>
        <source src="<?php echo get_bloginfo('template_directory'); ?>/video/bg.mp4" type="video/mp4">
    </video>
</div>
<section id="fv">
    <div class="pre-title">Welcome to</div>
    <div class="flash-line"></div>
    <div class="title animate">grassrunners.net</div>
    <div class="guide animate">
        <div class="text"><span>I want you to know me.</span><br><span>Please scroll !</span></div>
        <div class="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 16">
                <line x1="16" y1="16" x2="16" y2="0" style="stroke:rgb(255,255,255);stroke-width: 0.8" />
                <line x1="13" y1="10" x2="16" y2="16" style="stroke:rgb(255,255,255);stroke-width: 0.8" />
            </svg>
        </div>
    </div>
</section>
<section id="about">
    <div class="section-title animate">About</div>
    <div class="section-sub-title animate">自己紹介</div>
    <div class="text animate">
        <p>フリーランスでシステムエンジニアをやっています。以前は社内SEでしたが、ひきこもりや障害者の支援など、社会福祉の分野に関わる仕事や活動がしたく、勤めていた会社を退職しました。</p>
        <p>ITを仕事にしたきっかけは中学生の時、BASICというプログラミング言語と出会ったことでした。雑誌に掲載されているサンプルプログラムを打ち込んでは、コードの中身を解析して、ここをこう変えたらこう動くんじゃないか、と自分なりのカスタマイズを夢中になって1日中やっていました。</p>
        <p>学習塾の社内SEとして勤務を始めてからは、自社ホームページのデザインやコーディング、Web業務アプリケーションの開発、情報セキュリティ関連規程の整備、インフラやソフトウェアの導入・運用・保守、職員向けIT研修のインストラクターなど、生徒・保護者や職員が利用するIT全般の様々な業務に関わらせていただきました。</p>
        <p>入社した頃はまだ社内にIT自体が浸透しておらず、専門技術を使うことよりも、技術を翻訳して職員に理解してもらう役割が求められていたと思います。とにかく、できるだけユーザーと直接会話をすることや、理解しやすい言葉で話すということを大事にしていました。</p>
        <p>入社時には50ほどだった拠点数が200近くへと会社規模も大きくなった頃には、社内にITの利活用が浸透したことや部門の信頼獲得に貢献したことなど地道な活動が評価され、運用・保守チームのリーダーや情報システム部門の管理職も経験させていただきました。</p>
        <p>しかし、改めて今後の人生の歩み方を考えた時に、もっと社会課題に直接関われるような活動をしたいという思いと、システムエンジニアとしてユーザーと直接関わりながら、自らの手を動かして物作りをしたいという思いを強く持つようになり、16年勤めた会社を退職しました。</p>
        <p>現在は、何らかの事情や理由で家から出ることが難しい人たちに向けて、プログラミングの楽しさや面白さ、職業としての可能性を知ってもらうための活動をしたいと考えています。</p>
        <p>私にはITのことしかできませんが、自分の技術や経験を活かせる機会が必ずあると信じています。多くの人が互いに思いやり、助け合える社会に一歩でも近付くことを目指して活動していきます！</p>
    </div>
</section>
<section id="works">
    <div class="section-title animate">Works</div>
    <div class="section-sub-title animate">実績</div>
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
    ?>
    <ul class="works-list">
    <?php
        while ( $query->have_posts() ) : $query->the_post();
    ?>
        <li class="work animate <?php echo the_field('class'); ?>" data-id="<?php echo $post->post_name; ?>">
            <img src="<?php the_post_thumbnail_url(); ?>" alt="<?php the_title(); ?>">
            <div class="title"><?php the_title(); ?></div>
        </li>
    <?php endwhile; ?>
    </ul>
    <?php endif;wp_reset_postdata(); ?>
</section>
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
?>
<div class="modal" id="<?php echo $post->post_name; ?>">
    <div class="box">
        <div class="close-btn"></div>
        <div class="content">
            <?php
              $kind = get_field('sample-image-kind');
              if ($kind == 'url') {
                $url = get_field('sample-image-url');
              } else {
                $url = get_field('sample-image-img');
              }
            ?>
            <img src="<?php echo $url; ?>" alt="<?php the_title(); ?>">
            <div class="info">
                <div class="info-item"><span>サイト・システム名</span></div>
                <div class="info-content"><?php the_field('client-name'); ?></div>
                <div class="info-item"><span>使用言語・技術</span></div>
                <div class="info-content"><?php the_field('method'); ?></div>
                <div class="info-item"><span>URL</span></div>
                <div class="info-content">
                  <?php
                    if (get_field('url2')) :
                    $url1 = get_field('url1');
                    $url2 = get_field('url2');
                  ?>
                    ・<a href="<?php echo $url1['url']; ?>" target="<?php echo $url1['target']; ?>">
                        <?php echo $url1['title']; ?>
                    </a><br>
                    ・<a href="<?php echo $url2['url']; ?>" target="<?php echo $url2['target']; ?>">
                        <?php echo $url2['title']; ?>
                    </a>
                  <?php
                    else :
                    $url1 = get_field('url1');
                  ?>
                    <a href="<?php echo $url1['url']; ?>" target="<?php echo $url1['target']; ?>">
                        <?php echo $url1['title']; ?>
                    </a>
                  <?php endif; ?>
                </div>
            </div>
            <div class="desc"><?php the_content(); ?></div>
        </div>
    </div>
</div>
<?php
    endwhile;
    endif;wp_reset_postdata();
?>
<section id="service">
    <div class="section-title animate">Service</div>
    <div class="section-sub-title animate">提供できるもの</div>
    <ul class="card">
        <li class="animate" style="transition-delay: 0ms;">
            <div class="title">１．Webサイト制作</div>
            <div class="body">ホームページ、ブログ、コーポレートサイト、商品販売サイト、ランディングページなど、Webサイトの制作に関すること全般に対応いたします。どんなことができるのか、こんなことができないかなど、ご質問・ご相談ベースから、予算に応じた制作をご提案します。<br><br>対応可能なプログラム言語や技術は主に、HTML/CSS、Javascript/jQuery、PHP、Wordpress、Github、Dockerなどがあります。
            </div>
        </li>
        <li class="animate" style="transition-delay: 200ms;">
            <div class="title">２．デザイン</div>
            <div class="body">制作するWebサイトは、「手作り感のない」、「見映えのする」、「見る人も運営する人も使いやすい」サイトを目指しています。<br>必要に応じて、パートナーとなっているデザイナーと協働して制作に当たります。<br>おしゃれなだけのWebサイトではなく、組織の理念や風土、Webサイトの目的などに合わせて、柔軟なご提案をします。</div>
        </li>
        <li class="animate" style="transition-delay: 400ms;">
            <div class="title">３．サポート</div>
            <div class="body">Webサイトは作って終わりではなく、作った後にどう運用していくかということも大事な要素の1つです。<br>稼働した後の使い勝手や拡張性を考慮したご提案をするのはもちろんのこと、運用がしっかりと軌道に乗るまで、稼働後も継続的にサポートいたします。</div>
        </li>
    </ul>
</section>
<section id="links">
    <div class="section-title animate">Links</div>
    <div class="section-sub-title animate">各種リンク</div>
    <div class="table animate">
        <div class="table-line">
            <div class="column1">MAIL</div>
            <div class="column2">kozitex@grassrunners.net</div>
        </div>
        <div class="table-line">
            <div class="column1">TWITTER</div>
            <div class="column2"><a href="https://twitter.com/kozitex" target="_blank">@kozitex <i class="far fa-window-restore"></i></a></div>
        </div>
        <div class="table-line">
            <div class="column1">GIT HUB</div>
            <div class="column2"><a href="https://github.com/kozitex" target="_blank">github.com/kozitex/ <i class="far fa-window-restore"></i></a></div>
        </div>
        <div class="table-line">
            <div class="column1">TWITCH</div>
            <div class="column2"><a href="https://www.twitch.tv/grassrunners" target="_blank">twitch.tv/grassrunners <i class="far fa-window-restore"></i></a></div>
        </div>
    </div>
</section>
<?php get_footer(); ?>
