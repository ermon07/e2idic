let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentWordData = null;
let currentView = "all";

// ===== STREAK SYSTEM =====
const streakKey = "streakData";
let streakUpdatedToday = false;

function getTodayDate() {
  return new Date().toDateString();
}

function loadStreak() {
  let data = JSON.parse(localStorage.getItem(streakKey)) || {
    count: 0,
    lastDate: null
  };

  updateStreakUI(data.count);
  return data;
}

function updateStreakUI(count) {
  const main = document.getElementById("streakCount");
  if (main) main.textContent = count;

  const wod = document.getElementById("streakCountWOTD");
  if (wod) wod.textContent = count;
}

function updateStreak() {
  let data = loadStreak();
  const today = getTodayDate();

  if (!data.lastDate) {
    data.count = 1;
  } else {
    const last = new Date(data.lastDate);
    const current = new Date(today);

    const diffDays = Math.floor((current - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      data.count += 1;
    } else if (diffDays > 1) {
      data.count = 1; // reset
      showToast("😢 Streak reset!", "remove");
    }
  }

  data.lastDate = today;

  localStorage.setItem(streakKey, JSON.stringify(data));
  updateStreakUI(data.count);
}

function checkNewDay() {
  const today = getTodayDate();
  const lastCheck = localStorage.getItem("lastCheckDate");

  if (lastCheck !== today) {
    streakUpdatedToday = false;
    localStorage.setItem("lastCheckDate", today);
  }
}

// ===== DOM CACHE =====
const resultDiv = document.getElementById("result");
const favBtn = document.getElementById("favBtn");
const paginationDiv = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("search");
const image = document.getElementById('wotdImg');

// ===== LOAD DATA =====
fetch('ilocano_dictionary.json')
  .then(res => res.json())
  .then(data => {
    dictionary = data;

    showPage(currentPage);
    updateButtons();
    togglePagination(true);

    const wotd = getWordOfTheDay(dictionary);
    document.getElementById("wotdWord").textContent = wotd.word.toUpperCase();
    document.getElementById("wotdDef").textContent = wotd.definition;
  });

// ===== WORD OF THE DAY =====
function getWordOfTheDay(dictionary) {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("wotd"));

  if (saved && saved.date === today && saved.word) {
    return saved.word;
  }

  const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];

  const wotdData = {
    date: today,
    word: randomWord
  };

  localStorage.setItem("wotd", JSON.stringify(wotdData));

  return randomWord;
}

// ===== NOTIFICATION PERMISSION =====
function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

requestNotificationPermission();

// ===== PAGINATION TOGGLE =====
function togglePagination(show) {
  paginationDiv.style.display = show ? "block" : "none";
}

// ===== RENDER ITEMS =====
function renderItems(items) {
  if (!items.length) {
    resultDiv.innerHTML = `<p class="not-found">No words found 😕</p>`;
    return;
  }

  resultDiv.innerHTML = items.map(item => `
    <div class="card"
         data-bs-toggle="modal"
         data-bs-target="#wordModal"
         data-word="${item.word}"
         data-definition="${item.definition}">
      <div class="word">${item.word.toUpperCase()}</div>
    </div>
  `).join("");
}

// ===== PAGINATION =====
function showPage(page) {
  currentView = "all";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  renderItems(dictionary.slice(start, end));
}

function updateButtons() {
  const pageCount = Math.ceil(dictionary.length / itemsPerPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageCount;
}

function nextPage() {
  const pageCount = Math.ceil(dictionary.length / itemsPerPage);
  if (currentPage < pageCount) {
    currentPage++;
    showPage(currentPage);
    updateButtons();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
    updateButtons();
  }
}

// ===== SEARCH =====
document.querySelector(".search-box button")
  .addEventListener("click", searchWord);

function searchWord() {
  // 🔥 STREAK TRIGGER
  if (!streakUpdatedToday) {
    updateStreak();
    streakUpdatedToday = true;
    showToast("🔥 Streak updated!", "success");
  }

  const input = searchInput.value.trim().toLowerCase();

  currentView = "search";

  const found = dictionary.filter(item =>
    item.word.toLowerCase().includes(input)
  );

  renderItems(found);
  togglePagination(false);
}

// ===== MODAL =====
const wordModal = document.getElementById("wordModal");

wordModal.addEventListener("show.bs.modal", function (event) {
  const trigger = event.relatedTarget;
  if (!trigger) return;

  const word = trigger.getAttribute("data-word");
  const definition = trigger.getAttribute("data-definition");

  currentWordData = { word, definition };

  document.getElementById("modalWord").textContent = word.toUpperCase();
  document.getElementById("modalDefinition").textContent = definition;

  document.getElementById("modalLink").href =
    `https://www.google.com/search?q=how+to+use+the+word+${word}+in+a+sentence+in+ilocano`;

  updateFavButton(word);
});

// ===== FAVORITES =====
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

favBtn.addEventListener("click", function () {
  if (!currentWordData) return;

  const index = favorites.findIndex(
    f => f.word.toLowerCase() === currentWordData.word.toLowerCase()
  );

  if (index !== -1) {
    favorites.splice(index, 1);
    showToast("Removed from Favorites 💔", "remove");
  } else {
    favorites.push(currentWordData);
    showToast("Added to Favorites ❤️", "success");
  }

  saveFavorites();
  updateFavButton(currentWordData.word);

  if (currentView === "favorites") {
    renderItems(favorites);
  }
});

function updateFavButton(word) {
  const isFav = favorites.some(
    f => f.word.toLowerCase() === word.toLowerCase()
  );

  favBtn.textContent = isFav
    ? "❤️ Remove from Favorites"
    : "❤️ Add to Favorites";

  favBtn.classList.toggle("fav-active", isFav);
}

// ===== VIEW SWITCHING =====
function clearSearch() {
  searchInput.value = "";
}

document.getElementById("showFavs").addEventListener("click", function () {
  currentView = "favorites";
  clearSearch();
  renderItems(favorites);
  togglePagination(false);
  image.src = 'images/ek-korean-heart.png';
});

document.getElementById("showAll").addEventListener("click", function () {
  currentView = "all";
  clearSearch();
  showPage(currentPage);
  updateButtons();
  togglePagination(true);
  image.src = 'images/ek-book.png';
});

// ===== TOAST =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = "toast-custom show";

  if (type === "success") {
    toast.classList.add("toast-success");
  } else if (type === "remove") {
    toast.classList.add("toast-remove");
  }

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ===== NOTIFICATIONS =====
function sendWOTDNotification(wordObj) {
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification("📅 Word of the Day", {
      body: `${wordObj.word.toUpperCase()} — ${wordObj.definition}`,
      icon: "images/android-chrome-192x192.png",
      badge: "images/favicon.ico",
      tag: "wotd",
      renotify: true
    });
  });
}

function checkDailyWOTDNotification(wordObj) {
  const today = new Date().toDateString();
  const last = localStorage.getItem("wotd_notified");

  if (last === today) return;

  sendWOTDNotification(wordObj);
  localStorage.setItem("wotd_notified", today);
}

// ===== INIT =====
checkNewDay();
loadStreak();

const wotd = getWordOfTheDay(dictionary);

document.getElementById("wotdWord").textContent = wotd.word.toUpperCase();
document.getElementById("wotdDef").textContent = wotd.definition;

checkDailyWOTDNotification(wotd);

setInterval(() => {
  const wotd = getWordOfTheDay(dictionary);
  checkDailyWOTDNotification(wotd);
}, 60 * 60 * 1000);