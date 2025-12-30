// Quote data
// const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

/* ---------- DEFAULT QUOTES ---------- */
const defaultQuotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" }
];

/* ---------- LOAD FROM LOCAL STORAGE ---------- */
let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

/* ---------- SAVE TO LOCAL STORAGE ---------- */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ---------- DISPLAY RANDOM QUOTE ---------- */
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" (${quote.category})`;

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
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

  displayRandomQuote();
}

/* ---------- EXPORT QUOTES TO JSON ---------- */
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* ---------- IMPORT QUOTES FROM JSON ---------- */
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing JSON file.");
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

/* ---------- EVENT LISTENER ---------- */
newQuoteBtn.addEventListener("click", displayRandomQuote);

/* ---------- INITIALIZATION ---------- */
saveQuotes();
loadLastSessionQuote();
