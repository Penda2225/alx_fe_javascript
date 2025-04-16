const API_URL = "https://jsonplaceholder.typicode.com/posts";

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

function showRandomQuote(filtered = quotes) {
  const display = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    display.innerHTML = `<p>No quotes available.</p>`;
    return;
  }
  const q = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<p><strong>Quote:</strong> "${q.text}"</p><p><strong>Category:</strong> ${q.category}</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

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
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  showRandomQuote(filtered);
}

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.style.marginTop = "20px";

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  inputText.style.marginRight = "10px";

  const inputCat = document.createElement("input");
  inputCat.id = "newQuoteCategory";
  inputCat.placeholder = "Enter category";
  inputCat.style.marginRight = "10px";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.onclick = addQuote;

  container.append(inputText, inputCat, btn);
  document.body.appendChild(container);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !cat) return alert("Fill both fields.");

  const newQuote = { id: Date.now(), text, category: cat };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added.");

  // Also POST to "server"
  postQuoteToServer(newQuote);
}

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
          if (!quotes.find(local => local.id === q.id)) {
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
      alert("Error importing file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Required: fetchQuotesFromServer
async function fetchQuotesFromServer() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Simulate conversion to quote objects
  return data.slice(0, 5).map(post => ({
    id: 1000 + post.id,
    text: post.title,
    category: "Synced"
  }));
}

// ✅ Required: syncQuotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.find(local => local.id === serverQuote.id);
    if (!exists) {
      quotes.push(serverQuote);
      conflicts++;
    }
  });

  if (conflicts > 0) {
    saveQuotes();
    populateCategories();
    notifySync(`${conflicts} Quotes synced with server!`);
  }
}

// ✅ POST simulation
function postQuoteToServer(quote) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(data => {
    console.log("Posted to server:", data);
  });
}

// ✅ Notification
function notifySync(msg) {
  const el = document.getElementById("syncNotice");
  el.textContent = msg;
  setTimeout(() => (el.textContent = ""), 5000);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", () => {
    const selected = document.getElementById("categoryFilter").value;
    const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
    showRandomQuote(filtered);
  });

  createAddQuoteForm();
  populateCategories();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <p><strong>Quote:</strong> "${quote.text}"</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }

  // ✅ Start syncing every 15s
  syncQuotes();
  setInterval(syncQuotes, 15000);
});
