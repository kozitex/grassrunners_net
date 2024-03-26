'use strict';

import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
// import * as FontLoader from 'three/addons/loaders/FontLoader.js';

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
    uniform float uScroll;
    uniform sampler2D uTex;
    uniform sampler2D uDisplacement;
    void main() {
      float opacity = 1.0;
      if (uTime >= 4.0) {
        opacity = opacity - ((uTime - 4.0) * 0.3);
      }
      if (opacity <= 0.3) {
        opacity = 0.3;
      }

      vec4 texFrom = vec4(0.22, 0.71, 0.55, opacity);

      float shift = 1.0;
      vec4 disp = texture2D(uDisplacement, vUv);
      if (uTime >= 3.0) {
        float t = uTime - 3.0;
        shift = 1.0 - ((t * 0.3) + (disp.r * t * 0.5));
      }
      if (shift <= 0.0) { shift = 0.0; }

      if (uScroll > 0.0) {
        shift =  - disp.r * uScroll;
        if (shift >= 1.0 ) { shift = 1.0; }
      }
      vec4 texTo = texture2D( uTex, vec2( vUv.x, vUv.y + shift ));

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

      vec4 finalTexture = mix( texFrom, texTo, percent );
      gl_FragColor = finalTexture;
    }
    `;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // スクロール量
    this.scroll = 0;

    // テクスチャー
    const loader = new THREE.TextureLoader();
    const displacement = loader.load('/wp-content/themes/grassrunners-net/img/displacement2.png');
    const video = document.getElementById( 'video' );
    const texture = new THREE.VideoTexture(video);

    const fontLoader = new FontLoader();
    const font = fontLoader.load('/wp-content/themes/grassrunners-net/fonts/Montserrat_Regular.json');
    const textGeometry = new TextGeometry('grassrunners.net', {
      font: font,
      size: 88.0,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial();
    this.text = new THREE.Mesh(textGeometry, textMaterial);
    this.text.castShadow = true;
  this.text.position.z = 1;


    // レンダラー
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // DOMにレンダラーのcanvasを追加
    const movie = document.getElementById('movie');
    // const mv = document.getElementById('mv');
    movie.appendChild(this.renderer.domElement);

    // カメラ
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100);

    // シーン
    this.scene = new THREE.Scene();

    // ジオメトリ
    const geo = new THREE.PlaneGeometry(2, 2, 1, 1);
    // const geo2 = new THREE.PlaneGeometry(2, 2, 1, 1);

    this.uniforms = {
      uTime: {
        value: 0.0,
      },
      // uMouse: {
      //   value: new THREE.Vector2(0.5, 0.5),
      // },
      // uPercent: {
      //   value: this.targetPercent,
      // },
      uFixAspect: {
        value: this.h / this.w,
      },
      uTex: {
        value: texture,
      },
      uDisplacement: {
        value: displacement,
      },
      uScroll: {
        value: this.scroll / this.h,
      },
    };

    // マテリアル
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSh,
      fragmentShader: fragmentSh,
      wireframe: false,
    });

    // const spriteMat = new THREE.SpriteMaterial({
    //   color: 0x38b48b,
    //   opacity: 0.0,
    // });

    // const mat2 = new THREE.ShaderMaterial({
    //   vertexShader: vertexSh2,
    //   fragmentShader: fragmentSh2,
    //   transparent: true,
    //   opacity: 1.0,
    // });

    // メッシュ
    this.mesh = new THREE.Mesh(geo, mat);
    // this.mesh2 = new THREE.Mesh(geo2, mat2);
    // this.sprite = new THREE.Sprite(spriteMat);

    // this.sprite.scale.set(1920, 1280, 0);

    // this.mesh.position.z = 0.0;
    // this.mesh2.position.z = 100.0;

    // メッシュをシーンに追加
    this.scene.add(this.mesh);
    this.scene.add(this.text);
    // this.scene.add(this.mesh2);
    // this.scene.add(this.sprite);

    // 描画ループ開始
    this.render();
  }

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    // 時間を取得
    const sec = performance.now() / 1000;
    this.uniforms.uTime.value = sec;

    // this.uniforms.uScroll = this.scroll / this.h;

    // this.uniforms.uMouse.value.lerp(this.mouse, 0.2);

    // this.uniforms.uPercent.value += (this.targetPercent - this.uniforms.uPercent.value) * 0.2;

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  onScroll = (y) => {
    this.scroll = y;
    this.uniforms.uScroll.value = this.scroll / this.h;
    console.log(this.scroll / this.h);
  }

}