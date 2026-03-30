
let dictionary = [];
let currentPage = 1;
const itemsPerPage = 10;

// Load JSON
fetch('ilocano_dictionary.json')
  .then(response => response.json())
  .then(data => {
    dictionary = data;
    showPage(currentPage);
    updateButtons();
  });

// Show current page
function showPage(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = dictionary.slice(start, end);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = pageItems.map(item => `
    <div class="card">
      <div class="word">${item.word}</div>
      <div class="definition">${item.definition}</div>
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
      <div class="card">
        <div class="word">${item.word}</div>
        <div class="definition">${item.definition}</div>
      </div>
    `).join("");
  } else {
    resultDiv.innerHTML = `<p class="not-found">Word not found</p>`;
  }
}

