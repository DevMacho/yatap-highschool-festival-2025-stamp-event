// 관리자 스탬프 등록 요청

document.getElementById("submit-btn").addEventListener("click", async ()=>{
    const code = document.getElementById("code").value.trim();
    const studentId = document.getElementById("sid").value.trim();
    const name = document.getElementById("name").value.trim();

    if(!code || !studentId || !name) return alert("모든 정보를 입력하세요.");

    const res = await fetch("/api/stamp/add", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ code, studentId, name })
    });

    const data = await res.json();
    alert(data.message);  // 서버 응답 바로 표시

    // 성공이면 입력창 초기화
    if(data.success){
        document.getElementById("sid").value="";
        document.getElementById("name").value="";
    }
});