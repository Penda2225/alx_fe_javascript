// Step 1: Define quote data
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    { text: "Don’t wait. The time will never be just right.", category: "Motivation" }
  ];
  
  // Step 2: Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> "${quote.text}"</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
  
  // Step 3: Create the form dynamically
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
  
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.id = "newQuoteText";
    inputText.placeholder = "Enter a new quote";
  
    const inputCategory = document.createElement("input");
    inputCategory.type = "text";
    inputCategory.id = "newQuoteCategory";
    inputCategory.placeholder = "Enter quote category";
  
    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;
  
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
  
    document.body.appendChild(formContainer);
  }
  
  // Step 4: Add quote to array
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Step 5: Attach listeners and build the form
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm();
  });
  