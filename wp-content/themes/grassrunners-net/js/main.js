'use strict';
import Movie from './animation/movie.js';

var moveTimer = 0;
// var scrollAmt;
// var winInHeight = window.innerHeight;
var lineNum = 0;
// var loadingFlg = false;
// waitingFlg = false;

var
cursor = document.getElementById('cursor'),
stalker = document.getElementById('stalker'),
// loader = document.getElementById('loader'),
main = document.getElementById('main');
// mv = document.getElementById('mv');
// var video = document.getElementById('video');
// var works = document.getElementsByClassName('work');
var thresholdFrom;
var thresholdTo;
// var movie;
var video;

window.addEventListener('DOMContentLoaded', () => {
  // console.log('video loaded');
  video = document.getElementById('video');
  video.addEventListener('loadeddata', () => {
    // console.log('video loaded');
    setTimeout(init, 1000);
  });
  video.load();

});

const init = () => {

  // カーソルの色を反転させる境界値を取得する
  var about = document.getElementById('about');
  var links = document.getElementById('links');
  thresholdFrom = getPositionY(about);
  thresholdTo   = getPositionY(links);

  // var loadCompNum = 0;
	// const imgs = document.querySelectorAll('img');
  // imgs.forEach((img) => {
    // img.addEventListener('load', (e) => {
      // loadCompNum += 1;
			// console.log(e.target.alt);
      // console.log(loadCompNum + ' / ' + imgs.length);
      // if (loadCompNum == imgs.length) {
        // loadingFlg = true;
        // main.classList.remove('loading');
      // }
    // });
		// img.src = img.getAttribute('data-src');
  // });



  // // タイトルのDOMとスタイルを用意
  // const title = document.getElementById('title');
  // const titleStalker = document.getElementById('title-stalker');
  // const titleStalker2 = document.getElementById('title-stalker2');
  // const text = 'grassrunners.net';
  // textSlicer(title, text);
  // textSlicer(titleStalker, text);
  // textSlicer(titleStalker2, text);

  // const titles = title.children;
  // const titleStalkers = titleStalker.children;
  // const titleStalkers2 = titleStalker2.children;
  // setDelay(titles, 3130);
  // setDelay(titleStalkers, 3230);
  // setDelay(titleStalkers2, 3330);

  // スクロールを禁止
  // document.addEventListener('touchmove', noscroll, {passive: false});
  // document.addEventListener('wheel', noscroll, {passive: false});

  // オープニングムービー開始
  video.play();
  main.classList.remove('loading');

  const movie = new Movie();
  // var movie;

  // movie = new Movie();

  // new sticky(titleStalker);
  // movie.onWindowResize;
  movie.onWindowResize;
  window.addEventListener('resize', movie.onWindowResize);
  // let timeoutId = 0;
  // window.addEventListener('resize', () => {
  //   if (timeoutId) clearTimeout(timeoutId);
  //   timeoutId = setTimeout(resize, 200);
  // });
  window.addEventListener('scroll', (e) => {
    movie.onScroll(window.scrollY);
    animateActive();
  });

  // const targets = document.getElementById('title').children;
    // new sticky(targets[0]);
  // Array.from(targets).forEach(function(target) {
  //   new sticky2(target);
  // });

	// worksの並び順に応じて、トランジションのディレイを設定する
  // checkLine().then(function (value) {
	// 	lineNum = value;
	// }).catch(function (error) {
	// 	console.log(error);
	// })

  var worksList = document.getElementById('works-list');
  var works = worksList.children;
  var modalBg = document.getElementById('modal-bg');
  var body = document.getElementsByTagName('body')[0];
  Array.from(works).forEach((work) => {
    var close = work.getElementsByClassName('close')[0];
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      body.classList.remove('fixed');
      worksList.classList.remove('fixed');
      modalBg.classList.remove('open');
      work.classList.remove('open');
    });

    work.addEventListener('click', () => {
      // if (!work.classList.contains('open')) {
        // console.log('!');
      worksList.classList.add('fixed');
      modalBg.classList.add('open');
      work.classList.add('open');
      body.classList.add('fixed');
      // }
    });
  });

  modalBg.addEventListener('click', () => {
    body.classList.remove('fixed');
    worksList.classList.remove('fixed');
    modalBg.classList.remove('open');
    Array.from(works).forEach((work) => {
      work.classList.remove('open');
    });
  });

	// for (var $i = 0;$i < works.length;$i ++) {
	// 	var loop = Math.floor($i / lineNum);
	// 	works[$i].style.transitionDelay = ($i - loop * lineNum) * 200 + 'ms';
	// }

	// // 各workがクリックされたら、モーダルウィンドウを表示する
	// for (var $i = 0;$i < works.length;$i ++) {
	// 	works[$i].onclick = function() {
	// 		var id = this.dataset.id;
	// 		document.getElementById(id).classList.add('show');
	// 		document.getElementsByTagName('body')[0].classList.add('fixed');
	// 	};
	// }

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
  // video.load();
  // cursorCentering();
	animateActive();

  // 読み込みから3秒経ったら待機フラグを更新
  // setTimeout(() => {
  //   waitingFlg = true;
  //   loadingEnded();
  //   // カーソル要素を画面右下端に移動
  //   // cursorChace(window.innerWidth, window.innerHeight)
  // }, 500);

  // 動画が再生可能になったら読込フラグを更新
  // video.addEventListener('canplay', function() {
  //   loadingFlg = true;
  //   // console.log("canplay");
  //   loadingEnded();
  // });

  // マウスが動くたびに実行
  window.addEventListener('mousemove', (e) => {
    cursorChace(e.clientX, e.clientY);
    invertCursorColor(e.pageY);
    detectMouseStop();
  });

  // // 画面がスクロールするたびに実行
  // window.addEventListener('scroll', () => {
	// 	scrollAmt = window.scrollY;
  //   // mvFadeOut();
  //   // videoAlter();
  //   animateActive();
  // });

}





