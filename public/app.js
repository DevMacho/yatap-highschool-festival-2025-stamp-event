const registerSection = document.getElementById("register-section");
const stampSection = document.getElementById("stamp-section");
const userForm = document.getElementById("userForm");

// 초기 실행
function init() {
    const studentId = localStorage.getItem("studentId");
    const name = localStorage.getItem("name");

    if(studentId && name) showStampPage(name);
    else registerSection.style.display = "block";
}

// 등록 폼 이벤트
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;

    const response = await fetch("/api/register", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ studentId, name })
    });

    if(response.ok){
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("name", name);
        localStorage.setItem("stamp", JSON.stringify([]));

        showStampPage(name);
    } else alert("유저 등록에 실패했습니다. 오류 발생에 관한 내용은 본관 1층 학생회실에 문의해주세요.");
});

// 🔥 스탬프판 생성 함수 (여기가 핵심 FIX)
function showStampPage(name){
    registerSection.style.display = "none";
    stampSection.style.display = "block";
    document.getElementById("welcome").innerText = `${name}님 환영합니다`;

    const board1 = document.getElementById("stamp-board-1"); // 1학년
    const board2 = document.getElementById("stamp-board-2"); // 2학년

    board1.innerHTML = "";
    board2.innerHTML = "";

    // 1학년 101~110
    for(let i=101;i<=110;i++){
        const box = document.createElement("div");
        box.classList.add("stamp-box");
        box.dataset.id = i;
        box.innerText = `1-${i-100}반`;
        board1.appendChild(box);
    }

    // 2학년 201~210
    for(let i=201;i<=210;i++){
        const box = document.createElement("div");
        box.classList.add("stamp-box");
        box.dataset.id = i;
        box.innerText = `2-${i-200}반`;
        board2.appendChild(box);
    }

    renderStamp(); // 기존 기능 그대로 유지
}

// =================== 반별 설명 데이터 ===================
const boothInfo = {
    101:"1-1반 실내룰렛 게임🎯\n참가 시 간식 제공",
    102:"1-2반 페이스페인팅🎨\n작은 그림 선택 가능",
    103:"1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    104: "2-1반 미니 카페☕\n음료 + 디저트 판매",
    105: "2-2반 농구 프리스로우🏀\n연속 성공시 상품",
    106: "1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    107: "1-2반 페이스페인팅🎨\n작은 그림 선택 가능",
    108: "1-1반 실내룰렛 게임🎯\n참가 시 간식 제공",
    109: "1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    110: "2-1반 미니 카페☕\n음료 + 디저트 판매",
    201:"1-1반 실내룰렛 게임🎯\n참가 시 간식 제공",
    202:"1-2반 페이스페인팅🎨\n작은 그림 선택 가능",
    203:"1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    204: "2-1반 미니 카페☕\n음료 + 디저트 판매",
    205: "2-2반 농구 프리스로우🏀\n연속 성공시 상품",
    206: "1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    207: "1-2반 페이스페인팅🎨\n작은 그림 선택 가능",
    208: "1-1반 실내룰렛 게임🎯\n참가 시 간식 제공",
    209: "1-3반 VR 체험 👓\n롤러코스터/공포 선택",
    210:"2-1반 미니 카페☕\n음료 + 디저트 판매",
};

// =================== 스탬프 클릭 → 모달 열기 ===================
document.addEventListener("click", e=>{
    if(e.target.classList.contains("stamp-box")){
        const id = e.target.dataset.id;
        const title = e.target.innerText;
        const desc = boothInfo[id] || "등록된 설명이 없습니다.";

        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-desc").innerText = desc;

        document.getElementById("boothModal").style.display="flex";
    }
});

// 모달 닫기 버튼
document.getElementById("closeModal").onclick=()=>{
    document.getElementById("boothModal").style.display="none";
};

// 스탬프 로드 + 표시
async function loadStamp() {
    const studentId = localStorage.getItem("studentId");
    if(!studentId) return;

    const res = await fetch(`/api/stamp/${studentId}`);
    const data = await res.json();

    if(data.success){
        localStorage.setItem("stamp", JSON.stringify(data.stamps));
        renderStamp();
    }
}

// 새로고침 버튼 연결
document.getElementById("refresh").addEventListener("click", loadStamp);

// 색칠 적용
function renderStamp(){
    const stamps = JSON.parse(localStorage.getItem("stamp") || "[]");

    stamps.forEach(num=>{
        const box = document.querySelector(`.stamp-box[data-id='${num}']`);
        if(box) box.classList.add("checked");
    });
}

// 실행 시작
init();