export default class sticky {
  constructor(target){
    
    this.gbcr = target.getBoundingClientRect();
    
    this.el = {
      target: target,
      x: this.gbcr.x,
      y: this.gbcr.y,
      w: this.gbcr.width,
      h: this.gbcr.height,
    }

    this.attraction = 10;

    this.mouse = {
      x: 0,
      y: 0,
      cx: 0,
      cy: 0
    }

    this.frag = false;

    this.el.target.addEventListener('mouseenter', () => { this.mouseEnter() });
    this.el.target.addEventListener('mouseleave', () => { this.mouseLeave() });
    this.bindMouseMove = this.mouseMove.bind(this);
    this.onRequestAnimationFrame();
  }

  mouseMove(e) {
    this.mouse.x = gsap.utils.mapRange(this.el.x, this.el.x + this.el.w, -this.attraction, this.attraction, e.clientX);
    this.mouse.y = gsap.utils.mapRange(this.el.y, this.el.y + this.el.h, -this.attraction, this.attraction, e.clientY);
  }

  mouseEnter() {
    console.log('enter');
    this.frag = true;
    addEventListener('mousemove',this.bindMouseMove);
  }

  mouseLeave() {
    console.log('leave');
    this.frag = false;
    this.mouse.cx = 0;
    this.mouse.cy = 0;
    gsap.to(this.el.target, {
      x: 0,
      y: 0,
      scaleX: 1.0,
      scaleY: 1.0,
      // skewX: '0deg',
      // skewY: '0deg',
      duration: .3,
      ease: 'elastic.out(1, 0.5)'
    });
    removeEventListener('mousemove',this.bindMouseMove);
  }

  onRequestAnimationFrame() {
    if(this.frag){
      this.mouse.cx = gsap.utils.interpolate(this.mouse.cx, this.mouse.x, 0.01);
      this.mouse.cy = gsap.utils.interpolate(this.mouse.cy, this.mouse.y, 0.01);
      // this.el.target.style = 'transform: skew(' + this.mouse.cy + 'deg, ' + this.mouse.cx + 'deg);'
      gsap.set(this.el.target, {
        // skewX: this.mouse.cx + 'deg',
        // skewY: this.mouse.cy + 'deg',
        // scaleX: 1.0 + this.mouse.cx * 0.1,
        // scaleY: 1.0 + this.mouse.cy * 0.1,
        // z: this.mouse.cx / this.mouse.cy,
        x: this.mouse.cx,
        y: this.mouse.cy,
        scaleX: 1.0 + Math.abs(this.mouse.cx) * 0.01,
        scaleY: 1.0 + Math.abs(this.mouse.cy) * 0.01,
        transformOrigin: (this.mouse.cx > 0 ? 0 : 100) + '% ' + (this.mouse.cy > 0 ? 0 : 100) + '%',
      });
      // gsap.set(this.el.target, {
      //   x: this.mouse.cx,
      //   y: this.mouse.cy
      // });
    }
    
    requestAnimationFrame(() => { this.onRequestAnimationFrame() });
  }
}

