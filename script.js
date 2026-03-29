// Default dictionary (50+ words)
let dictionary = JSON.parse(localStorage.getItem("dictionary")) || {
  "kumusta": "how are you",
  "nasayaat": "good",
  "napintas": "beautiful",
  "balay": "house",
  "ubing": "child",
  "napan": "went",
  "umay": "come",
  "mangan": "eat",
  "inum": "drink",
  "agawid": "go home",
  "kaasi": "kind",
  "napigsa": "strong",
  "bassit": "small",
  "dakkel": "big",
  "lalaki": "man",
  "babai": "woman",
  "ubing a lalaki": "boy",
  "ubing a babai": "girl",
  "adal": "study",
  "eskwela": "school",
  "maestra": "teacher",
  "estudyante": "student",
  "kaibigan": "friend",
  "pamilya": "family",
  "ina": "mother",
  "ama": "father",
  "kabsat": "sibling",
  "lola": "grandmother",
  "lolo": "grandfather",
  "rabii": "night",
  "aldaw": "day",
  "bigat": "morning",
  "malem": "afternoon",
  "init": "heat",
  "lammin": "cold",
  "danum": "water",
  "kape": "coffee",
  "tinapay": "bread",
  "kanen": "rice",
  "karne": "meat",
  "ika": "you",
  "siak": "I",
  "isuna": "he/she",
  "datayo": "we",
  "da": "they",
  "wen": "yes",
  "haan": "no",
  "anya": "what",
  "asino": "who",
  "sadino": "where",
  "kano": "when",
  "apay": "why"
};

// Save if first time
localStorage.setItem("dictionary", JSON.stringify(dictionary));

// Pagination settings
let currentPage = 1;
const itemsPerPage = 10;

// Convert dictionary to array
function getWordList() {
  return Object.entries(dictionary);
}

// Display words
function displayWords() {
  const wordList = getWordList();
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = wordList.slice(start, end);

  let html = "";

  pageItems.forEach(([ilo, eng]) => {
    html += `<p><strong>${ilo}</strong> - ${eng}</p>`;
  });

  document.getElementById("wordList").innerHTML = html;

  updatePagination(wordList.length);
}

// Pagination buttons
function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let buttons = "";

  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button onclick="goToPage(${i})">${i}</button>`;
  }

  document.getElementById("pagination").innerHTML = buttons;
}

// Go to page
function goToPage(page) {
  currentPage = page;
  displayWords();
}

// Search function
function searchWord() {
  const word = document.getElementById("searchWord").value.toLowerCase();

  if (dictionary[word]) {
    document.getElementById("meaning").innerText = dictionary[word];
  } else {
    document.getElementById("meaning").innerText = "Word not found 😢";
  }
}

// Add word
function addWord() {
  const ilo = document.getElementById("newIlokano").value.toLowerCase();
  const eng = document.getElementById("newEnglish").value;

  if (!ilo || !eng) {
    alert("Fill both fields");
    return;
  }

  dictionary[ilo] = eng;
  localStorage.setItem("dictionary", JSON.stringify(dictionary));

  alert("Word added!");

  displayWords();
}

// Load on start
displayWords();