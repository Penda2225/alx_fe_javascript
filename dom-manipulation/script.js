// Local + mock "server" setup
const SERVER_API_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulating with posts
let quotes = JSON.parse(localStorage.getItem("quotes")) || getDefaultQuotes();

function getDefaultQuotes() {
  return [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { id: 3, text: "Get busy living or get busy dying.", category: "Life" },
    { id: 4, text: "Don’t wait. The time will never be just right.", category: "Motivation" }
  ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show quote
function showRandomQuote(filteredQuotes = quotes) {
  const display = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    display.innerHTML = `<p>No quotes available for this category.</p>`;
    return;
  }

  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  display.innerHTML = `<p><strong>Quote:</strong> "${random.text}"</p><p><strong>Category:</strong> ${random.category}</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const current = select.value;
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");

  const saved = localStorage.getItem("lastSelectedCategory");
  if (saved && categories.includes(saved)) select.value = saved;

  filterQuotes();
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", category);
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  showRandomQuote(filtered);
}

function createAddQuoteForm() {
  const form = document.createElement("div");
  form.style.marginTop = "20px";

  const inputText = document.createElement("input");
  inputText.placeholder = "Enter a new quote";
  inputText.id = "newQuoteText";
  inputText.style.marginRight = "10px";

  const inputCat = document.createElement("input");
  inputCat.placeholder = "Enter quote category";
  inputCat.id = "newQuoteCategory";
  inputCat.style.marginRight = "10px";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  form.append(inputText, inputCat, addBtn);
  document.body.appendChild(form);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !cat) return alert("Fill both fields.");

  const newQuote = {
    id: Date.now(), // Unique ID
    text,
    category: cat
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added.");
}

// JSON I/O
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        imported.forEach(q => {
          if (!quotes.find(existing => existing.id === q.id)) {
            quotes.push(q);
          }
        });
        saveQuotes();
        populateCategories();
        alert("Quotes imported.");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Could not import file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// 🔄 Simulated server sync every 15 seconds
async function syncWithServer() {
  try {
    const res = await fetch(SERVER_API_URL);
    const serverData = await res.json();

    // Simulate quotes from server (limit to 5 for demo)
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      id: 1000 + post.id, // use 1000+ to avoid collision
      text: post.title,
      category: "Synced"
    }));

    let conflictCount = 0;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.find(local => local.id === serverQuote.id);
      if (!exists) {
        quotes.push(serverQuote);
        conflictCount++;
      }
    });

    if (conflictCount > 0) {
      saveQuotes();
      populateCategories();
      document.getElementById("syncNotice").textContent = `${conflictCount} new quotes synced from server.`;
      setTimeout(() => {
        document.getElementById("syncNotice").textContent = "";
      }, 5000);
    }
  } catch (err) {
    console.error("Sync failed", err);
  }
}

// 🚀 On Load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("newQuote").addEventListener("click", () => {
    const category = document.getElementById("categoryFilter").value;
    const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
    showRandomQuote(filtered);
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

  syncWithServer(); // Initial sync
  setInterval(syncWithServer, 15000); // Periodic sync every 15s
});
