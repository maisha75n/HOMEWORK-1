// Mobile: hamburger toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
hamburger.addEventListener('click', () => {
const isOpen = nav.classList.toggle('show');
hamburger.setAttribute('aria-expanded', String(isOpen));
});
}


// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Simple slider (used on Home gallery)
const slider = document.querySelector('[data-slider]');
if (slider) {
const slides = slider.querySelector('[data-slides]');
const images = slides.querySelectorAll('img');
const prev = slider.querySelector('[data-prev]');
const next = slider.querySelector('[data-next]');
let index = 0;


function update() {
slides.style.transform = `translateX(-${index * 100}%)`;
}
function go(step) {
index = (index + step + images.length) % images.length;
update();
}


prev.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));


// Auto-advance every 4 seconds
setInterval(() => go(1), 4000);
}