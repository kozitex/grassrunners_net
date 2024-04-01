'use strict';
import Movie from './animation/movie.js';
import sticky from './animation/sticky.js';

var moveTimer = 0;
var scrollAmt;
var winInHeight = window.innerHeight;
var lineNum = 0;
var
loadingFlg = false,
waitingFlg = false;

var
cursor = document.getElementById('cursor'),
stalker = document.getElementById('stalker'),
status = document.getElementById('status'),
main = document.getElementById('main'),
mv = document.getElementById('mv'),
video = document.getElementById('video')
var works = document.getElementsByClassName('work');

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {
  // タイトルのDOMとスタイルを用意
  const title = document.getElementById('title');
  const titleStalker = document.getElementById('title-stalker');
  const titleStalker2 = document.getElementById('title-stalker2');
  const text = 'grassrunners.net';
  textSlicer(title, text);
  textSlicer(titleStalker, text);
  textSlicer(titleStalker2, text);

  const titles = title.children;
  const titleStalkers = titleStalker.children;
  const titleStalkers2 = titleStalker2.children;
  setDelay(titles, 3130);
  setDelay(titleStalkers, 3230);
  setDelay(titleStalkers2, 3330);

  // スクロールを禁止
  document.addEventListener('touchmove', noscroll, {passive: false});
  document.addEventListener('wheel', noscroll, {passive: false});
  
  // オープニングムービー開始
  const movie = new Movie();
  new sticky(titleStalker);
  // movie.onWindowResize;
  movie.onWindowResize;
  window.addEventListener('resize', movie.onWindowResize);
  window.addEventListener('scroll', () => movie.onScroll(window.scrollY));

  // const targets = document.getElementById('title-stalker').children;
  // Array.from(targets).forEach(function(target) {
  //   new sticky(target);
  // });

	// worksの並び順に応じて、トランジションのディレイを設定する
  checkLine().then(function (value) {
		lineNum = value;
	}).catch(function (error) {
		console.log(error);
	})

	for (var $i = 0;$i < works.length;$i++) {
		var loop = Math.floor($i / lineNum);
		works[$i].style.transitionDelay = ($i - loop * lineNum) * 200 + 'ms';
	}

	// 各workがクリックされたら、モーダルウィンドウを表示する
	for (var $i = 0;$i < works.length;$i++) {
		works[$i].onclick = function() {
			var id = this.dataset.id;
			document.getElementById(id).classList.add('show');
			document.getElementsByTagName('body')[0].classList.add('fixed');
		};
	}

	// モーダルの閉じるボタンがクリックされたら、モーダルを閉じる
	var closeBtn = document.getElementsByClassName('close-btn');
	for (var $i = 0;$i < closeBtn.length;$i++) {
		closeBtn[$i].onclick = function() {
			var modal = this.parentElement.parentElement
			modal.classList.remove('show');
			document.getElementsByTagName('body')[0].classList.remove('fixed');
		};
	}

	// モーダルの背景がクリックされたら、モーダルを閉じる
	var modal = document.getElementsByClassName('modal');
	for (var $i = 0;$i < modal.length;$i++) {
		modal[$i].onclick = function(e) {
			if (e.target == this) {
				this.classList.remove('show');
				document.getElementsByTagName('body')[0].classList.remove('fixed');
			}
		};
	}

  // 読み込み時に実行
  video.load();
  cursorCentering();
	animateActive();

  // 読み込みから3秒経ったら待機フラグを更新
  setTimeout(() => {
    waitingFlg = true;
    loadingEnded();
    // カーソル要素を画面右下端に移動
    cursorChace(window.innerWidth, window.innerHeight)
  }, 500);

  // 動画が再生可能になったら読込フラグを更新
  video.addEventListener('canplay', function() {
    loadingFlg = true;
    // console.log("canplay");
    loadingEnded();
  });

  // マウスが動くたびに実行
  window.addEventListener('mousemove', (e) => {
    cursorChace(e.clientX, e.clientY);
    invertCursorColor(e.pageY);
    detectMouseStop();
  });

  // 画面がスクロールするたびに実行
  window.addEventListener('scroll', () => {
		scrollAmt = window.scrollY;
    // mvFadeOut();
    // videoAlter();
    animateActive();
  });

}





// テキストを１文字ずつ分割して要素として追加
const textSlicer = (id, text) => {
  var words= [];
  for (var i = 0;i < text.length;i ++) {
    words.push(text.substring(i, i + 1));
  }
  words.forEach((word) => {
    const div = document.createElement('div');
    div.innerText = word;
    id.appendChild(div);
  });
}

// アニメーションディレイを設定
const setDelay = (words, start) => {
  for (var $i = 0;$i < words.length;$i ++) {
    const radians = $i * Math.PI / 180;
    const increment = Math.sin(radians) * 2000;
    words[$i].style.animationDelay = start + increment + 'ms';
  };
}

// スクロールを禁止
const noscroll = (e) => e.preventDefault();

