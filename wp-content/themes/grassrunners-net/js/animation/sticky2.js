export default class sticky2 {
  constructor(target){

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.gbcr = target.getBoundingClientRect();

    this.el = {
      target: target,
      x: this.gbcr.x,
      y: this.gbcr.y,
      w: this.gbcr.width,
      h: this.gbcr.height,
    }

    this.attraction = 5;

    this.mouse = {
      x: 0,
      y: 0,
      cx: 0,
      cy: 0
    }

    this.frag = false;

    document.addEventListener('mousemove', (e) => this.mouseMove(e));

    // const titleStalker = document.getElementById('title-stalker');
    // titleStalker.addEventListener('mouseenter', () => { this.mouseEnter() });
    // titleStalker.addEventListener('mouseleave', () => { this.mouseLeave() });
    // this.bindMouseMove = this.mouseMove.bind(this);
    // this.onRequestAnimationFrame();
  }

  mouseMove(e) {
    const disX = (e.clientX > this.w / 4) ? gsap.utils.mapRange(0, this.w, -this.attraction, this.attraction, e.clientX) : 0;
    const disY = (e.clientY > this.h / 4) ? gsap.utils.mapRange(0, this.h, -this.attraction, this.attraction, e.clientY) : 0;
    gsap.set(this.el.target, {
      x: disX,
      y: disY,
    });

  }

  // onRequestAnimationFrame() {

  //   requestAnimationFrame(() => { this.onRequestAnimationFrame() });
  // }

  // mouseMove(e) {
  //   // console.log(gsap.utils.mapRange(100, 150, -20, 20, 50));
  //   // console.log(gsap.utils.mapRange(100, 150, -20, 20, 90));
  //   // console.log('this.el.x:' + this.el.x + ' this.el.y:' + this.el.y + ' e.clientX:' + e.clientX + ' e.clientY:' + e.clientY + 'this.mouse.x:' + this.mouse.x + ' this.mouse.y:' + this.mouse.y);
  //   this.mouse.x = gsap.utils.mapRange(this.el.x, this.el.x + this.el.w, -this.attraction, this.attraction, e.clientX);
  //   this.mouse.y = gsap.utils.mapRange(this.el.y, this.el.y + this.el.h, -this.attraction, this.attraction, e.clientY);
  //   // if (this.mouse.x > this.attraction) {this.mouse.x = this.attraction;}
  //   // if (this.mouse.x < -this.attraction) {this.mouse.x = -this.attraction;}
  //   // if (this.mouse.y > this.attraction) {this.mouse.y = this.attraction;}
  //   // if (this.mouse.y < -this.attraction) {this.mouse.y = -this.attraction;}
  //   console.log('this.mouse.x:' + this.mouse.x + ', this.mouse.y:' + this.mouse.y);
  // }

  // mouseEnter() {
  //   console.log('enter');
  //   this.frag = true;
  //   addEventListener('mousemove',this.bindMouseMove);
  // }

  // mouseLeave() {
  //   console.log('leave');
  //   this.frag = false;
  //   this.mouse.cx = 0;
  //   this.mouse.cy = 0;
  //   gsap.to(this.el.target, {
  //     x: 0,
  //     y: 0,
  //     scaleX: 1.0,
  //     scaleY: 1.0,
  //     // skewX: '0deg',
  //     // skewY: '0deg',
  //     duration: .3,
  //     ease: 'elastic.out(1, 0.5)'
  //   });
  //   removeEventListener('mousemove',this.bindMouseMove);
  // }

  // onRequestAnimationFrame() {
  //   const b = Math.sqrt(this.mouse.x ** 2 + this.mouse.y ** 2);
  //   if(this.frag && b <= this.attraction * 5){
  //     console.log('this.mouse.cx:' + this.mouse.cx + ', this.mouse.cy:' + this.mouse.cy);
  //     // console.log('this.el.x:' + this.el.x + ', this.el.y:' + this.el.y);
  //     console.log('this.mouse.x:' + this.mouse.x + ', this.mouse.y:' + this.mouse.y);
  //     // var disX = Math.abs(this.el.x - this.mouse.x);
  //     // var disY = Math.abs(this.el.y - this.mouse.y);
  //     // console.log('disX:' + disX + ', disY:' + disY);
  //     this.mouse.cx = gsap.utils.interpolate(this.mouse.cx, this.mouse.x, 0.05);
  //     this.mouse.cy = gsap.utils.interpolate(this.mouse.cy, this.mouse.y, 0.05);
  //     if (this.mouse.cx > this.attraction) {this.mouse.cx = this.attraction;}
  //     if (this.mouse.cx < -this.attraction) {this.mouse.cx = -this.attraction;}
  //     if (this.mouse.cy > this.attraction) {this.mouse.cy = this.attraction;}
  //     if (this.mouse.cy < -this.attraction) {this.mouse.cy = -this.attraction;}
  
  //     // this.mouse.cx = gsap.utils.interpolate(this.mouse.cx, this.mouse.x, 0.1);
  //     // this.mouse.cy = gsap.utils.interpolate(this.mouse.cy, this.mouse.y, 0.1);
  //     // this.el.target.style = 'transform: skew(' + this.mouse.cy + 'deg, ' + this.mouse.cx + 'deg);'
  //     gsap.set(this.el.target, {
  //       // skewX: this.mouse.cx + 'deg',
  //       // skewY: this.mouse.cy + 'deg',
  //       // scaleX: 1.0 + this.mouse.cx * 0.1,
  //       // scaleY: 1.0 + this.mouse.cy * 0.1,
  //       // z: this.mouse.cx / this.mouse.cy,
  //       x: this.mouse.cx,
  //       y: this.mouse.cy,
  //       // scaleX: 1.0 + Math.abs(this.mouse.cx) * 0.05,
  //       // scaleY: 1.0 + Math.abs(this.mouse.cy) * 0.05,
  //       // transformOrigin: (this.mouse.cx > 0 ? 0 : 100) + '% ' + (this.mouse.cy > 0 ? 0 : 100) + '%',
  //     });
  //     // gsap.set(this.el.target, {
  //     //   x: this.mouse.cx,
  //     //   y: this.mouse.cy
  //     // });
  //   } else{
  //     this.mouse.cx = 0;
  //     this.mouse.cy = 0;
  //     gsap.to(this.el.target, {
  //       x: 0,
  //       y: 0,
  //       scaleX: 1.0,
  //       scaleY: 1.0,
  //       // skewX: '0deg',
  //       // skewY: '0deg',
  //       duration: .3,
  //       ease: 'elastic.out(1, 0.5)'
  //     });
  //     // removeEventListener('mousemove',this.bindMouseMove);  
  //   }
    
  //   requestAnimationFrame(() => { this.onRequestAnimationFrame() });
  // }
}

