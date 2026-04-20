let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;

// Load JSON
fetch('ilocano_dictionary.json')
  .then(res => res.json())
  .then(data => {
    dictionary = data;

    showPage(currentPage);
    updateButtons();

    // WORD OF THE DAY
    const wotd = getWordOfTheDay(dictionary);

    document.getElementById("wotdWord").textContent = wotd.word.toUpperCase();
    document.getElementById("wotdDef").textContent = wotd.definition;
  });

// Word of the Day

function getWordOfTheDay(dictionary) {
  const today = new Date().toDateString();

  // check saved word
  const saved = JSON.parse(localStorage.getItem("wotd"));

  if (saved && saved.date === today) {
    return saved.word;
  }

  // pick new word
  const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];

  localStorage.setItem("wotd", JSON.stringify({
    date: today,
    word: randomWord
  }));

  return randomWord;
}

// Modal event listener
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

});


// Show current page
function showPage(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = dictionary.slice(start, end);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = pageItems.map(item => `
  <div class="card"
       data-bs-toggle="modal"
       data-bs-target="#wordModal"
       data-word="${item.word}"
       data-definition="${item.definition}">
    <div class="word">${item.word.toUpperCase()}</div>
  </div>
`).join("");

}

// Update Next/Previous button state
function updateButtons() {
  const pageCount = Math.ceil(dictionary.length / itemsPerPage);
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === pageCount;
}

// Next page
function nextPage() {
  const pageCount = Math.ceil(dictionary.length / itemsPerPage);
  if (currentPage < pageCount) {
    currentPage++;
    showPage(currentPage);
    updateButtons();
  }
}

// Previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
    updateButtons();
  }
}

// Search (ignores pagination)
function searchWord() {
  const input = document.getElementById("search").value.toLowerCase();
  const found = dictionary.filter(item => item.word.toLowerCase().includes(input));

  const resultDiv = document.getElementById("result");
  if (found.length > 0) {
    
    resultDiv.innerHTML = found.map(item => `
  <div class="card"
       data-bs-toggle="modal"
       data-bs-target="#wordModal"
       data-word="${item.word}"
       data-definition="${item.definition}">
    <div class="word">${item.word.toUpperCase()}</div>
  </div>
`).join("");
  } else {
    resultDiv.innerHTML = `<p class="not-found">Word not found</p>`;
  }
}

// ADD TO FAVORITES

function renderItems(items) {
  const resultDiv = document.getElementById("result");

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

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentWordData = null;

const favBtn = document.getElementById("favBtn");

favBtn.addEventListener("click", function () {
  if (!currentWordData) return;

  const exists = favorites.find(f => f.word === currentWordData.word);

  if (exists) {
    favorites = favorites.filter(f => f.word !== currentWordData.word);
  } else {
    favorites.push(currentWordData);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavButton(currentWordData.word);
});

function updateFavButton(word) {
  const isFav = favorites.some(f => f.word === word);

  favBtn.textContent = isFav ? "❤️ Remove from Favorites" : "❤️ Add to Favorites";
  favBtn.classList.toggle("fav-active", isFav);
  renderItems(favorites);
}

document.getElementById("showFavs").addEventListener("click", function () {
  renderItems(favorites);
});

document.getElementById("showAll").addEventListener("click", function () {
  showPage(currentPage);
});