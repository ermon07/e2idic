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

    <div class="card" data-bs-toggle="modal" data-bs-target="#${item.word.toUpperCase()}">
      <div class="word">${item.word.toUpperCase()}</div>
    </div>

  <div class="modal fade" id="${item.word.toUpperCase()}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"><div class="word">${item.word.toUpperCase()}</div></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="definition">${item.definition}</div>
      </br>
      <a class="btn btn-primary" href="https://www.google.com/search?q=how+to+use+the+word+${item.word.toUpperCase()}+in+a+sentence+in+ilokano&sca_esv=918d0965cae38051&rlz=1C1VDKB_enPH1065PH1065&sxsrf=ANbL-n4Ucy6XsxqABaPw5Cn-ce-ks68_cw%3A1774880678222&ei=pofKabqiDc-9vr0PzLbR2Qw&biw=1080&bih=1751&ved=0ahUKEwi6jeDi6ceTAxXPnq8BHUxbNMsQ4dUDCBE&uact=5&oq=how+to+use+the+word+abduct+in+a+sentence+in+ilokano&gs_lp=Egxnd3Mtd2l6LXNlcnAiM2hvdyB0byB1c2UgdGhlIHdvcmQgYWJkdWN0IGluIGEgc2VudGVuY2UgaW4gaWxva2FubzIFEAAY7wUyBRAAGO8FMgUQABjvBUjeOlCJKVjfNXACeAGQAQGYAeABoAG7EqoBBjAuMTIuMrgBA8gBAPgBAZgCBqAC-QTCAgoQABiwAxjWBBhHwgIKECEYoAEYwwQYCsICBBAhGAqYAwCIBgGQBgiSBwMyLjSgB5ZDsgcDMC40uAfyBMIHBTAuNS4xyAcMgAgA&sclient=gws-wiz-serp" role="button">Use In a Sentence</a>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
       
      </div>
    </div>
  </div>
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
      <div class="card" data-bs-toggle="modal" data-bs-target="#${item.word.toUpperCase()}">
        <div class="word">${item.word.toUpperCase()}</div>
      </div>

      <div class="modal fade" id="${item.word.toUpperCase()}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"><div class="word">${item.word.toUpperCase()}</div></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="definition">${item.definition}</div>
      </br>
      <a class="btn btn-primary" href="https://www.google.com/search?q=how+to+use+the+word+${item.word.toUpperCase()}+in+a+sentence+in+ilokano&sca_esv=918d0965cae38051&rlz=1C1VDKB_enPH1065PH1065&sxsrf=ANbL-n4Ucy6XsxqABaPw5Cn-ce-ks68_cw%3A1774880678222&ei=pofKabqiDc-9vr0PzLbR2Qw&biw=1080&bih=1751&ved=0ahUKEwi6jeDi6ceTAxXPnq8BHUxbNMsQ4dUDCBE&uact=5&oq=how+to+use+the+word+abduct+in+a+sentence+in+ilokano&gs_lp=Egxnd3Mtd2l6LXNlcnAiM2hvdyB0byB1c2UgdGhlIHdvcmQgYWJkdWN0IGluIGEgc2VudGVuY2UgaW4gaWxva2FubzIFEAAY7wUyBRAAGO8FMgUQABjvBUjeOlCJKVjfNXACeAGQAQGYAeABoAG7EqoBBjAuMTIuMrgBA8gBAPgBAZgCBqAC-QTCAgoQABiwAxjWBBhHwgIKECEYoAEYwwQYCsICBBAhGAqYAwCIBgGQBgiSBwMyLjSgB5ZDsgcDMC40uAfyBMIHBTAuNS4xyAcMgAgA&sclient=gws-wiz-serp" role="button">Use In a Sentence</a>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  </div>
</div>
     
    `).join("");
  } else {
    resultDiv.innerHTML = `<p class="not-found">Word not found</p>`;
  }
}

