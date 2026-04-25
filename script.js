localStorage.removeItem("dailyQuiz");
// =========================
// GLOBAL STATE
// =========================
let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentWordData = null;
let currentView = "all";

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

let dailyQuiz = JSON.parse(localStorage.getItem("dailyQuiz")) || {
  date: null,
  questions: [],
  score: 0,
  answered: 0
};

const QUIZ_KEY = "dailyQuiz";

function getToday() {
  return new Date().toDateString();
}

function getDailyQuiz() {
  const saved = JSON.parse(localStorage.getItem(QUIZ_KEY));

  if (saved && saved.date === getToday()) {
    return saved;
  }

  // RESET NEW DAY
  const questions = generateQuizQuestions(5);

 const newQuiz = {
  date: getToday(),
  questions,
  score: 0,
  answered: 0,
  completed: false,
  currentIndex: 0   // ✅ ADD THIS
};

  localStorage.setItem(QUIZ_KEY, JSON.stringify(newQuiz));
  return newQuiz;
}

// =========================
// GAME SYSTEM (XP + LEVEL)
// =========================
let game = {
  xp: parseInt(localStorage.getItem("xp")) || 0,
  level: parseInt(localStorage.getItem("level")) || 1
};

function addXP(amount) {
  game.xp += amount;

  const newLevel = Math.floor(game.xp / 100) + 1;

  if (newLevel > game.level) {
    game.level = newLevel;
    showToast(`🏆 Level Up! You are now Level ${game.level}`, "success");
  }

  localStorage.setItem("xp", game.xp);
  localStorage.setItem("level", game.level);

  updateGameUI();
}

function updateGameUI() {
  const xpEl = document.getElementById("xpDisplay");
  const lvlEl = document.getElementById("levelDisplay");

  if (xpEl) xpEl.textContent = game.xp;
  if (lvlEl) lvlEl.textContent = game.level;
}

// =========================
// COIN SYSTEM
// =========================
let coins = parseInt(localStorage.getItem("coins")) || 0;

function addCoins(amount) {
  coins += amount;
  localStorage.setItem("coins", coins);
  updateCoinsUI();
}

function updateCoinsUI() {
  const coinEl = document.getElementById("coinDisplay");
  if (coinEl) coinEl.textContent = coins;

  const coinEl2 = document.getElementById("coinCount");
  if (coinEl2) coinEl2.textContent = coins;
}

// =========================
// STREAK SYSTEM
// =========================
const streakKey = "streakData";

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
      data.count = 1;
      showToast("😢 Streak reset!", "remove");
    }
  }

  data.lastDate = today;

  localStorage.setItem(streakKey, JSON.stringify(data));
  updateStreakUI(data.count);
}

function hasUpdatedStreakToday() {
  const today = getTodayDate();
  return localStorage.getItem("streakUpdatedDate") === today;
}

function markStreakUpdatedToday() {
  localStorage.setItem("streakUpdatedDate", getTodayDate());
}

// =========================
// DOM CACHE
// =========================
const resultDiv = document.getElementById("result");
const favBtn = document.getElementById("favBtn");
const paginationDiv = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("search");
const image = document.getElementById("wotdImg");

// =========================
// LOAD DATA
// =========================
fetch("ilocano_dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionary = data;
    

    showPage(currentPage);
    updateButtons();
    togglePagination(true);

    const wotd = getWordOfTheDay(dictionary);
    document.getElementById("wotdWord").textContent = wotd.word.toUpperCase();
    document.getElementById("wotdDef").textContent = wotd.definition;

    checkDailyWOTDNotification(wotd);
  });

// =========================
// WORD OF THE DAY
// =========================
function getWordOfTheDay(dictionary) {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("wotd"));

  if (saved && saved.date === today && saved.word) {
    return saved.word;
  }

  const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];

  localStorage.setItem(
    "wotd",
    JSON.stringify({ date: today, word: randomWord })
  );

  return randomWord;
}

// =========================
// NOTIFICATIONS PERMISSION
// =========================
function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}
requestNotificationPermission();

// =========================
// PAGINATION
// =========================
function togglePagination(show) {
  paginationDiv.style.display = show ? "block" : "none";
}

function renderItems(items) {
  if (!items.length) {
    resultDiv.innerHTML = `<p class="not-found">No words found 😕</p>`;
    return;
  }

  resultDiv.innerHTML = items
    .map(
      item => `
    <div class="card"
      data-bs-toggle="modal"
      data-bs-target="#wordModal"
      data-word="${item.word}"
      data-definition="${item.definition}">
      <div class="word">${item.word.toUpperCase()}</div>
    </div>`
    )
    .join("");
}