// // テキストを１文字ずつ分割して要素として追加
// const textSlicer = (id, text) => {
//   var words= [];
//   for (var i = 0;i < text.length;i ++) {
//     words.push(text.substring(i, i + 1));
//   }
//   words.forEach((word) => {
//     const div = document.createElement('div');
//     div.innerText = word;
//     id.appendChild(div);
//   });
// }

// // アニメーションディレイを設定
// const setDelay = (words, start) => {
//   for (var $i = 0;$i < words.length;$i ++) {
//     const radians = $i * Math.PI / 180;
//     const increment = Math.sin(radians) * 2000;
//     words[$i].style.animationDelay = start + increment + 'ms';
//   };
// }

// スクロールを禁止
// const noscroll = (e) => e.preventDefault();

// // 待機フラグと読込フラグがtrueならローディングを終了
// const loadingEnded = () => {
//   if (waitingFlg && loadingFlg) {
//     main.classList.remove('loading');
//     status.textContent = '';
//     mv.classList.add('active');
//     // setTimeout(() => {
//     //   document.removeEventListener('touchmove', noscroll);
//     //   document.removeEventListener('wheel', noscroll);
//     // }, 4800);
//   }
// }

// // スクロールに応じてmvをフェードアウト
// const mvFadeOut = () => {
//   var threshold = 1 / 2;
//   var ratio = 1 - scrollAmt / ( winInHeight * threshold );
//   mv.style.opacity = ratio;
// }


// マウスカーソルの色を反転させる
const invertCursorColor = (pageY) => {
  // console.log(pageY, thresholdFrom, thresholdTo)
  if (pageY > thresholdFrom && pageY < thresholdTo) {
    main.classList.add('inversion');
  } else {
    main.classList.remove('inversion');
  }
}

// 要素のY座標を取得する
const getPositionY = (element) => {
  const clientRect = element.getBoundingClientRect() ;
  return window.scrollY + clientRect.top ;
  // return element.offsetTop;
}

// // スクロールに応じて動画を変化
// const videoAlter = () => {
//   var threshold = 1 / 2;
//   var ratio = scrollAmt / ( winInHeight * threshold );
//   video.style.filter = 'blur(' + ratio * 50 + 'px)';
// }

// // カーソル要素を画面の中央に移動
// const cursorCentering = () => {
//   var centerX = window.innerWidth / 2;
//   var centerY = window.innerHeight / 2;
//   cursorChace(centerX, centerY)
// }

// マウスの動きに合わせてカーソル要素を動かす
const cursorChace = (mouseX, mouseY) => {
  cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  // status.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
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
