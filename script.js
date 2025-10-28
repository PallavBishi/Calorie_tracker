const dailyLimit = 1800;
let data = JSON.parse(localStorage.getItem('calorieData')) || [];

updateUI();

document.getElementById('add').addEventListener('click', () => {
  const food = document.getElementById('food').value.trim();
  const calories = parseInt(document.getElementById('calories').value);

  if (!food || isNaN(calories) || calories <= 0) {
    alert('Please enter valid food name and calorie value.');
    return;
  }

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
  const totalToday = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = dailyLimit - totalToday;

  document.getElementById('consumed').textContent = totalToday;
  document.getElementById('remaining').textContent = remaining >= 0 ? remaining : 0;
  document.getElementById('remaining').style.color = remaining < 0 ? '#ff4d6d' : '#0077b6';

  const list = document.getElementById('list');
  list.innerHTML = '';
  todayEntries.forEach(e => {
    const li = document.createElement('li');
    li.innerHTML = `${e.food} <span>${e.calories} kcal</span>`;
    list.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const now = new Date();
  const today = new Date(now.toISOString().split('T')[0]);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6); // last 7 days
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const weeklyEntries = data.filter(e => new Date(e.date) >= weekStart);
  const monthlyEntries = data.filter(e => new Date(e.date) >= monthStart);

  const weeklyTotal = weeklyEntries.reduce((sum, e) => sum + e.calories, 0);
  const monthlyTotal = monthlyEntries.reduce((sum, e) => sum + e.calories, 0);

  document.getElementById('weekly-total').textContent = weeklyTotal;
  document.getElementById('monthly-total').textContent = monthlyTotal;
}

// PWA Support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
