// --- 자동슬라이드 + 터치 스와이프 기능 ---
const track = document.getElementById("slider-track");
const slides = document.querySelectorAll(".slide");

let index = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;

function autoSlide(){
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
}
let auto = setInterval(autoSlide, 3500); // 3.5초마다 자동 이동

// --- 모바일/터치 스와이프 지원 ---
track.addEventListener("touchstart", e=>{
    clearInterval(auto);
    startX = e.touches[0].clientX;
    isDragging = true;
});

track.addEventListener("touchmove", e=>{
    if(!isDragging) return;
    let moveX = e.touches[0].clientX - startX;
    track.style.transform = `translateX(calc(-${index*100}% + ${moveX}px))`;
});

track.addEventListener("touchend", e=>{
    isDragging = false;
    let endX = e.changedTouches[0].clientX - startX;

    if(endX < -50 && index < slides.length-1) index++;     // 왼쪽으로 넘김
    if(endX > 50 && index > 0) index--;                    // 오른쪽으로 넘김

    track.style.transform = `translateX(-${index*100}%)`;

    auto = setInterval(autoSlide, 3500); // 제스처 후 자동재생 재개
});