let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentWordData = null;
let currentView = "all";

const resultDiv = document.getElementById("result");
const favBtn = document.getElementById("favBtn");

// LOAD DATA
fetch('ilocano_dictionary.json')
  .then(res => res.json())
  .then(data => {
    dictionary = data;
    showPage(currentPage);
    updateButtons();
    togglePagination(true); // show on load

    const wotd = getWordOfTheDay(dictionary);
    document.getElementById("wotdWord").textContent = wotd.word.toUpperCase();
    document.getElementById("wotdDef").textContent = wotd.definition;
  });

// WORD OF THE DAY
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

// ✅ TOGGLE PAGINATION
function togglePagination(show) {
  document.getElementById("pagination").style.display = show ? "block" : "none";
}

// ✅ RENDER FUNCTION
function renderItems(items) {
  resultDiv.innerHTML = items.length
    ? items.map(item => `
        <div class="card"
             data-bs-toggle="modal"
             data-bs-target="#wordModal"
             data-word="${item.word}"
             data-definition="${item.definition}">
          <div class="word">${item.word.toUpperCase()}</div>
        </div>
      `).join("")
    : `<p class="not-found">Word not found</p>`;
}

// PAGINATION
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

// SEARCH
document.querySelector(".search-box button")
  .addEventListener("click", searchWord);

function searchWord() {
  const input = document.getElementById("search").value.toLowerCase();
  const found = dictionary.filter(item =>
    item.word.toLowerCase().includes(input)
  );

  currentView = "search";
  renderItems(found);
  togglePagination(false); // hide
}

// MODAL
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

// FAVORITES TOGGLE
favBtn.addEventListener("click", function () {
  if (!currentWordData) return;

  const exists = favorites.find(
    f => f.word.toLowerCase() === currentWordData.word.toLowerCase()
  );

  if (exists) {
    favorites = favorites.filter(
      f => f.word.toLowerCase() !== currentWordData.word.toLowerCase()
    );
  } else {
    favorites.push(currentWordData);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  updateFavButton(currentWordData.word);

  // auto refresh favorites view
  if (currentView === "favorites") {
    renderItems(favorites);
  }
});

// UPDATE FAVORITE BUTTON
function updateFavButton(word) {
  const isFav = favorites.some(
    f => f.word.toLowerCase() === word.toLowerCase()
  );

  favBtn.textContent = isFav
    ? "❤️ Remove from Favorites"
    : "❤️ Add to Favorites";

  favBtn.classList.toggle("fav-active", isFav);
}

// VIEW SWITCHING
document.getElementById("showFavs").addEventListener("click", function () {
  currentView = "favorites";
  renderItems(favorites);
  togglePagination(false); // hide
});

document.getElementById("showAll").addEventListener("click", function () {
  currentView = "all";
  showPage(currentPage);
  updateButtons();
  togglePagination(true); // show
});