// 待機フラグと読込フラグがtrueならローディングを終了
const loadingEnded = () => {
  if (waitingFlg && loadingFlg) {
    main.classList.remove('loading');
    status.textContent = '';
    mv.classList.add('active');
    setTimeout(() => {
      document.removeEventListener('touchmove', noscroll);
      document.removeEventListener('wheel', noscroll);
    }, 4800);
  }
}

// スクロールに応じてmvをフェードアウト
const mvFadeOut = () => {
  var threshold = 1 / 2;
  var ratio = 1 - scrollAmt / ( winInHeight * threshold );
  mv.style.opacity = ratio;
}

// マウスカーソルの色を反転させる
const invertCursorColor = (pageY) => {
  // console.log(pageY, window.innerHeight);
  if (pageY > window.innerHeight) {
    main.classList.add('inversion');
  } else {
    main.classList.remove('inversion');
  }
}

// スクロールに応じて動画を変化
const videoAlter = () => {
  var threshold = 1 / 2;
  var ratio = scrollAmt / ( winInHeight * threshold );
  video.style.filter = 'blur(' + ratio * 50 + 'px)';
}

// カーソル要素を画面の中央に移動
const cursorCentering = () => {
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;
  cursorChace(centerX, centerY)
}

// マウスの動きに合わせてカーソル要素を動かす
const cursorChace = (mouseX, mouseY) => {
  cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  status.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
}

// マウスが停まったことを検知
const detectMouseStop = () => {
  clearTimeout(moveTimer);
  cursor.classList.add('moving');
  moveTimer = setTimeout(() => {
    cursor.classList.remove('moving');
  }, 400);
}

// 画面の可視範囲に来たら、アニメーションを開始する
const animateActive = () => {
  var element = document.getElementsByClassName('animate');
  if (!element) return;

  var activeTime = window.innerHeight > 768 ? 50 : 40;
  var scrollAmt = window.scrollY;
  var winHeight = window.innerHeight;

  for (var $i = 0;$i < element.length;$i++) {
    var elemClientRect = element[$i].getBoundingClientRect();
    var elemY = scrollAmt + elemClientRect.top;
    if ( scrollAmt + winHeight - activeTime > elemY ) {
      element[$i].classList.add('active');
    }
  }
}

// worksが横何列で並んでいるかをチェックする
const checkLine = () => {
  return new Promise(function (resolve, reject) {
    for (var $i = 0;$i < works.length;$i++) {
      var crntTop = works[$i].getBoundingClientRect().top;
      var nextTop = works[$i + 1].getBoundingClientRect().top;
      if (crntTop != nextTop) {
        lineNum = $i + 1;
        resolve(lineNum);
        reject(0);
        return;
      }
    }
  });
}



