// Load from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    { text: "Don’t wait. The time will never be just right.", category: "Motivation" }
  ];
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> "${quote.text}"</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  
    // Save to session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }
  
  // Dynamically create quote form
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.style.marginTop = "20px";
  
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.id = "newQuoteText";
    inputText.placeholder = "Enter a new quote";
    inputText.style.marginRight = "10px";
  
    const inputCategory = document.createElement("input");
    inputCategory.type = "text";
    inputCategory.id = "newQuoteCategory";
    inputCategory.placeholder = "Enter quote category";
    inputCategory.style.marginRight = "10px";
  
    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;
  
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
  
    document.body.appendChild(formContainer);
  }
  
  // Add a quote to array and localStorage
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
  
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Export quotes to JSON file
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  // Import quotes from uploaded JSON
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
  
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid file format: JSON must be an array of quote objects.");
        }
      } catch (err) {
        alert("Error reading or parsing the JSON file.");
      }
    };
  
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Setup app on load
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm();
  
    // Show last viewed quote from sessionStorage
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      document.getElementById("quoteDisplay").innerHTML = `
        <p><strong>Quote:</strong> "${quote.text}"</p>
        <p><strong>Category:</strong> ${quote.category}</p>
      `;
    }
  });
  