function showPage(page) {
  currentView = "all";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  renderItems(dictionary.slice(start, end));
  renderPageNumbers(); // ✅ ADD THIS
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

function renderPageNumbers() {
  const pageNumbersDiv = document.getElementById("pageNumbers");
  const pageCount = Math.ceil(dictionary.length / itemsPerPage);

  let pages = [];

  // Always show first few pages
  for (let i = 1; i <= pageCount; i++) {
    if (
      i === 1 ||
      i === pageCount ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - 3 ||
      i === currentPage + 3
    ) {
      pages.push("...");
    }
  }

  // Remove duplicate "..."
  pages = pages.filter((item, index) => {
    return item !== "..." || pages[index - 1] !== "...";
  });

  pageNumbersDiv.innerHTML = pages
    .map(p => {
      if (p === "...") {
        return `<span style="margin:0 5px;">...</span>`;
      }

      return `
        <button 
          onclick="goToPage(${p})"
          style="margin:3px; ${
            p === currentPage ? "background:#5a67d8;" : ""
          }">
          ${p}
        </button>
      `;
    })
    .join("");
}

function goToPage(page) {
  currentPage = page;
  showPage(currentPage);
  updateButtons();
  renderPageNumbers();
}

// =========================
// SEARCH + XP + STREAK
// =========================
document
  .querySelector(".search-box button")
  .addEventListener("click", searchWord);

function searchWord() {
  addXP(5);

  if (!hasUpdatedStreakToday()) {
    const oldCount =
      JSON.parse(localStorage.getItem(streakKey))?.count || 0;

    updateStreak();
    markStreakUpdatedToday();

    const newCount =
      JSON.parse(localStorage.getItem(streakKey))?.count || 0;

    if (newCount > oldCount) {
      showToast(`🔥 ${newCount} Day Streak!`, "success");
    }
  }

  const input = searchInput.value.trim().toLowerCase();

  currentView = "search";

  const found = dictionary.filter(item =>
    item.word.toLowerCase().includes(input)
  );

  renderItems(found);
  togglePagination(false);

  if (input) saveSearchHistory(input);
}

// =========================
// MODAL
// =========================
const wordModal = document.getElementById("wordModal");

wordModal.addEventListener("show.bs.modal", function (event) {
  const trigger = event.relatedTarget;
  if (!trigger) return;

  const word = trigger.getAttribute("data-word");
  const definition = trigger.getAttribute("data-definition");

  currentWordData = { word, definition };

  addXP(2);

  document.getElementById("modalWord").textContent = word.toUpperCase();
  document.getElementById("modalDefinition").textContent = definition;

  document.getElementById(
    "modalLink"
  ).href = `https://www.google.com/search?q=how+to+use+the+word+${word}+in+a+sentence+in+ilocano`;

  updateFavButton(word);
});

// =========================
// FAVORITES
// =========================
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

favBtn.addEventListener("click", function () {
  addXP(10);
  if (!currentWordData) return;

  const index = favorites.findIndex(
    f =>
      f.word.toLowerCase() === currentWordData.word.toLowerCase()
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

// =========================
// VIEW SWITCHING
// =========================
function clearSearch() {
  searchInput.value = "";
}

document.getElementById("showFavs").addEventListener("click", () => {
  currentView = "favorites";
  clearSearch();
  renderItems(favorites);
  togglePagination(false);
  image.src = "images/ek-korean-heart.png";
});

document.getElementById("showAll").addEventListener("click", () => {
  currentView = "all";
  clearSearch();
  showPage(currentPage);
  updateButtons();
  togglePagination(true);
  image.src = "images/ek-book.png";
});

document.getElementById("showHistory").addEventListener("click", () => {
  currentView = "history";
  clearSearch();
  renderHistory();
  togglePagination(false);
  image.src = "images/ek-history.png";
});

// =========================
// TOAST
// =========================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = "toast-custom show";

  if (type === "success") toast.classList.add("toast-success");
  else if (type === "remove") toast.classList.add("toast-remove");

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// =========================
// HISTORY SYSTEM
// =========================
function saveSearchHistory(term) {
  searchHistory = searchHistory.filter(item => item !== term);
  searchHistory.unshift(term);

  if (searchHistory.length > 10) searchHistory.pop();

  localStorage.setItem(
    "searchHistory",
    JSON.stringify(searchHistory)
  );
}

function renderHistory() {
  if (!searchHistory.length) {
    resultDiv.innerHTML = `<p class="not-found">No search history🕘</p>`;
    return;
  }

  resultDiv.innerHTML =
    `
    <div style="grid-column: 1/-1; text-align:right; margin-bottom:10px;">
      <button onclick="clearHistory()">Clear History</button>
    </div>
  ` +
    searchHistory
      .map(
        item => `
    <div class="card history-card" onclick="searchFromHistory('${item}')">
      <div class="word">${item}</div>
    </div>`
      )
      .join("");
}

function searchFromHistory(term) {
  searchInput.value = term;
  searchWord();
}

function clearHistory() {
  searchHistory = [];
  localStorage.removeItem("searchHistory");
  renderHistory();
  showToast("History cleared 🧹", "remove");
}

// =========================
// NOTIFICATIONS SYSTEM
// =========================
const messages = [
  "📚 Time to learn a new Ilocano word!",
  "🔥 Keep your streak alive!",
  "💡 Did you know? Practice makes perfect!",
  "🧠 Try searching a new word today!",
  "❤️ Check your favorite words!",
  "🚀 You're doing great, keep going!",
  "📖 Expand your vocabulary today!",
  "🎯 Small steps daily = big progress!"
];

function startHourlyNotifications() {
  setInterval(sendRandomNotification, 60 * 60 * 1000 );
}

function sendRandomNotification() {
  if (Notification.permission === "granted") {
    const msg =
      messages[Math.floor(Math.random() * messages.length)];

    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.showNotification("📘 English to Ilocano Dictionary", {
          body: msg,
          icon: "images/android-chrome-192x192.png",
          badge: "images/android-chrome-192x192.png",
          vibrate: [100, 50, 100]
        });
      }
    });
  }
}

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

// =========================
// QUIZ SYSTEM
// ======================

function generateQuizQuestions(count) {
  const shuffled = [...dictionary].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map(item => {
    const correct = item.definition;

    const wrong = dictionary
      .filter(d => d.word !== item.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(d => d.definition);

    return {
      word: item.word,
      correct,
      options: [...wrong, correct].sort(() => 0.5 - Math.random())
    };
  });
}

function renderQuiz() {
  const quiz = getDailyQuiz();
  const quizDiv = document.getElementById("quiz");

  const index = quiz.currentIndex;
  const q = quiz.questions[index];

  document.getElementById("quizInfo").textContent =
    `Question ${index + 1} / ${quiz.questions.length} | Score: ${quiz.score}`;

  if (!q || !q.options) {
    quizDiv.innerHTML = `<div class="quiz-card">⚠️ Quiz error</div>`;
    return;
  }

  quizDiv.innerHTML = `
    <div class="quiz-card">
      <div><strong>${q.word.toUpperCase()}</strong></div>
      ${q.options.map(opt => `
        <button onclick="answerQuiz(\`${opt}\`)">
          ${opt}
        </button>
        </br>
      `).join("")}
    </div>
  `;
}

function answerQuiz(answer) {
  let quiz = getDailyQuiz();

  const index = quiz.currentIndex;
  const q = quiz.questions[index];

  if (!q || q.answered) return;

  q.answered = true;

  if (answer === q.correct) {
    quiz.score += 1;
    addXP(10);
    addCoins(10);
    showToast("✅ Correct!", "success");
  } else {
    showToast("❌ Wrong!", "remove");
  }

  quiz.answered++;

  // move to next question
  quiz.currentIndex++;

  const allDone = quiz.currentIndex >= quiz.questions.length;

  if (allDone) {
    quiz.completed = true;
    quiz.completedAt = new Date().toISOString();

    localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
    showFinalScore(quiz);
    return;
  }

  localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));

  // render next question
  renderQuiz();
}

