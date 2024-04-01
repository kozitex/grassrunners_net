'use strict';

import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
// import * as FontLoader from 'three/addons/loaders/FontLoader.js';
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass";

export default class Movie {
  constructor() {

    // 頂点シェーダー
    const vertexSh = `
    varying vec2 vUv;
    uniform float uFixAspect;

    void main() {
      vUv = uv - 0.5;
      vUv.y *= uFixAspect * 1.65;
      vUv += 0.5;
      gl_Position = vec4(position, 1.0);
    }
    `;

    // ピクセルシェーダー
    const fragmentSh = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uTex0;
    uniform sampler2D uTex1;
    uniform sampler2D uNoiseTex;
    // uniform sampler2D uTex;
    // uniform sampler2D uDisplacement;
    void main() {
      float opacity = 1.0;
      if (uTime >= 4.0) {
        opacity = opacity - ((uTime - 4.0) * 0.3);
      }
      if (opacity <= 0.3) {
        opacity = 0.3;
      }

      vec4 texFrom = vec4(0.22, 0.71, 0.55, 1.0);

      float shift = 1.0;
      vec4 disp = texture2D(uNoiseTex, vUv);
      // if (uTime >= 3.0) {
        // float t = uTime - 3.0;
        shift = 1.0 - ((uTime * 0.3) + (disp.r * uTime * 0.5));
      // }
      if (shift <= 0.0) { shift = 0.0; }

      if (uScroll > 0.0) {
        shift =  - disp.r * uScroll;
        if (shift >= 1.0 ) { shift = 1.0; }
      }
      vec4 texTo = texture2D( uTex1, vec2( vUv.x, vUv.y - shift ));

      float percent = 0.0;
      if (uTime >= 3.0) {
        percent = (uTime - 3.0) * 0.3;
      }
      if (percent >= 0.7) {
        percent = 0.7;
      }

      if (uScroll > 0.0) {
        percent = 0.7 - (uScroll * 0.7);
        if (percent <= 0.0) { percent = 0.0; }
      }

      vec4 finalTexture = mix( texFrom, texTo, uProgress );
      gl_FragColor = finalTexture;
    }
    `;

    // ピクセルシェーダー
    const fragmentSh2 = `
    varying vec2 vUv;

    uniform float uTime;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uTex1;
    uniform sampler2D uNoiseTex;

    void main() {
      float noise = texture2D(uNoiseTex, vUv).r;
      vec4 pTexColor = vec4(vec3(0.22, 0.71, 0.55), vUv);
      float progress;
      float change;

      if (uScroll <= 0.0) {

        change = 1.0 - ((uTime * 0.2) + (noise * uTime * 0.6));
        if ( change <= 0.0 ) { change = 0.0; }
        progress = uProgress;

      } else if (uScroll <= 2.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        progress = 1.0 - uScroll * 0.3;

      }
      vec4 nTexColor = texture2D(uTex1, vec2(vUv.x, vUv.y - change));
      gl_FragColor = mix( pTexColor, nTexColor, progress );

    }
    `;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // スクロール量
    this.scroll = 0;

    // テクスチャー
    const loader = new THREE.TextureLoader();
    const noiseTex = loader.load('/wp-content/themes/grassrunners-net/img/displacement2.png');
    const video = document.getElementById( 'video' );
    const texture0 = loader.load('/wp-content/themes/grassrunners-net/img/displacement4.jpg');
    const texture1 = new THREE.VideoTexture(video);

    const bloomParams = {
      /** トーンマッピング: 露光量 */
      exposure: 1.8,
    
      /** 発光エフェクト: 強さ */
      bloomStrength: 3.0,
    
      /** 発光エフェクト: 半径 */
      bloomRadius: 1.2,
    
      /** 発光エフェクト: 閾値 */
      bloomThreshold: 0.0,
    };
    
    // レンダラー
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.shadowMap.enabled = true; // レンダラー：シャドウを有効にする
    // this.renderer.toneMapping = THREE.ReinhardToneMapping;
    // this.renderer.toneMappingExposure = Math.pow(bloomParams.exposure, 4.0);
  
    // DOMにレンダラーのcanvasを追加
    const movie = document.getElementById('movie');
    movie.appendChild(this.renderer.domElement);

    // カメラ
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100);

    // シーン
    this.scene = new THREE.Scene();

    // ジオメトリ
    const geo = new THREE.PlaneGeometry(2, 2, 1, 1);
    const geo2 = new THREE.PlaneGeometry(2, 2, 1, 1);
    // const geo3 = new THREE.TorusGeometry(3, 3, 2, 100);

    this.uniforms = {
      uTime:      { value: 0.0 },
      uProgress:  { value: 0.0 },
      uFixAspect: { value: this.h / this.w },
      uTex0:      { value: texture0 },
      uTex1:      { value: texture1 },
      uNoiseTex:  { value: noiseTex },
      uScroll:    { value: this.scroll / (this.h * 2.0) },
    };

    // マテリアル
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSh,
      fragmentShader: fragmentSh2,
      wireframe: false,
    });

    const greenShade = new THREE.MeshBasicMaterial({
      color: 0x38b48b,
      transparent: true,
      blending: THREE.MultiplyBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    // this._texture = new THREE.TextureLoader().load("/wp-content/themes/grassrunners-net/img/texture01.png");
    // this._texture.offset.y = -0.25;
    // this._texture.wrapS = THREE.RepeatWrapping;

    // const lightTex = loader.load('/wp-content/themes/grassrunners-net/img/texture01.png');

    // const piller = new THREE.MeshBasicMaterial({
    //   color: 0xffffff,
    //   map: this._texture,
    //   transparent: true,
    //   blending: THREE.AdditiveBlending,
    //   // wireframe: true,
    //   // side: THREE.FrontSide,
    //   // opacity: 0.7,
    // });

    // メッシュ
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh2 = new THREE.Mesh(geo2, greenShade);
    // this.mesh3 = new THREE.Mesh(geo3, piller);

    this.mesh.position.z = 0.0;
    this.mesh2.position.z = -0.0;
    // this.mesh3.position.set(0,0,0);
    // this.mesh3.scale.set(0.08, 0.02, 0.05);
    // this.mesh3.rotation.x = 180 * Math.PI / 180; // 90度回転

    // メッシュをシーンに追加
    this.scene.add(this.mesh);
    this.scene.add(this.mesh2);
    // this.scene.add(this.mesh3);


    // テキスト
    const fontLoader = new FontLoader();
    const fontPath = '/wp-content/themes/grassrunners-net/fonts/Montserrat_Regular.json';
    fontLoader.load( fontPath, ( font ) => {

      const color = 0xffffff;

      // const matDark = new THREE.LineBasicMaterial( {
      //   color: color,
      //   side: THREE.FrontSide,
      //   transparent: true,
      //   opacity: 0.3,
      // } );

      const matDark = new THREE.MeshBasicMaterial( {
        // map: lightTex,
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: true,
        // opacity: 0.3,
      } );


      // const matLite = new THREE.MeshBasicMaterial( {
      //   color: color,
      //   transparent: true,
      //   opacity: 0.1,
      //   side: THREE.DoubleSide
      // } );

      const message = 'grassrunners.net';
      const shapes = font.generateShapes( message, 1 );
      const geometry = new THREE.ShapeGeometry( shapes );
      geometry.computeBoundingBox();
      const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      geometry.translate( 0, 0, 0 );
      // geometry.center();
      // geometry.translate(0, 0, 0 );
      // geometry.scale = 0.0001;

      // make shape ( N.B. edge view not visible )

      // const text = new THREE.Mesh( geometry, matDark );
      // text.position = (1, 1, - 1);
      // text.scale.y = 2.0;
      // this.scene.add( text );

      // make line shape ( N.B. edge view remains visible )

      const holeShapes = [];

      for ( let i = 0; i < shapes.length; i ++ ) {
        const shape = shapes[ i ];
        if ( shape.holes && shape.holes.length > 0 ) {
          for ( let j = 0; j < shape.holes.length; j ++ ) {
            const hole = shape.holes[ j ];
            holeShapes.push( hole );
          }
        }
      }

      shapes.push.apply( shapes, holeShapes );
      this.lineText = new THREE.Object3D();
      for ( let i = 0; i < shapes.length; i ++ ) {
        const shape = shapes[ i ];
        const points = shape.getPoints();
        // const geometry = new THREE.TorusGeometry(6, 3, 2, 100).setDrawRange(points);
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        // console.log(xMid);
        geometry.translate( 0, 0, 0 );
        // geometry.center();
        // geometry.scale = 0.000001;
        const lineMesh = new THREE.Line( geometry, matDark );
        // lineMesh.rotation.x = 135;
        this.lineText.add( lineMesh );
      }

      // this.lineText.position.z = 0.0;
      // this.lineText.translateX = -3;
      this.lineText.scale.set(0.1, 0.2, 0.1);

      this.scene.add( this.lineText );

      // this.lineText.addEventListener('mouseenter', this.onMouseEnter);
      // this.lineText.addEventListener('mouseleave', this.onMouseLeave);
  
      // render();

    } );

    // const light = new THREE.PointLight(0xFFFFFF, 2, 0, 1.0);
// this.scene.add(light);
  // エフェクト: 通常レンダリング
  const renderPass = new RenderPass(this.scene, this.camera);

    // エフェクト: 発光エフェクト
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(movie.clientWidth, movie.clientHeight),
      bloomParams.bloomStrength,
      bloomParams.bloomRadius,
      bloomParams.bloomThreshold,
    );

    // エフェクトのセットアップ
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(renderPass);
    this.effectComposer.addPass(bloomPass);
    this.effectComposer.setSize(movie.clientWidth, movie.clientHeight);


    // 描画ループ開始
    this.render();
  }

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    // アニメーションのパラメータ
    const duration = 1.0;
    let initTime = 1.5;
    const effectStart = 0.0,
      effectEnd = 2.0;
    // let textureIndexCounter = 0;
    
    // 時間を取得
    const sec = (performance.now() / 1000 - initTime) / duration;
    // this.uniforms.uTime.value = sec;
    this.uniforms.uTime.value = sec / duration;

    const effectParmetor = (sec - effectStart) / (effectEnd - effectStart);

    const easeOutQuad = (t, b, c, d) => {
      return -c * (t /= d) * (t - 2) + b;
    };

    if (sec <= effectStart) {
      this.uniforms.uProgress.value = 0.0;
    } else if (effectStart < sec && sec < effectEnd) {
      this.uniforms.uProgress.value = easeOutQuad(
        effectParmetor,
        0.0,
        1.0,
        1.0
      );
    } else {
      this.uniforms.uProgress.value = 1.0;
    }

    this.effectComposer.render(sec);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize = () => {
    const aspect_ratio = 1536.0 / 576.0;
    this.renderer.setSize(
      window.innerWidth,
      window.innerWidth * (1.0 / aspect_ratio)
    );
  }

  onScroll = (y) => {
    this.scroll = y;
    this.uniforms.uScroll.value = this.scroll / this.h;
    // console.log(this.scroll / this.h);
  }


}
