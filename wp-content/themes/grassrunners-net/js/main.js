'use strict';
import Movie from './animation/movie.js';


var moveTimer = 0;
var thresholdFrom;
var thresholdTo;
var video;
var memoryPos;

window.addEventListener('DOMContentLoaded', () => {
  video = document.getElementById('video');
  video.preload = 'metadata';
  video.load();
  init();
  video.addEventListener('loadeddata', () => {
    video.play();
    // setTimeout(init, 1000);
  });
});

const init = () => {

  // カーソルの色を反転させる境界値を取得する
  var about = document.getElementById('about');
  var links = document.getElementById('links');
  thresholdFrom = getPositionY(about);
  thresholdTo   = getPositionY(links);

  // MVの準備
  // video.play();
  const main = document.getElementById('main');
  main.classList.remove('loading');
  const movie = new Movie();
  
  movie.onWindowResize;

  window.addEventListener('resize', movie.onWindowResize);

  window.addEventListener('scroll', () => {
    movie.onScroll(window.scrollY);
    animateActive();
  });

  // WORKSの準備
  const works = document.getElementById('works-list').children;
  const modalBg = document.getElementById('modal-bg');
  const modalWrap = document.getElementById('modal-wrap');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const body = document.getElementsByTagName('body')[0];
  const adjTop = -38;
  Array.from(works).forEach((work) => {
    const workImg = work.getElementsByTagName('img')[0];
    workImg.addEventListener('click', () => {
      body.classList.add('fixed');
      modalImg.src = work.dataset.img;
      modalTitle.textContent = work.dataset.cli;
      memoryPos = work.getBoundingClientRect();
      modalWrap.style.top = memoryPos.top + adjTop + 'px';
      modalWrap.style.left = memoryPos.left + 'px';
      work.classList.add('hidden');
      modalBg.classList.add('open');
      setTimeout(() => {
        modalWrap.classList.add('expand');
        modalWrap.style.top = '';
        modalWrap.style.left = '';
        modalImg.dataset.img = modalImg.src;
        modalImg.src = work.dataset.mov;
      }, 200)
    });
  });

  modalBg.addEventListener('click', (e) => {
    if (e.target == modalBg) {
      modalWrap.classList.remove('expand');
      modalImg.src = modalImg.dataset.img;
      modalWrap.style.top = memoryPos.top + 'px';
      modalWrap.style.left = memoryPos.left + 'px';
      modalImg.dataset.img = '';
      modalTitle.textContent = '';
      setTimeout(() => {
        modalBg.classList.remove('open');
        Array.from(works).forEach((work) => {
          work.classList.remove('hidden');
        });
      }, 400)
      setTimeout(() => {
        modalImg.src = '';
        modalWrap.style.top = '';
        modalWrap.style.left = '';
        body.classList.remove('fixed');
      }, 600)
    }
  });

  // 読み込み時に実行
	animateActive();

  // マウスが動くたびに実行
  window.addEventListener('mousemove', (e) => {
    cursorChace(e.clientX, e.clientY);
    invertCursorColor(e.pageY);
    detectMouseStop();
  });

}

// マウスカーソルの色を反転させる
const invertCursorColor = (pageY) => {
  const main = document.getElementById('main');
  if (pageY > thresholdFrom && pageY < thresholdTo) {
    main.classList.add('inversion');
  } else {
    main.classList.remove('inversion');
  }
}

// 要素のY座標を取得する
const getPositionY = (element) => {
  const clientRect = element.getBoundingClientRect();
  return window.scrollY + clientRect.top ;
}

// マウスの動きに合わせてカーソル要素を動かす
const cursorChace = (mouseX, mouseY) => {
  const cursor = document.getElementById('cursor');
  const stalker = document.getElementById('stalker');
  cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  stalker.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
}

// マウスが停まったことを検知
const detectMouseStop = () => {
  const cursor = document.getElementById('cursor');
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
