// Quote data
// const quoteDisplay = document.getElementById("quoteDisplay");
// const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

/* ---------- DEFAULT QUOTES ---------- */
const defaultQuotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" }
];

/* ---------- LOAD QUOTES ---------- */
let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

/* ---------- SAVE QUOTES ---------- */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ---------- POPULATE CATEGORIES ---------- */
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

/* ---------- DISPLAY RANDOM QUOTE ---------- */
function displayRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" (${quote.category})`;

  // Save last viewed quote (session storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/* ---------- FILTER QUOTES ---------- */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayRandomQuote(quotes);
  } else {
    const filteredQuotes = quotes.filter(
      q => q.category === selectedCategory
    );
    displayRandomQuote(filteredQuotes);
  }
}

/* ---------- ADD QUOTE ---------- */
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();
}

/* ---------- EXPORT QUOTES ---------- */
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* ---------- IMPORT QUOTES ---------- */
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();

      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* ---------- LOAD LAST SESSION QUOTE ---------- */
function loadLastSessionQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.textContent = `"${quote.text}" (${quote.category})`;
  }
}

/* ---------- EVENTS ---------- */
newQuoteBtn.addEventListener("click", filterQuotes);

/* ---------- INIT ---------- */
saveQuotes();
populateCategories();
loadLastSessionQuote();
filterQuotes();
