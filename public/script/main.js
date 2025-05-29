// public/script/main.js
//function showMessage() {
//  alert('Wayple 백엔드 정적 자바스크립트 연결 성공!');
//}

async function loadDashboard() {
  const token = localStorage.getItem('token'); // JWT 저장돼 있다고 가정
  if (!token) {
    document.body.innerHTML = '<h2>로그인이 필요합니다</h2>';
    return;
  }

  const res = await fetch('/mypage/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    document.body.innerHTML = '<h2>데이터 로드 실패</h2>';
    return;
  }

  const data = await res.json();

  document.getElementById('nickname').innerText = data.profile.nickname;
  document.getElementById('carbon-badge').innerText = data.carbon.badge;
  document.getElementById('esg-grade').innerText = data.esg?.grade ?? '-';
}