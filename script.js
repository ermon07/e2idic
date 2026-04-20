let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentWordData = null;
let currentView = "all";

// ===== DOM CACHE =====
const resultDiv = document.getElementById("result");
const favBtn = document.getElementById("favBtn");
const paginationDiv = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("search");

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

  if (saved && saved.date === today) return saved.word;

  const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];

  localStorage.setItem("wotd", JSON.stringify({
    date: today,
    word: randomWord
  }));

  return randomWord;
}

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

// ===== SEARCH (BUTTON ONLY) =====
document.querySelector(".search-box button")
  .addEventListener("click", searchWord);

function searchWord() {
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
  } else {
    favorites.push(currentWordData);
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
});

document.getElementById("showAll").addEventListener("click", function () {
  currentView = "all";
  clearSearch();
  showPage(currentPage);
  updateButtons();
  togglePagination(true);
});

