'use strict';

window.addEventListener('DOMContentLoaded', function() {

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
	// titles = document.getElementsByClassName('title')[0].children,
	// titleShadows = document.getElementsByClassName('title-shadow')[0].children;
  ;

  var moveTimer = 0;

  var scrollAmt;
  var winInHeight = window.innerHeight;

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

  // スクロールを禁止
  const noscroll = (e) => e.preventDefault();

  // スクロールに応じてmvをフェードアウト
  const mvFadeOut = () => {
		var threshold = 1 / 2;
		var ratio = 1 - scrollAmt / ( winInHeight * threshold );
		mv.style.opacity = ratio;
  }

  // マウスカーソルの色を反転させる
  const invertCursorColor = (pageY) => {
    console.log(pageY, window.innerHeight);
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

	// 各workがクリックされたら、モーダルウィンドウを表示する
	var works = document.getElementsByClassName('work');
	for (var $i = 0;$i < works.length;$i++) {
		works[$i].onclick = function() {
			var id = this.dataset.id;
			document.getElementById(id).classList.add('show');
			document.getElementsByTagName('body')[0].classList.add('fixed');
		};
	}

	// worksが横何列で並んでいるかをチェックする
	var lineNum = 0;
	checkLine().then(function (value) {
		lineNum = value;
	}).catch(function (error) {
		console.log(error);
	})

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

	// 画面の可視範囲に来たら、アニメーションを開始する
	function animateActive() {
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

	// worksの並び順に応じて、トランジションのディレイを設定する
	for (var $i = 0;$i < works.length;$i++) {
		var loop = Math.floor($i / lineNum);
		works[$i].style.transitionDelay = ($i - loop * lineNum) * 200 + 'ms';
	}

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

	function checkLine() {
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





  // スクロールを禁止
  document.addEventListener('touchmove', noscroll, {passive: false});
  document.addEventListener('wheel', noscroll, {passive: false});

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
  }, 3000);

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
    mvFadeOut();
    videoAlter();
    animateActive();
  });


});