window.addEventListener('DOMContentLoaded', function() {


  
  


	// titles = document.getElementsByClassName('title')[0].children,
	// titleShadows = document.getElementsByClassName('title-shadow')[0].children;
  ;





  // const target = document.getElementById('title').children;
  // const target = document.getElementById('title-stalker');






  // // タイトル文字の並び順に応じてディレイを設定
	// for (var $i = 0;$i < titles.length;$i++) {
  //   var start = 3130;
  //   titles[$i].style.animationDelay = (start + (20 * $i)) + 'ms';
  // };

  // // タイトル文字の並び順に応じてディレイを設定
	// for (var $i = 0;$i < titleShadows.length;$i++) {
  //   var start = 3130;
  //   titleShadows[$i].style.animationDelay = (start + (20 * $i)) + 'ms';
  // };











  // mv.addEventListener('mouseenter', () => {
  //   TweenMax.to('#mv', 2, {
  //     x: 200,
  //     value: 1,
  //   });
  // });

  // mv.addEventListener('mouseleave', () => {
  //   TweenMax.to('#mv', 0.5, {
  //     x: 0,
  //   });
  // });










  // var hoverEffect = function(opts) {
  //   var vertex = `
  //   varying vec2 vUv;
  //   void main() {
  //   vUv = uv;
  //   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //   }
  //   `;
     
  //   var fragment = `
  //   varying vec2 vUv;
     
  //   uniform sampler2D texture;
  //   uniform sampler2D texture2;
  //   uniform sampler2D disp;
     
  //   // uniform float time;
  //   // uniform float _rot;
  //   uniform float dispFactor;
  //   uniform float effectFactor;
     
  //   // vec2 rotate(vec2 v, float a) {
  //   //  float s = sin(a);
  //   //  float c = cos(a);
  //   //  mat2 m = mat2(c, -s, s, c);
  //   //  return m * v;
  //   // }
     
  //   void main() {
     
  //   vec2 uv = vUv;
     
  //   // uv -= 0.5;
  //   // vec2 rotUV = rotate(uv, _rot);
  //   // uv += 0.5;
     
  //   vec4 disp = texture2D(disp, uv);
     
  //   vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
  //   vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
     
  //   vec4 _texture = texture2D(texture, distortedPosition);
  //   vec4 _texture2 = texture2D(texture2, distortedPosition2);
     
  //   vec4 finalTexture = mix(_texture, _texture2, dispFactor);
     
  //   gl_FragColor = finalTexture;
  //   // gl_FragColor = disp;
  //   }
  //   `;
     
         
  //   var parent = opts.parent || console.warn("no parent");
  //   var dispImage = opts.displacementImage || console.warn("displacement image missing");
  //   var image1 = opts.image1 || console.warn("first image missing");
  //   var image2 = opts.image2 || console.warn("second image missing");
  //   var intensity = opts.intensity || 1;
  //   var speedIn = opts.speedIn || 1.6;
  //   var speedOut = opts.speedOut || 1.2;
  //   var userHover = (opts.hover === undefined) ? true : opts.hover;
  //   var easing = opts.easing || Expo.easeOut;
     
  //   var mobileAndTabletcheck = function() {
  //       var check = false;
  //       (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  //       return check;
  //   };
     
  //   var scene = new THREE.Scene();
  //   var camera = new THREE.OrthographicCamera(
  //       parent.offsetWidth / -2,
  //       parent.offsetWidth / 2,
  //       parent.offsetHeight / 2,
  //       parent.offsetHeight / -2,
  //       1,
  //       1000
  //   );
     
  //   camera.position.z = 1;
     
  //   var renderer = new THREE.WebGLRenderer({
  //       antialias: false,
  //       alpha: false
  //   });
     
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setClearColor(0xffffff, 0.0);
  //   renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  //   parent.appendChild(renderer.domElement);
     
  //   var loader = new THREE.TextureLoader();
  //   loader.crossOrigin = "";
  //   var texture1 = loader.load(image1);
  //   var texture2 = loader.load(image2);
     
  //   var disp = loader.load(dispImage);
  //   disp.wrapS = disp.wrapT = THREE.RepeatWrapping;
     
  //   texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
  //   texture1.minFilter = texture2.minFilter = THREE.LinearFilter;
     
  //   texture1.anisotropy = renderer.getMaxAnisotropy();
  //   texture2.anisotropy = renderer.getMaxAnisotropy();
     
  //   var mat = new THREE.ShaderMaterial({
  //       uniforms: {
  //           effectFactor: { type: "f", value: intensity },
  //           dispFactor: { type: "f", value: 0.0 },
  //           texture: { type: "t", value: texture1 },
  //           texture2: { type: "t", value: texture2 },
  //           disp: { type: "t", value: disp }
  //       },
     
  //       vertexShader: vertex,
  //       fragmentShader: fragment,
  //       transparent: false,
  //       opacity: 1.0
  //   });
     
  //   var geometry = new THREE.PlaneBufferGeometry(
  //       parent.offsetWidth,
  //       parent.offsetHeight,
  //       1
  //   );
  //   var object = new THREE.Mesh(geometry, mat);
  //   scene.add(object);
     
  //   var addEvents = function(){
  //       var evtIn = "mouseenter";
  //       var evtOut = "mouseleave";
  //       if (mobileAndTabletcheck()) {
  //           evtIn = "touchstart";
  //           evtOut = "touchend";
  //       }
  //       parent.addEventListener(evtIn, function(e) {
  //           TweenMax.to(mat.uniforms.dispFactor, speedIn, {
  //               value: 1.0,
  //               ease: easing
  //           });
  //       });
     
  //       parent.addEventListener(evtOut, function(e) {
  //           TweenMax.to(mat.uniforms.dispFactor, speedOut, {
  //               value: 0,
  //               ease: easing
  //           });
  //       });
  //   };
     
  //   if (userHover) {
  //       addEvents();
  //   }
     
  //   /*window.addEventListener("resize", function(e) {
  //       renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  //   });*/
     
     
  //   this.next = function(){
  //       TweenMax.to(mat.uniforms.dispFactor, speedIn, {
  //           value: 1,
  //           ease: easing
  //       });
  //   }
     
  //   this.previous = function(){
  //       TweenMax.to(mat.uniforms.dispFactor, speedOut, {
  //           value: 0,
  //           ease: easing
  //       });
  //   };
     
  //   var animate = function() {
  //       requestAnimationFrame(animate);
     
  //       renderer.render(scene, camera);
  //   };
  //   animate();
     
     
  //   };
  //   // $(document).ready(function(e) {
  //   // document.ready(function(e) {
  //   Array.from(document.querySelectorAll(".displacement-hover")).forEach(e => {
  //       const t = Array.from(e.querySelectorAll("img"));
  //       new hoverEffect({
  //           parent: e,
  //           intensity: e.dataset.intensity || void 0,
  //           speedIn: e.dataset.speedin || void 0,
  //           speedOut: e.dataset.speedout || void 0,
  //           easing: e.dataset.easing || void 0,
  //           hover: e.dataset.hover || void 0,
  //           image1: t[0].getAttribute("data-src"),
  //           image2: t[1].getAttribute("data-src"),
  //           displacementImage: e.dataset.displacement
  //       });
  //   });
  //   // });

});
