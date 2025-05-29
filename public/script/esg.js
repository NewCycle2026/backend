async function drawChart() {
  const token = localStorage.getItem('token');
  const res = await fetch('/mypage/esg/chart', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const labels = data.map(d => d.period);
  const scores = data.map(d => d.score);

  new Chart(document.getElementById('esgChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'ESG 점수',
        data: scores,
        borderColor: 'green',
        borderWidth: 2,
        fill: false
      }]
    },
    options: { responsive: true }
  });
}
