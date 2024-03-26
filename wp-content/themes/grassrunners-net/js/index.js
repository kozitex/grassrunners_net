'use strict';

import Movie from './animation/movie.js';
    // new Movie();
const movie = new Movie();

window.addEventListener('scroll', () => {
  movie.onScroll(window.scrollY);
});
