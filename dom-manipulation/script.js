// Quote data
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Technology" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

let selectedCategory = "All";

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");
const formContainer = document.getElementById("formContainer");

// Display a random quote
function showRandomQuote() {
  let filteredQuotes =
    selectedCategory === "All"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
}

// Create category dropdown dynamically
function createCategorySelector() {
  categoryContainer.innerHTML = "";

  const label = document.createElement("label");
  label.textContent = "Select Category: ";

  const select = document.createElement("select");

  const categories = ["All", ...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    selectedCategory = select.value;
    showRandomQuote();
  });

  categoryContainer.appendChild(label);
  categoryContainer.appendChild(select);
}

// Create add-quote form dynamically
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", () => {
    addQuote();
  });

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Add new quote dynamically
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  createCategorySelector();
  showRandomQuote();
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize application
createCategorySelector();
createAddQuoteForm();
showRandomQuote();
