const mealInput = document.getElementById("meal");
const calInput = document.getElementById("calories");
const addBtn = document.getElementById("add");
const list = document.getElementById("list");
const totalText = document.getElementById("total");
const clearBtn = document.getElementById("clear");
const statsBtn = document.getElementById("stats");
const modal = document.getElementById("statsModal");
const closeModal = document.getElementById("closeModal");
const chartCanvas = document.getElementById("chart");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

function updateList() {
  list.innerHTML = "";
  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.date).toDateString() === today);
  let total = 0;

  todayEntries.forEach((entry) => {
    total += entry.calories;
    const li = document.createElement("li");
    li.textContent = `${entry.meal}: ${entry.calories} kcal`;
    list.appendChild(li);
  });

  totalText.textContent = `Total: ${total} kcal`;
  localStorage.setItem("entries", JSON.stringify(entries));
}

addBtn.addEventListener("click", () => {
  const meal = mealInput.value.trim();
  const calories = parseInt(calInput.value);
  if (meal && !isNaN(calories)) {
    entries.push({ meal, calories, date: new Date().toISOString() });
    mealInput.value = "";
    calInput.value = "";
    updateList();
  }
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all entries?")) {
    entries = [];
    updateList();
  }
});

statsBtn.addEventListener("click", () => {
  showStats();
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function showStats() {
  const grouped = {};

  entries.forEach((e) => {
    const date = new Date(e.date).toDateString();
    grouped[date] = (grouped[date] || 0) + e.calories;
  });

  const labels = Object.keys(grouped).slice(-7); // last 7 days
  const data = Object.values(grouped).slice(-7);

  new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Calories per Day",
          data,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// Initialize
updateList();

// PWA setup
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
