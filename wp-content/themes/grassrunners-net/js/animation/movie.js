'use strict';

import * as THREE from 'three';

export default class Movie {
  constructor() {

    // 頂点シェーダー
    const vertexSh = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
    `;

    // ムービー用のピクセルシェーダー
    const movieFragSh = `
    varying vec2 vUv;

    uniform float uMixed;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uMovieTex;
    uniform sampler2D uNoiseTex;
    uniform float uTexAspect;
    uniform float uScrAspect;

    void main() {
      vec2 ratio = vec2(
        min(uScrAspect / uTexAspect, 1.0),
        min(uTexAspect / uScrAspect, 1.0)
      );

      vec2 textureUv = vec2(
        (vUv.x - 0.5) * ratio.x + 0.5,
        (vUv.y - 0.5) * ratio.y + 0.5
      );
    
      float noise = texture2D(uNoiseTex, textureUv).r;
      vec4 pTexColor = vec4(1.0, 1.0, 1.0, 0.0);
      // vec4 pTexColor = vec4(0.22, 0.71, 0.55, 1.0);
      // vec4 pTexColor = vec4(vec3(0.0, 0.0, 0.0), textureUv);
      float mixed;
      float change;

      if (uMixed < 0.99 || uScroll <= 0.0) {
        change = 1.0 - (noise * uProgress * 5.5 + uProgress * 1.2);
        if ( change <= 0.0 ) { change = 0.0; }
        mixed = uMixed;
      } else if (uScroll > 0.0 && uScroll <= 3.5) {
        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        mixed = 1.0 - uScroll * 0.3;
      } else {
        // change = noise;
        mixed = 0.8;
        change = noise * (uScroll - 4.0) * 0.3;
        // change = 2.0;
        // mixed = noise * (uScroll - 4.0) * 0.9;
      }

      // if (uMixed >= 0.999 && uScroll <= 1.0) {
      //   change = noise * uScroll;
      //   if ( change >= 1.0 ) { change = 1.0; }
      //   mixed = 1.0 - uScroll * 0.3;
      // } else {
      //   change = 1.0 - (noise * uProgress * 5.5 + uProgress * 1.2);
      //   if ( change <= 0.0 ) { change = 0.0; }
      //   mixed = uMixed;
      // }

      vec4 nTexColor = texture2D(uMovieTex, vec2(textureUv.x, textureUv.y - change));
      gl_FragColor = mix( pTexColor, nTexColor, mixed );
    }
    `;

    // ウェルカム用のピクセルシェーダー
    const welcomeFragSh = `
    varying vec2 vUv;

    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uWelcomeTex;
    uniform sampler2D uNoiseTex;
    uniform float uTexAspect;
    uniform float uScrAspect;

    void main() {
      vec2 ratio = vec2(
        min(uScrAspect / uTexAspect, 1.0),
        min(uTexAspect / uScrAspect, 1.0)
      );

      vec2 textureUv = vec2(
        (vUv.x - 0.5) * ratio.x + 0.5,
        (vUv.y - 0.5) * ratio.y + 0.5
      );

      float change;
  
      float noise = texture2D(uNoiseTex, textureUv).r;
      vec4 pTexColor = vec4(1.0, 1.0, 1.0, 0.0);
      vec4 nTexColor;

      if (uProgress <= 3.0 && uScroll <= 0.0) {

        nTexColor = texture2D(uWelcomeTex, textureUv);

      } else if (uScroll <= 1.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        nTexColor = texture2D(uWelcomeTex, vec2(textureUv.x, textureUv.y - change));

      }
      gl_FragColor = mix( pTexColor, nTexColor, uProgress );
    }
    `;

    // ロゴ用のピクセルシェーダー
    const logoFragSh = `
    varying vec2 vUv;

    uniform float uProgress;
    uniform float uMixed;
    uniform float uScroll;
    uniform sampler2D uLogoTex;
    uniform sampler2D uNoiseTex;
    uniform float uTexAspect;
    uniform float uScrAspect;
    
    void main() {

      vec2 ratio = vec2(
        min(uScrAspect / uTexAspect, 1.0),
        min(uTexAspect / uScrAspect, 1.0)
      );

      vec2 textureUv = vec2(
        (vUv.x - 0.5) * ratio.x + 0.5,
        (vUv.y - 0.5) * ratio.y + 0.5
      );

      float change;
      float noise = texture2D(uNoiseTex, textureUv).r;

      if (uProgress <= 3.0 && uMixed <= 1.0 && uScroll <= 0.0) {

        change = noise * 0.3 - (uProgress - 0.6);
        if ( change <= 0.0 ) { change = 0.0; }

      } else if (uScroll <= 1.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }

      } else {
        change = 1.0;
      }
      vec4 pTexColor = vec4(1.0, 1.0, 1.0, 0.0);
      vec4 nTexColor = texture2D(uLogoTex, vec2(textureUv.x, textureUv.y - change));
      gl_FragColor = mix( pTexColor, nTexColor, uMixed );
    }
    `;

    // ガイド用のピクセルシェーダー
    const guideFragSh = `
    varying vec2 vUv;

    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uGuideTex;
    uniform sampler2D uNoiseTex;
    uniform float uTexAspect;
    uniform float uScrAspect;

