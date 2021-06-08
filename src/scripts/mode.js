`use strict`;
const nav = document.querySelector(`nav`);
const footer = document.querySelector(`footer`);
const rights = document.querySelector(`.rights`);
const page = document.querySelector(`html`);
const btn = document.querySelector(`button`);
const navA = document.querySelectorAll("nav a");
const footerA = document.querySelectorAll("footer a");
const footerLabel = document.querySelectorAll("footer label");
const img1 = document.querySelector(`button img`);
const img2 = document.querySelector(`.img2`);
btn.addEventListener(`click`, function () {
  footer.classList.toggle(`footerLight`);
  nav.classList.toggle(`navLight`);
  rights.classList.toggle(`rightsLight`);
  page.classList.toggle(`htmlLight`);
  btn.classList.toggle(`spaceLight`);

  for (item of navA) {
    item.classList.toggle("colorBlack");
  }
  for (item of footerA) {
    item.classList.toggle("colorBlack");
  }
  for (item of footerLabel) {
    item.classList.toggle("colorBlack");
  }
  // SWAPS AN INVISIBLE IMG WITH THE OTHER IMG DARK WITH LIGHT AND LIGHT WITH DARK
  let x = img1.src;
  let y = img2.src;
  img1.src = y;
  img2.src = x;
});
