// Quote data
// const quoteDisplay = document.getElementById("quoteDisplay");
// const quoteDisplay = document.getElementById("quoteDisplay");
//
// 

/* ===============================
   DOM REFERENCES
================================ */
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

/* ===============================
   DEFAULT QUOTES
================================ */
const defaultQuotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" }
];

/* ===============================
   LOAD & SAVE LOCAL STORAGE
================================ */
let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ===============================
   CATEGORY POPULATION
================================ */
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

/* ===============================
   DISPLAY RANDOM QUOTE
================================ */
function displayRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" (${quote.category})`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/* ===============================
   FILTER QUOTES
================================ */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayRandomQuote(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayRandomQuote(filtered);
  }
}

/* ===============================
   ADD QUOTE
================================ */
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
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
}

/* ===============================
   EXPORT QUOTES (JSON)
================================ */
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

/* ===============================
   IMPORT QUOTES (JSON)
================================ */
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) throw new Error();

      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser("Quotes imported successfully");
    } catch {
      alert("Invalid JSON file.");
    }
  };

  reader.readAsText(event.target.files[0]);
}

/* ===============================
   LOAD LAST SESSION QUOTE
================================ */
function loadLastSessionQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.textContent = `"${quote.text}" (${quote.category})`;
  }
}

/* ===============================
   SERVER SYNC (SIMULATION)
================================ */
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000;

/* ✅ REQUIRED FUNCTION NAME */
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

function syncWithServer(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Server data synced (server wins)");
  }

  updateSyncTime();
}

async function autoSync() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    syncWithServer(serverQuotes);
  } catch {
    notifyUser("Sync failed");
  }
}

function manualSync() {
  autoSync();
}

/* ===============================
   SYNC STATUS UI
================================ */
function notifyUser(message) {
  syncStatus.textContent = message;
  syncStatus.style.color = "green";
  setTimeout(() => (syncStatus.style.color = "black"), 3000);
}

function updateSyncTime() {
  const time = new Date().toLocaleTimeString();
  localStorage.setItem("lastSync", time);
  syncStatus.textContent = `Last sync: ${time}`;
}

/* ===============================
   EVENT LISTENERS
================================ */
newQuoteBtn.addEventListener("click", filterQuotes);

/* ===============================
   INITIALIZATION
================================ */
saveQuotes();
populateCategories();
loadLastSessionQuote();
filterQuotes();

const lastSync = localStorage.getItem("lastSync");
if (lastSync) syncStatus.textContent = `Last sync: ${lastSync}`;

setInterval(autoSync, SYNC_INTERVAL);
