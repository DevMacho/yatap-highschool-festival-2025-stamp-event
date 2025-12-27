/* student_admin.js */

// --------------------- 데이터 로드 ---------------------
let currentUsers = [];        // 전체 유저 캐싱
let sortDesc = true;          // true = 도장많은순, false = 적은순

// DB에서 전체 유저 로딩
async function loadUsers(){
    const res = await fetch("/api/users");
    const data = await res.json();
    if(data.success){
        currentUsers = data.users;
        renderList(currentUsers);
    }
}

// --------------------- 테이블 렌더링 ---------------------
function renderList(list){
    const body = document.getElementById("user-list");
    body.innerHTML = "";

    list.forEach(user=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.studentId}</td>
            <td>${user.name}</td>
            <td>${user.stamp.length}</td>
            <td>${user.stamp.join(", ")}</td>
        `;
        body.appendChild(tr);
    });
}

// --------------------- 검색 기능 ---------------------
document.getElementById("search-btn").addEventListener("click", async()=>{
    const id = document.getElementById("search-id").value.trim();
    if(!id) return alert("학번 입력 필요");

    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();
    if(data.success) renderList([data.user]);
    else alert("해당 학번 없음");
});

// --------------------- 새로고침 ---------------------
document.getElementById("refresh-btn").addEventListener("click", loadUsers);

// --------------------- 도장 개수 정렬 (🔥정렬 전 DB 로드) ---------------------
document.getElementById("sort-btn").addEventListener("click", async ()=>{
    await loadUsers(); // 항상 최신으로 불러오기

    currentUsers.sort((a,b)=> b.stamp.length - a.stamp.length ); // 많은 순으로만 정렬

    renderList(currentUsers);
});

// 페이지 로드시 자동 실행
window.onload = loadUsers;
