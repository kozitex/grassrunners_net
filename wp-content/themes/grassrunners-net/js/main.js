'use strict';

window.addEventListener('DOMContentLoaded', function(){

  var video = document.getElementById('video');
  video.addEventListener('progress', function() {
    console.log("progress");
    stalker.classList.add('loading');
  });

  video.addEventListener('suspend', function() {
    console.log("suspend");
    stalker.classList.add('loading');
  });

  document.getElementById('video').addEventListener('loadeddata', function() {
    console.log("loadeddata");
    stalker.classList.remove('loading');
  });

  document.getElementById('video').addEventListener('canplay', function() {
    console.log("canplay");
    stalker.classList.remove('loading');
  });


	// スクロールに応じて、fvの文字を透明にする
	window.addEventListener('scroll', function(){
		var scrollAmt = window.scrollY;
		var threshold = 1 / 1.5;
		var winInHeight = window.innerHeight;
		var opacity = 1 - scrollAmt / ( winInHeight * threshold );
		this.document.getElementById('mv').style.opacity = opacity;
	});

	// スクロールに応じて、videoの文字を透明にする
	window.addEventListener('scroll', function(){
		var scrollAmt = window.scrollY;
		var threshold = 1 / 1.5;
		var winInHeight = window.innerHeight;
		var opacity = 1 - scrollAmt / ( winInHeight * threshold );
		this.document.getElementById('video').style.opacity = opacity;
	});

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

	animateActive();

	window.addEventListener('scroll', animateActive);

	// worksの並び順に応じて、トランジションのディレイを設定する
	for (var $i = 0;$i < works.length;$i++) {
		var loop = Math.floor($i / lineNum);
		works[$i].style.transitionDelay = ($i - loop * lineNum) * 200 + 'ms';
	}

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

  var
  cursor = document.getElementById('cursor'),
  stalker = document.getElementById('stalker'),
  cursorSize = 16,
  stalkerSize = 48,
  mouseX = 0,
  mouseY = 0,
  amountX = 0,
  amountY = 0;

  window.addEventListener('mousemove', cursorMove);

  // window.addEventListener('scroll', cursorMoveByScroll);

  function cursorMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    console.log(mouseX, mouseY);
    // cursor.style.left = mouseX - (cursorSize / 2) + "px";
    // cursor.style.top  = mouseY - (cursorSize / 2) + "px";
    // stalker.style.left = mouseX - (stalkerSize / 2) + "px";
    // stalker.style.top  = mouseY - (stalkerSize / 2) + "px";
    cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  }

  // function cursorMove(e) {
  //   mouseX = e.pageX;
  //   mouseY = e.pageY;
  //   cursor.style.left = mouseX - (cursorSize / 2) + "px";
  //   cursor.style.top  = mouseY - (cursorSize / 2) + "px";
  //   // stalker.style.left = mouseX - (stalkerSize / 2) + "px";
  //   // stalker.style.top  = mouseY - (stalkerSize / 2) + "px";
  //   stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  // }

  function cursorMoveByScroll() {
    console.log(mouseX, mouseY);
    var mouseX2 = mouseX + (window.scrollX - amountX);
    var mouseY2 = mouseY + (window.scrollY - amountY);
    console.log(mouseX2, mouseY2);
    // mouseX = mouseX + window.scrollX;
    // mouseY = mouseY + window.scrollY;


    // cursor.style.left = mouseX - (cursorSize / 2) + "px";
    // cursor.style.top  = mouseY - (cursorSize / 2) + "px";
    // stalker.style.left = mouseX - (stalkerSize / 2) + "px";
    // stalker.style.top  = mouseY - (stalkerSize / 2) + "px";
    cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    amountX = window.scrollX;
    amountY = window.scrollY;
  }



  
});
