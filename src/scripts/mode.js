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

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

const changeTheme = () => {
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
};

let currentMode = getCookie('md');
console.log(typeof currentMode);

if(!currentMode){
  currentMode = '0';
  setCookie('md','0','365')
}

if(currentMode === '1'){
  changeTheme();
}

btn.addEventListener(`click`, function () {
  setCookie('md', currentMode === '0' ? '1' : '0', 365);
  changeTheme();
});
