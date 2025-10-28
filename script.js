const dailyLimit = 1800;

let data = JSON.parse(localStorage.getItem('calorieData')) || [];
updateUI();

document.getElementById('add').addEventListener('click', () => {
  const food = document.getElementById('food').value.trim();
  const calories = parseInt(document.getElementById('calories').value);

  if (food && calories > 0) {
    const entry = {
      id: Date.now(),
      food,
      calories,
      date: new Date().toISOString().split('T')[0]
    };
    data.push(entry);
    localStorage.setItem('calorieData', JSON.stringify(data));
    updateUI();
    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
  }
});

document.getElementById('clear').addEventListener('click', () => {
  if (confirm('Clear all entries?')) {
    data = [];
    localStorage.removeItem('calorieData');
    updateUI();
  }
});

function updateUI() {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = data.filter(e => e.date === today);

  const total = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = dailyLimit - total;

  document.getElementById('consumed').textContent = total;
  document.getElementById('remaining').textContent = remaining >= 0 ? remaining : 0;

  const list = document.getElementById('list');
  list.innerHTML = '';
  todayEntries.forEach(e => {
    const li = document.createElement('li');
    li.innerHTML = `${e.food} <span>${e.calories} kcal</span>`;
    list.appendChild(li);
  });
}

// PWA Support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