document.getElementById("startQuizBtn").addEventListener("click", () => {
  if (!dictionary.length) {
    showToast("Dictionary still loading...", "remove");
    return;
  }

  let quiz = getDailyQuiz();

  // If no questions exist yet OR corrupted → regenerate
  if (!quiz.questions || quiz.questions.length === 0) {
    quiz.questions = generateQuizQuestions(5);
    quiz.score = 0;
    quiz.answered = 0;
    quiz.completed = false;

    localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
  }

  // If already completed today
  if (quiz.completed) {
    
    showFinalScore(quiz);
    return;
  }

  renderQuiz();
});

function showFinalScore(quiz) {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = `
    <div class="quiz-card" style="text-align:center;">
      <h2>🎉 Quiz Completed!</h2>
      <p>Your Score:</p>
      <h1>${quiz.score} / ${quiz.questions.length}</h1>

      <p style="margin-top:10px;color:#888;">
        Come back tomorrow for a new quiz!
      </p>
    </div>
  `;

  document.getElementById("quizInfo").textContent =
    `Completed today`;

  // disable start button
  document.getElementById("startQuizBtn").disabled = true;
  document.getElementById("startQuizBtn").textContent = "Completed";
}

function showQuizIntro() {
  const quizDiv = document.getElementById("quiz");

  quizDiv.innerHTML = `
    <div class="quiz-card" style="text-align:center; padding:30px;">
      <p style="color:#888; margin-top:10px;">
        Click <b>Start</b> to view your quiz today
      </p>
    
  `;
}

function initQuizUI() {
  const quiz = getDailyQuiz();

  const btn = document.getElementById("startQuizBtn");

  // If completed → show final screen
  if (quiz.completed) {
    showFinalScore(quiz);
    btn.disabled = true;
    btn.textContent = "Completed";
    return;
  }

  // If not started → show intro
  showQuizIntro();
  btn.disabled = false;
  btn.textContent = "Start";
}


// =========================
// INIT
// =========================
loadStreak();
updateGameUI();
initQuizUI();
updateCoinsUI();


document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }

  startHourlyNotifications();
});

setInterval(() => {
  const wotd = getWordOfTheDay(dictionary);
  checkDailyWOTDNotification(wotd);
}, 60 * 60 * 1000);

