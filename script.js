const toggleBtn = document.getElementById('dark-mode-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

const unitTypeEl = document.getElementById("unit-type");
const fromUnitEl = document.getElementById("from-unit");
const toUnitEl = document.getElementById("to-unit");
const inputValueEl = document.getElementById("input-value");
const resultEl = document.getElementById("conversion-result");
const historyList = document.getElementById("history-list");
const favoritesList = document.getElementById("favorites-list");
const convertSound = document.getElementById("convert-sound");
const addFavoriteBtn = document.getElementById("add-favorite");
const unitOptions = {
  length: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Mile", "Yard", "Foot", "Inch"],
  weight: ["Kilogram", "Gram", "Pound", "Ounce"],
  time: ["Second", "Minute", "Hour", "Day"],
  volume: ["Liter", "Milliliter", "Gallon", "Cubic meter"],
  area: ["Square meter", "Square kilometer", "Square foot", "Square mile"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};
const conversionFormulas = {
  length: {
    Meter: 1, Kilometer: 0.001, Centimeter: 100, Millimeter: 1000, Mile: 0.000621371, Yard: 1.09361, Foot: 3.28084, Inch: 39.3701
  },
  weight: {
    Kilogram: 1, Gram: 1000, Pound: 2.20462, Ounce: 35.274
  },
  time: {
    Second: 1, Minute: 1 / 60, Hour: 1 / 3600, Day: 1 / 86400
  },
  volume: {
    Liter: 1, Milliliter: 1000, Gallon: 0.264172, "Cubic meter": 0.001
  },
  area: {
    "Square meter": 1, "Square kilometer": 0.000001, "Square foot": 10.7639, "Square mile": 3.861e-7
  }
};
// Populate units
function populateUnits() {
  const type = unitTypeEl.value;
  fromUnitEl.innerHTML = "";
  toUnitEl.innerHTML = "";
  unitOptions[type].forEach(unit => {
    const opt1 = document.createElement("option");
    opt1.value = opt1.textContent = unit;
    const opt2 = opt1.cloneNode(true);
    fromUnitEl.appendChild(opt1);
    toUnitEl.appendChild(opt2);
  });
}
// Main conversion function
function convert() {
  const type = unitTypeEl.value;
  const from = fromUnitEl.value;
  const to = toUnitEl.value;
  const input = parseFloat(inputValueEl.value);

  if (isNaN(input)) {
    resultEl.textContent = "Please enter a valid number.";
    return;
  }
  let result;

  if (type === "temperature") {
    result = convertTemperature(input, from, to);
  } else {
    const fromRate = conversionFormulas[type][from];
    const toRate = conversionFormulas[type][to];
    result = (input / fromRate) * toRate;
  }
  resultEl.textContent = `${input} ${from} = ${result.toFixed(2)} ${to}`;
  convertSound.play();

  saveToHistory({ type, from, to, input, result: result.toFixed(2) });
}
// Temperature conversion
function convertTemperature(value, from, to) {
  if (from === to) return value;
  if (from === "Celsius") {
    return to === "Fahrenheit" ? value * 9 / 5 + 32 : value + 273.15;
  } else if (from === "Fahrenheit") {
    return to === "Celsius" ? (value - 32) * 5 / 9 : (value - 32) * 5 / 9 + 273.15;
  } else { // Kelvin
    return to === "Celsius" ? value - 273.15 : (value - 273.15) * 9 / 5 + 32;
  }
}
// Save to history
function saveToHistory(entry) {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  history.unshift(entry);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem("conversionHistory", JSON.stringify(history));
  displayHistory();
}
// Display history
function displayHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  historyList.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.input} ${entry.from} = ${entry.result} ${entry.to}`;
    historyList.appendChild(li);
  });
}
// Save to favorites
function saveToFavorites() {
  const type = unitTypeEl.value;
  const from = fromUnitEl.value;
  const to = toUnitEl.value;
  const input = parseFloat(inputValueEl.value);
  const resultText = resultEl.textContent;

  if (!resultText || isNaN(input)) return;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push({ type, from, to, input, result: resultText });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}
// Display favorites
function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesList.innerHTML = "";
  favorites.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = entry.result;
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displayFavorites();
    };
    li.appendChild(delBtn);
    favoritesList.appendChild(li);
  });
}
// Script from previous response
// Add clear buttons functionality here at the bottom

document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem("conversionHistory");
    displayHistory();
  });
  
  document.getElementById("clear-favorites").addEventListener("click", () => {
    localStorage.removeItem("favorites");
    displayFavorites();
  }); 
// Event bindings
unitTypeEl.addEventListener("change", populateUnits);
document.getElementById("convert-btn").addEventListener("click", convert);
addFavoriteBtn.addEventListener("click", saveToFavorites);
// Init
populateUnits();
displayHistory();
displayFavorites();
