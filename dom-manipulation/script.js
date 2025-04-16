let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    { text: "Don’t wait. The time will never be just right.", category: "Motivation" }
  ];
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function showRandomQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
      document.getElementById("quoteDisplay").innerHTML = `<p>No quotes in this category.</p>`;
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
  
    document.getElementById("quoteDisplay").innerHTML = `
      <p><strong>Quote:</strong> "${quote.text}"</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }
  
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
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      populateCategories(); // update filter options
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
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
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON format.");
        }
      } catch (err) {
        alert("Error reading the JSON file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedBefore = categoryFilter.value;
    const categories = ["all", ...new Set(quotes.map(q => q.category))];
  
    categoryFilter.innerHTML = categories
      .map(cat => `<option value="${cat}">${cat}</option>`)
      .join("");
  
    // Restore previous selection if valid
    const lastFilter = localStorage.getItem("lastSelectedCategory");
    if (lastFilter && categories.includes(lastFilter)) {
      categoryFilter.value = lastFilter;
    }
  
    filterQuotes();
  }
  
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);
  
    if (selectedCategory === "all") {
      showRandomQuote(quotes);
    } else {
      const filtered = quotes.filter(q => q.category === selectedCategory);
      showRandomQuote(filtered);
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("newQuote").addEventListener("click", function () {
      const selected = document.getElementById("categoryFilter").value;
      if (selected === "all") {
        showRandomQuote(quotes);
      } else {
        showRandomQuote(quotes.filter(q => q.category === selected));
      }
    });
  
    createAddQuoteForm();
    populateCategories();
  
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      document.getElementById("quoteDisplay").innerHTML = `
        <p><strong>Quote:</strong> "${quote.text}"</p>
        <p><strong>Category:</strong> ${quote.category}</p>
      `;
    }
  });
  