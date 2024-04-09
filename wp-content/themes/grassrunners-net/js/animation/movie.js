'use strict';

import * as THREE from 'three';
// import { gsap } from "gsap";
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
      vUv = uv;
      // vUv = uv - 0.5;
      // vUv.y *= uFixAspect;
      // vUv += 0.5;
      gl_Position = vec4(position, 1.0);
    }
    `;

    // // ピクセルシェーダー
    // const fragmentSh = `
    // varying vec2 vUv;
    // uniform float uTime;
    // uniform float uProgress;
    // uniform float uScroll;
    // uniform sampler2D uTex0;
    // uniform sampler2D uTex1;
    // uniform sampler2D uNoiseTex;
    // // uniform sampler2D uTex;
    // // uniform sampler2D uDisplacement;
    // void main() {
    //   float opacity = 1.0;
    //   if (uTime >= 4.0) {
    //     opacity = opacity - ((uTime - 4.0) * 0.3);
    //   }
    //   if (opacity <= 0.3) {
    //     opacity = 0.3;
    //   }

    //   vec4 texFrom = vec4(0.22, 0.71, 0.55, 1.0);

    //   float shift = 1.0;
    //   vec4 disp = texture2D(uNoiseTex, vUv);
    //   // if (uTime >= 3.0) {
    //     // float t = uTime - 3.0;
    //     shift = 1.0 - ((uTime * 0.3) + (disp.r * uTime * 0.5));
    //   // }
    //   if (shift <= 0.0) { shift = 0.0; }

    //   if (uScroll > 0.0) {
    //     shift =  - disp.r * uScroll;
    //     if (shift >= 1.0 ) { shift = 1.0; }
    //   }
    //   vec4 texTo = texture2D( uTex1, vec2( vUv.x, vUv.y - shift ));

    //   float percent = 0.0;
    //   if (uTime >= 3.0) {
    //     percent = (uTime - 3.0) * 0.3;
    //   }
    //   if (percent >= 0.7) {
    //     percent = 0.7;
    //   }

    //   if (uScroll > 0.0) {
    //     percent = 0.7 - (uScroll * 0.7);
    //     if (percent <= 0.0) { percent = 0.0; }
    //   }

    //   vec4 finalTexture = mix( texFrom, texTo, uProgress );
    //   gl_FragColor = finalTexture;
    // }
    // `;

    // ピクセルシェーダー
    const fragmentSh2 = `
    varying vec2 vUv;

    uniform float uTime;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uTex0;
    uniform sampler2D uTex1;
    uniform sampler2D uNoiseTex;

    void main() {
      float noise = texture2D(uNoiseTex, vUv).r;
      // vec4 pTexColor = texture2D(uTex0, vUv);
      // vec4 pTexColor = vec4(vec3(0.22, 0.71, 0.55), vUv);
      vec4 pTexColor = vec4(vec3(0.0, 0.0, 0.0), vUv);
      float progress;
      float change;

      if (uScroll <= 0.0) {

        change = 1.0 - ((uTime * 0.2) + (noise * uTime * 0.6));
        if ( change <= 0.0 ) { change = 0.0; }
        progress = uProgress;

      } else if (uScroll <= 1.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        progress = 1.0 - uScroll * 0.3;

      }
      // vec4 pTexColor = texture2D(uTex0, vec2(vUv.x, vUv.y + change));
      vec4 nTexColor = texture2D(uTex1, vec2(vUv.x, vUv.y - change));
      gl_FragColor = mix( pTexColor, nTexColor, progress );

    }
    `;

    const fragmentSh3 = `
    varying vec2 vUv;

    uniform float uTime;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D uTex0;
    uniform sampler2D uTex1;
    uniform sampler2D uNoiseTex;
    uniform sampler2D uNoiseTex2;

    uniform float uTextureAspect;
    uniform float uScreenAspect;
    
    void main() {
      // float noise = texture2D(uNoiseTex2, vUv).r;
      // vec4 pTexColor = texture2D(uTex0, vUv);
      // vec4 pTexColor = vec4(vec3(0.22, 0.71, 0.55), vUv);
      // vec4 pTexColor = vec4(vec3(1.0, 1.0, 1.0), vUv);
      float progress;
      float change;
      // vec2 uv = vUv;

  // 幅は常に1.0にする
  vec2 ratio = vec2(
    1.0,
    uTextureAspect / uScreenAspect
  );
  // 中央に配置するための計算
  vec2 textureUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );
                        
      // vec4 pTexColor = vec4(vec3(0.22, 0.71, 0.55), textureUv);
      float noise = texture2D(uNoiseTex2, textureUv).r;
      vec4 pTexColor = vec4(vec3(1.0, 1.0, 1.0), textureUv);
      pTexColor.a = 0.0;

      vec2 uvOffset;
      if (uScroll <= 0.0) {

        float t = uTime - 0.0;
        // float amount = uProgress * 0.02;
    
        // uvOffset = vec2( cos( uv.y * 20. + t ), sin( uv.x * 10. - t ) ) * amount;
        // uvOffset = vec2( uv.x, 1.0 - sin( uv.x * 30. - uProgress ) ) * amount;
      
        change = 1.0 + (noise * 0.3 - t * 0.3);
        // change = 1.0 - (t * 0.8 + noise * 1.2);
        // change = 1.0 - ((uTime * 0.2) + (noise * uTime * 0.6));
        if ( change <= 0.0 ) { change = 0.0; }
        progress = uProgress;

      } else if (uScroll <= 1.0) {

        change = noise * uScroll;
        if ( change >= 1.0 ) { change = 1.0; }
        progress = 1.0 - uScroll * 0.3;

      }
      // vec4 pTexColor = texture2D(uTex0, vec2(vUv.x, vUv.y + change));
      // vec4 nTexColor = texture2D(uTex0, vec2(vUv.x, vUv.y - change));
      vec4 nTexColor = texture2D(uTex0, vec2(textureUv.x, textureUv.y - change));
      // vec4 nTexColor = texture2D(uTex0, vec2(vUv.x + uvOffset.x, vUv.y + uvOffset.y - change));
      gl_FragColor = mix( pTexColor, nTexColor, progress );

    }
    `;


    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // console.log(this.w, this.h);

    // スクロール量
    this.scroll = 0;
    // this.alterScroll = 0;
    // this.scrollOffset = 0;

    const textureAspect = 1920 / 1080;
    const screenAspect = window.devicePixelRatio;

    // テクスチャー
    const loader = new THREE.TextureLoader();
    const noiseTex = loader.load('/wp-content/themes/grassrunners-net/img/displacement2.png');
    // const noiseTex2 = loader.load('/wp-content/themes/grassrunners-net/img/displacement8.png');
    const noiseTex2 = loader.load('/wp-content/themes/grassrunners-net/img/displacement6.jpg');
    const video = document.getElementById( 'video' );
    const texture0 = loader.load('/wp-content/themes/grassrunners-net/img/wrapper.png');
    const texture1 = new THREE.VideoTexture(video);
    
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
    const geo = new THREE.PlaneGeometry(2, 2, 1, 1);
    const geo2 = new THREE.PlaneGeometry(20, 20, 1, 1);
    const geo3 = new THREE.PlaneGeometry(2, 1.8, 1, 1);
    // const geo3 = new THREE.TorusGeometry(3, 3, 2, 100);

    this.uniforms = {
      uTime:      { value: 0.0 },
      uProgress:  { value: 0.0 },
      uFixAspect: { value: this.h / this.w },
      uTex0:      { value: texture0 },
      uTex1:      { value: texture1 },
      uNoiseTex:  { value: noiseTex },
      uNoiseTex2:  { value: noiseTex2 },
      uScroll:    { value: this.scroll / this.h },
    };

    this.uniforms2 = {
      uTime:      { value: 0.0 },
      uProgress:  { value: 0.0 },
      uFixAspect: { value: this.h / this.w },
      uTex0:      { value: texture0 },
      uTex1:      { value: texture1 },
      uNoiseTex:  { value: noiseTex },
      uNoiseTex2:  { value: noiseTex2 },
      uScroll:    { value: this.scroll / this.h },
      uTextureAspect: { value: textureAspect },
      uScreenAspect: { value: screenAspect },
    };

    // マテリアル
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSh,
      fragmentShader: fragmentSh2,
      wireframe: false,
      transparent: true,
    });

    const greenShade = new THREE.MeshBasicMaterial({
      color: 0x38b48b,
      transparent: true,
      blending: THREE.MultiplyBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    const mat2 = new THREE.ShaderMaterial({
      uniforms: this.uniforms2,
      vertexShader: vertexSh,
      fragmentShader: fragmentSh3,
      wireframe: false,
      transparent: true,
    });

    // メッシュ
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh2 = new THREE.Mesh(geo2, greenShade);
    this.mesh3 = new THREE.Mesh(geo3, mat2);

    // this.mesh.translateZ = 0.0;
    // this.mesh2.translateZ = -0.1;

    // メッシュをシーンに追加
    this.scene.add(this.mesh);
    this.scene.add(this.mesh2);
    this.scene.add(this.mesh3);

    // const canvasTexture = new THREE.CanvasTexture(
    //   this.createCanvasForTexture(500, 500, 'grassrunners.net', 40)
    // );
    // const scaleMaster = 10;
    // this.createSprite(
    //   canvasTexture,
    //   {
    //     x: scaleMaster,
    //     y: scaleMaster,
    //     z: scaleMaster,
    //   },
    //   { x: 0, y: 0, z: 0 }
    //   // { x: -70, y: 70, z: -70 }
    // );
    

    // テキスト
  //   const fontLoader = new FontLoader();
  //   const fontPath = '/wp-content/themes/grassrunners-net/fonts/Montserrat_Regular.json';
  //   fontLoader.load(fontPath, (font) => {


  //   const color = 0xffffff;

  //   this.titleMat = new THREE.MeshBasicMaterial( {
  //     color: color,
  //     side: THREE.DoubleSide,
  //     transparent: true,
  //   })
    
  //   const text = 'grassrunners.net';
  //   var texts = [];
  //   for (let i = 0;i < text.length;i ++) {
  //     const word = text.charAt(i);
  //     texts.push(word);
  //   }

  //   this.titleObj = new THREE.Object3D();
  //   for (let i = 0;i < texts.length;i ++) {
  //     const shapes = font.generateShapes(texts[i], 1.2);
  //     const holeShapes = [];

  //     // console.log(shapes.length);

  //     for ( let i = 0; i < shapes.length; i ++ ) {
  //       const shape = shapes[ i ];
  //       // console.log(shape.holes.length);
  //       if ( shape.holes && shape.holes.length > 0 ) {
  //         for ( let j = 0; j < shape.holes.length; j ++ ) {
  //           const hole = shape.holes[ j ];
  //           // console.log(hole);
  //           holeShapes.push( hole );
  //         }
  //       }
  //     }

  //     shapes.push.apply( shapes, holeShapes );

  //     for (let j = 0;j < shapes.length;j ++) {
  //       const shape = shapes[j];
  //       const points = shape.getPoints();
  //       const geo = new THREE.BufferGeometry().setFromPoints( points );
  //       const mat = new THREE.MeshBasicMaterial( {
  //         color: color,
  //         side: THREE.DoubleSide,
  //         // transparent: true,
  //       });
  //       const mesh = new THREE.Line( geo, mat );
  //       // mesh.scale.set(0.55, 1.0, 1.0);
  //       // mesh.position.set(0.5 * i, 0, 0);
  //       this.titleObj.add(mesh);
  //     }
  //     // const geo = new THREE.ShapeGeometry( shapes );
  //     // geo.computeBoundingBox();
  //     // const mat = new THREE.MeshBasicMaterial( {
  //     //   color: color,
  //     //   side: THREE.DoubleSide,
  //     //   transparent: true,
  //     // });
  //     // const mesh = new THREE.Mesh( geo, mat );
  //     // mesh.scale.set(0.55, 1.0, 1.0);
  //     // mesh.position.set(0.5 * i, 0, 0);
  //     // this.titleObj.add(mesh);
  //   }

  //   this.scene.add( this.titleObj );

  // });

    // const shapes = font.generateShapes( message, 1.2 );

    // fontLoader.load( fontPath, async ( font ) => {

    //   const color = 0xffffff;

    //   // const loader = new THREE.TextureLoader();
    //   // const noiseTex = loader.load('/wp-content/themes/grassrunners-net/img/displacement8.png');
  
    //   this.titleMat = new THREE.MeshBasicMaterial( {
    //     color: color,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     // opacity: 1.0,
    //     // alphaMap: noiseTex,
    //     // alphaToCoverage: true,
    //     // alphaTest: 0.3,
    //   } );

    //   const stalkerMat = new THREE.MeshBasicMaterial( {
    //     color: color,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 0.0,
    //   } );

    //   const stalkerMat2 = new THREE.MeshBasicMaterial( {
    //     color: color,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 0.0,
    //   } );


    //   const message = 'grassrunners.net';
    //   const shapes = font.generateShapes( message, 1.2 );
    //   // const geometry = new THREE.ShapeGeometry( shapes );
    //   // geometry.computeBoundingBox();
    //   // geometry.translate = (10, 0, 0);
    //   // console.log('geometry.boundingBox.max.x: ' + geometry.boundingBox.max.x);
    //   // console.log('geometry.boundingBox.min.x: ' + geometry.boundingBox.min.x);
    //   // console.log('geometry.boundingBox.max.y: ' + geometry.boundingBox.max.y);
    //   // console.log('geometry.boundingBox.min.y: ' + geometry.boundingBox.min.y);
    //   // const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    //   // geometry.translate( 0, 0, 0 );
    //   // geometry.center();
    //   // geometry.translate(0, 0, -10.0 );
    //   // geometry.scale = 0.0001;

    //   // make shape ( N.B. edge view not visible )

    //   // this.titleMesh = new THREE.Mesh( geometry, this.titleMat );
    //   // text.position = (1, 1, - 1);
    //   // this.titleMesh.scale.y = 2.0;
    //   // this.titleMesh.position.z = -0.1;
    //   // this.scene.add( this.titleMesh );

    //   // make line shape ( N.B. edge view remains visible )

    //   const holeShapes = [];

    //   console.log(shapes.length);

    //   for ( let i = 0; i < shapes.length; i ++ ) {
    //     const shape = shapes[ i ];
    //     console.log(shape.holes.length);
    //     if ( shape.holes && shape.holes.length > 0 ) {
    //       for ( let j = 0; j < shape.holes.length; j ++ ) {
    //         const hole = shape.holes[ j ];
    //         console.log(hole);
    //         holeShapes.push( hole );
    //       }
    //     }
    //   }

    //   shapes.push.apply( shapes, holeShapes );
    //   // this.stalkerBox1 = new THREE.Group();
    //   // this.stalkerBox1.center();
    //   console.log(shapes.length);

    //   this.titleObj = new THREE.Object3D();
    //   for (let i = 0; i < shapes.length; i ++) {
    //     // geometry.computeBoundingBox();
    //     const shape = shapes[ i ];
    //     // const geometry = new THREE.ShapeGeometry( shape );
    //     // const extrudeSettings = { 
    //     //   depth: 8, 
    //     //   bevelEnabled: true, 
    //     //   bevelSegments: 2, 
    //     //   steps: 2, 
    //     //   bevelSize: 1, 
    //     //   bevelThickness: 1 
    //     // };
        
    //     // const points = shape.getPoints();
    //     // const geometry = new THREE.ExtrudeGeometry( shape,extrudeSettings );
    //     // const titleMesh = new THREE.Mesh( geometry, this.titleMat );
    //     // this.titleObj.add(titleMesh);
    //   }

    //   this.stalkerObj = new THREE.Object3D();
    //   console.log(shapes.length);
    //   for ( let i = 0; i < shapes.length; i ++ ) {
    //     const shape = shapes[ i ];
    //     const points = shape.getPoints();
    //     const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //     // geometry.translate( 0, 0, 0 );
    //     // geometry.translate();
    //     // geometry.scale = 0.000001;
    //     const line = new THREE.Line( geometry, stalkerMat );
    //     // line.rotation.x = 135;
    //     // line.geometry.center();
    //     this.stalkerObj.add( line );
    //     // this.stalkerBox1.add(this.stalkerObj)
    //   }

    //   this.stalkerObj2 = new THREE.Object3D();
    //   for ( let i = 0; i < shapes.length; i ++ ) {
    //     const shape = shapes[ i ];
    //     const points = shape.getPoints();
    //     const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //     // geometry.translate( 0, 0, 0 );
    //     // geometry.center();
    //     // geometry.scale = 0.000001;
    //     const line = new THREE.Line( geometry, stalkerMat2 );
    //     // lineMesh.rotation.x = 135;
    //     this.stalkerObj2.add( line );
    //   }

    //   const scaleX = 0.55;

    //   this.titleObj.scale.set(scaleX, 1.0, 1.0);
    //   this.stalkerObj.scale.set(scaleX, 1.0, 1.0);
    //   this.stalkerObj2.scale.set(scaleX, 1.0, 1.0);

    //   const positionX = -3.9;
    //   const positionY = -0.6;

    //   this.titleObj.position.set(positionX, positionY, 0);
    //   this.stalkerObj.position.set(positionX, positionY, 0);
    //   this.stalkerObj2.position.set(positionX, positionY, 0);

    //   // this.titleMesh.scale.set(0.66, 1.15, 0.65);
    //   // this.stalkerObj.scale.set(0.66, 1.15, 0.65);
    //   // this.stalkerObj2.scale.set(0.66, 1.15, 0.65);

    //   // this.titleMesh.position.set(-0.388, -0.057, 0);
    //   // this.stalkerObj.position.set(-0.388, -0.057, 0);
    //   // this.stalkerObj2.position.set(-0.388, -0.057, 0);

    //   // this.titleMesh.translateZ = -0.4;
    //   // this.stalkerObj.translateZ = -0.3;
    //   // this.stalkerObj2.translateZ = -0.2;

    //   this.scene.add( this.stalkerObj );
    //   this.scene.add( this.stalkerObj2 );
    //   this.scene.add( this.titleObj );

    //   // this.lineText.addEventListener('mouseenter', this.onMouseEnter);
    //   // this.lineText.addEventListener('mouseleave', this.onMouseLeave);
    //   gsap.fromTo(
    //     this.titleObj,
    //     { opacity: 0.0 },
    //     { opacity: 1.0, duration: 1.0 }
    //   );


    //   // this.render();

    // } );

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
    
    // 時間を取得
    const sec = (performance.now() / 1000 - initTime) / duration;
    this.uniforms.uTime.value = sec / duration;
    this.uniforms2.uTime.value = sec / duration;

    const effectParmetor = (sec - effectStart) / (effectEnd - effectStart);

    const easeOutQuad = (t, b, c, d) => {
      return -c * (t /= d) * (t - 2) + b;
    };

    if (sec <= effectStart) {
      this.uniforms.uProgress.value = 0.0;
      this.uniforms2.uProgress.value = 0.0;
    } else if (effectStart < sec && sec < effectEnd) {
      this.uniforms.uProgress.value = easeOutQuad(
        effectParmetor,
        0.0,
        1.0,
        1.0
      );
      this.uniforms2.uProgress.value += sec * 0.05;
      this.uniforms2.uProgress.value = easeOutQuad(
        effectParmetor,
        // 0.1,
        // 0.0,
        0.0,
        1.0,
        1.0
      );
    } else {
      this.uniforms.uProgress.value = 1.0;
      this.uniforms2.uProgress.value = 1.0;
    }

    // gsap.to(this.mesh2, { rotation: 27, x: 100, duration: 1 });


    // gsap.to(this.titleMat, {
    //   duration: 1.0,
    //   opacity: 0.0,
    // });

    // this.titleMesh.translateY(this.scroll);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize = () => {
    // console.log('resize');
    this.w = window.innerWidth;
    this.h = window.innerHeight
    this.renderer.setSize(this.w, this.h);
  }

  onScroll = (y) => {
    this.scroll = y;
    // this.alterScroll = this.lerp(this.alterScroll, this.scroll, 0.1);
    // this.uniforms.uScroll.value = (this.scroll - this.alterScroll) / this.h;

    this.uniforms.uScroll.value = this.scroll / this.h;
    this.uniforms2.uScroll.value = this.scroll / this.h;
    // this.uniforms.uScroll.value = this.scroll / (this.h * 2.0);
    // console.log('this.scroll / this.h: ' + this.scroll / this.h + 'lerp: ' + this.lerp(this.scroll, 1.0, 0.1));
    // const base = this.titleMesh.position.y;
    // if (y > 0) {
    //     // this.titleMat.transparent = true;
    //   // this.titleMat.alphaMap = noiseTex;
    //   this.titleMat.alphaTest = this.lerp(this.scroll / this.h, 1.0, 0.5);
    //   this.titleMesh.position.y = base + this.lerp(this.scroll / this.h, 1.0, 0.1);
    // } else {
    //   // this.titleMat.transparent = false;
    //   this.titleMat.alphaTest = 0.0;
    //   // this.titleMat.alphaMap = null;
    // }
  }

  lerp = (start, end, multiplier) => {
    return (1 - multiplier) * start + multiplier * end;
  };

  createCanvasForTexture = (canvasWidth, canvasHeight, text, fontSize) => {
    // 貼り付けるcanvasを作成。
    const canvasForText = document.createElement('canvas');
    const ctx = canvasForText.getContext('2d');
    ctx.canvas.width = canvasWidth; // 小さいと文字がぼやける
    ctx.canvas.height = canvasHeight; // 小さいと文字がぼやける 
    // 透過率50%の青背景を描く
    ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //
    ctx.fillStyle = 'white';
    ctx.font = `${fontSize}px serif`;
    ctx.fillText(
      text,
      // x方向の余白/2をx方向開始時の始点とすることで、横方向の中央揃えをしている。
      (canvasWidth - ctx.measureText(text).width) / 2,
      // y方向のcanvasの中央に文字の高さの半分を加えることで、縦方向の中央揃えをしている。
      canvasHeight / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
    );
    return canvasForText;
  };
  
  createSprite = (texture, scale, position) => {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.position.set(position.x, position.y, position.z);
    this.scene.add(sprite);
  };
  
}