    void main() {
      vec2 ratio = vec2(
        min(uScrAspect / uTexAspect, 1.0),
        min(uTexAspect / uScrAspect, 1.0)
      );

      vec2 textureUv = vec2(
        (vUv.x - 0.5) * ratio.x + 0.5,
        (vUv.y - 0.5) * ratio.y + 0.5
      );

      float change;
  
      float noise = texture2D(uNoiseTex, textureUv).r;
      vec4 pTexColor = vec4(1.0, 1.0, 1.0, 0.0);
      vec4 nTexColor;

      if (uProgress <= 3.0 && uScroll <= 0.0) {

        nTexColor = texture2D(uGuideTex, textureUv);

      } else if (uScroll <= 1.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        nTexColor = texture2D(uGuideTex, vec2(textureUv.x, textureUv.y - change));

      }
      gl_FragColor = mix( pTexColor, nTexColor, uProgress );
    }
    `;



    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // スクロール量
    this.scroll = 0;

    // テクスチャー
    const loader = new THREE.TextureLoader();
    const noiseTex = loader.load('/wp-content/themes/grassrunners-net/img/noise2.png');
    // const noiseTex2 = loader.load('/wp-content/themes/grassrunners-net/img/noise8.png');
    const noiseTex2 = loader.load('/wp-content/themes/grassrunners-net/img/noise6.jpg');

    const video = document.getElementById('video');
    // const main = document.getElementById('main');
    // video.addEventListener('loadeddata', () => {
    //   video.play();
    //   main.classList.remove('loading');
    //   console.log('video loaded');
    // });
    // video.load();

    // let video = document.createElement('video');
    // video.src = '/wp-content/themes/grassrunners-net/video/movie02.mov';
    // video.muted = true;
    // video.loop = true;
    
    const movieTex = new THREE.VideoTexture(video);
    const welcomeTex = loader.load('/wp-content/themes/grassrunners-net/img/welcome.png');
    const logoTex = loader.load('/wp-content/themes/grassrunners-net/img/logo.png');
    const guideTex = loader.load('/wp-content/themes/grassrunners-net/img/guide.png');
    const texAspect = 1920.0 / 1080.0;


    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  
    // DOMにレンダラーのcanvasを追加
    const movie = document.getElementById('movie');
    movie.appendChild(this.renderer.domElement);

    // カメラ
    this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 10, -10);

    // シーン
    this.scene = new THREE.Scene();

    // ジオメトリ
    const movieGeo = new THREE.PlaneGeometry(2, 2, 1, 1);
    const greenGeo = new THREE.PlaneGeometry(20, 20, 1, 1);
    const welcomeGeo = new THREE.PlaneGeometry(2, 2, 1, 1);
    const logoGeo = new THREE.PlaneGeometry(2, 2, 1, 1);
    const guideGeo = new THREE.PlaneGeometry(2, 2, 1, 1);

    this.movieUnifs = {
      uMixed:     { value: 0.0 },
      uProgress:  { value: 0.0 },
      uMovieTex:  { value: movieTex },
      uNoiseTex:  { value: noiseTex },
      uScroll:    { value: this.scroll / this.h },
      uTexAspect: { value: texAspect },
      uScrAspect: { value: this.w / this.h },
    };

    this.logoUnifs = {
      uProgress:  { value: 0.0 },
      uMixed:     { value: 0.0 },
      uLogoTex:   { value: logoTex },
      uNoiseTex:  { value: noiseTex2 },
      uScroll:    { value: this.scroll / this.h },
      uTexAspect: { value: texAspect },
      uScrAspect: { value: this.w / this.h },
    };

    this.welcomeUnifs = {
      uProgress:   { value: 0.0 },
      uWelcomeTex: { value: welcomeTex },
      uNoiseTex:   { value: noiseTex2 },
      uScroll:     { value: this.scroll / this.h },
      uTexAspect:  { value: texAspect },
      uScrAspect:  { value: this.w / this.h },
    };

    this.guideUnifs = {
      uProgress:  { value: 0.0 },
      uGuideTex:  { value: guideTex },
      uNoiseTex:  { value: noiseTex2 },
      uScroll:    { value: this.scroll / this.h },
      uTexAspect: { value: texAspect },
      uScrAspect: { value: this.w / this.h },
    };


    // マテリアル
    const movieMat = new THREE.ShaderMaterial({
      uniforms: this.movieUnifs,
      vertexShader: vertexSh,
      fragmentShader: movieFragSh,
      wireframe: false,
      transparent: true,
    });

    const greenMat = new THREE.MeshBasicMaterial({
      color: 0x38b48b,
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.DstColorFactor,
      blendDst: THREE.SrcColorFactor,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const welcomeMat = new THREE.ShaderMaterial({
      uniforms: this.welcomeUnifs,
      vertexShader: vertexSh,
      fragmentShader: welcomeFragSh,
      wireframe: false,
      transparent: true,
    });

    const logoMat = new THREE.ShaderMaterial({
      uniforms: this.logoUnifs,
      vertexShader: vertexSh,
      fragmentShader: logoFragSh,
      wireframe: false,
      transparent: true,
    });

    const guideMat = new THREE.ShaderMaterial({
      uniforms: this.guideUnifs,
      vertexShader: vertexSh,
      fragmentShader: guideFragSh,
      wireframe: false,
      transparent: true,
    });

    // メッシュ
    this.movieMesh   = new THREE.Mesh(movieGeo, movieMat);
    this.greenMesh   = new THREE.Mesh(greenGeo, greenMat);
    this.welcomeMesh = new THREE.Mesh(welcomeGeo, welcomeMat);
    this.logoMesh    = new THREE.Mesh(logoGeo, logoMat);
    this.guideMesh   = new THREE.Mesh(guideGeo, guideMat);

    // メッシュをシーンに追加
    this.scene.add(this.movieMesh);
    this.scene.add(this.greenMesh);
    this.scene.add(this.welcomeMesh);
    this.scene.add(this.logoMesh);
    this.scene.add(this.guideMesh);

    // 描画ループ開始
    this.render();
  }

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    // const easeOutQuad = (t, b, c, d) => {
    //   return -c * (t /= d) * (t - 2) + b;
    // };

    const sec = performance.now() / 1000;

    // ムービーのアニメーション
    const movieStart = 2.0;
    if (sec <= movieStart) {
      this.movieUnifs.uProgress.value = 0.0;
    } else if (movieStart < sec) {
      gsap.to(this.movieUnifs.uProgress, {
        duration: 0.16,
        value: 1.0,
        ease: 'expo.in',
      });
    }

    const movieStart2 = 0.0;
    if (sec <= movieStart2) {
      this.movieUnifs.uMixed.value = 0.0;
    } else if (movieStart2 < sec) {
      gsap.to(this.movieUnifs.uMixed, {
        duration: 2.0,
        value: 1.0,
        ease: 'none',
      });
    }

    // ウェルカムのアニメーション
    const welcomeStart = 3.5;

    if (sec <= welcomeStart) {
      this.welcomeUnifs.uProgress.value = 0.0;
    } else if (welcomeStart < sec ) {
      gsap.to(this.welcomeUnifs.uProgress, {
        duration: 0.8,
        value: 1.0,
        ease: 'none',
      });
    }

    // ロゴのアニメーション
    const logoStart = 3.5;
    if (sec <= logoStart) {
      this.logoUnifs.uProgress.value = 0.0;
    } else if (logoStart < sec ) {
      gsap.to(this.logoUnifs.uProgress, {
        duration: 15.5,
        value: 1.0,
        ease: 'expo.out',
        // ease: 'none',
      });
    }

    const logoStart2 = 3.8;
    if (sec <= logoStart2) {
      this.logoUnifs.uMixed.value = 0.0;
    } else if (logoStart2 < sec) {
      gsap.to(this.logoUnifs.uMixed, {
        duration: 1.5,
        value: 1.0,
        ease: 'none',
      });
    }

    // ガイドのアニメーション
    const guideStart = 6.0;

    if (sec <= guideStart) {
      this.guideUnifs.uProgress.value = 0.0;
    } else if (guideStart < sec) {
      gsap.to(this.guideUnifs.uProgress, {
        duration: 0.8,
        value: 1.0,
        ease: 'none',
      });
    }

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.movieUnifs.uScrAspect.value = this.w / this.h;
    this.welcomeUnifs.uScrAspect.value = this.w / this.h;
    this.logoUnifs.uScrAspect.value = this.w / this.h;
    this.guideUnifs.uScrAspect.value = this.w / this.h;

    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onScroll = (y) => {
    this.scroll = y;
    // console.log(this.scroll / this.h);

    this.movieUnifs.uScroll.value = this.scroll / this.h;
    this.welcomeUnifs.uScroll.value = this.scroll / this.h;
    this.logoUnifs.uScroll.value = this.scroll / this.h;
    this.guideUnifs.uScroll.value = this.scroll / this.h;
  }

  lerp = (start, end, multiplier) => {
    return (1 - multiplier) * start + multiplier * end;
  };
}
