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
    101:"1-1반 귀신의 집 👻\n특수 장치와 조명, 음향효과로 공포감을 유발\n귀신의 집 테마로 꾸며진 어둠 속 공간에서 탐험할 수 있습니다.",
    102:"1-2반 타로 카페 🧙‍♀️\n음료를 마시며 타로점을 치며 고민 상담\n타로 카드를 통한 오늘의 운세 및 상담을 진행합니다.",
    103:"1-3반 쥬라기 월드 어드벤쳐 🦖\n미니게임 및 체험존 운영(미니게임, 보물찾기 등)\n여러 미니게임과 보물찾기를 즐기고 직접 공룡을 만날 수 있습니다.",
    104: "1-4반 만남의 광장 💬\n학생 간 교류 및 다과회",
    105: "1-5반 미니 야구장 ⚾\n야구 배트와 공을 활용한 야구 테마 게임을 진행하고 소정의 음식 상품을 받을 수 있습니다.",
    106: "1-6반 보드게임&닌텐도 카페 🕹\n젠가, 도블 등 여러 보드게임과 닌텐도를 즐길 수 있습니다.",
    107: "1-7반 롤러코스터 🎢\n놀이기구 체험",
    108: "1-8반 귀신의 집 💀 🗝\n귀신의 집 테마의 탐험 부스입니다.",
    109: "1-9반 놀9가 ⚾\n구역별 체험존(야구, 행운권 추첨 등)",
    110: "1-10반 올인원 챌린지 존 ⚽\n미니풋살, 풍선 터뜨리기, 깡통 쓰러뜨리기\n1:1 풋살 대결과 간단한 미니게임을 진행합니다.",
    201:"2-1반 먹자천국 🥘\n분식류를 만들어서 맛보고 판매",
    202:"2-2반 솜사탕 🍭\n다같이 솜사탕을 먹는 부스입니다.",
    203:"2-3반 현실판 오메티비 💞\n이상형 적어서 제출하고 맞는 사람끼리 대화",
    204: "2-4반 영화관 📽\n학급 내 스크린을 활용한 영화관 운영",
    205: "2-5반 음악감상클럽 🎶\n음료를 마실 수 있는 음악감상실 운영\n음료를 마시며 즐거운 음악을 듣고 즐기는 부스입니다.",
    206: "2-6반 최종병기 활 🏹\n수제 오뎅꼬치 활로 간단한 사격 놀이를 합니다.",
    207: "2-7반 보드게임 카페 🕹\n여러 종류의 보드게임을 친구들과 자유롭게 함께 즐기며 쉬어갈 수 있는 체험형 부스입니다.",
    208: "2-8반 브롤스타즈 도장깨기 🎮\n야탑고 브롤스타즈 1짱 이지성을 이겨라!",
    209: "2-9반 뽕뽕나이트 🎤\n학급 내 스크린을 활용한 노래방 운영\n1,2명씩 노래를 부르고 구경하는 부스입니다.",
    210:"2-10반 오락실 🎮\n각종 미니게임 운영\n여러가지 게임들에 참여하고 간식 받아갑니다.",
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