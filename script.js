const menuBtn = document.getElementById("MenuBtn");
const dropdownMenu = document.querySelector(".dropdown-menu");
const closeMenu = document.querySelector(".Close-menu");
const searchInput = document.getElementById("search");
const mealsContainer = document.getElementById("meals");
const grid = document.querySelector(".categories-grid");
const searchBtn = document.querySelector(".Searchicon");

// Toggle dropdown on hamburger click
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

// Prevent default anchor behavior on menu to avoid jump
document
  .querySelectorAll(".dropdown-menu a")
  .forEach((link) => link.addEventListener("click", (e) => e.preventDefault()));

// Close menu when close icon clicked
closeMenu.addEventListener("click", () => {
  dropdownMenu.style.display = "none";
});

// Add click handling to hamburger menu items to fetch and display category meals
document.querySelectorAll(".dropdown-menu a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = link.textContent.trim();

    // Close dropdown menu
    dropdownMenu.style.display = "none";

    // Fetch and display meals for clicked category
    fetchCategoryMealsFromMenu(category);
  });
});

// Load categories onto grid
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((res) => res.json())
  .then((data) => {
    data.categories.forEach((cat) => {
      const card = document.createElement("div");
      card.className = "category-card";
      card.innerHTML = `
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
        <span class="category-label">${cat.strCategory}</span>
      `;

      card.addEventListener("click", () => {
        fetchCategoryMeals(cat.strCategory, cat.strCategoryDescription);
      });

      grid.appendChild(card);
    });
  });

// Fetch meals by category for grid cards (with description)
async function fetchCategoryMeals(category, description) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    if (data.meals) {
      displayCategoryMeals(category, description, data.meals);
      mealsContainer.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    console.error("Error fetching category meals:", error);
  }
}

// Fetch meals by category from hamburger menu (no description)
async function fetchCategoryMealsFromMenu(category) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    if (data.meals) {
      displaySearchMeals(data.meals);
      mealsContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      mealsContainer.innerHTML = `
        <div class="meals-header">
          <h2>MEALS</h2>
        </div>
        <p class="no-results">No meals found in this category!</p>
      `;
      mealsContainer.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    console.error("Error fetching category meals:", error);
    mealsContainer.innerHTML =
      '<p class="no-results">Error loading meals. Please try again.</p>';
  }
}

// Display meals with category description (grid cards)
function displayCategoryMeals(category, description, meals) {
  const mealsHTML = meals
    .map(
      (meal) => `
        <div class="meal" onclick="fetchMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="meal-info">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      `
    )
    .join("");

  mealsContainer.innerHTML = `
    <div class="category-info">
      <h2 class="category-title">${category}</h2>
      <p class="category-description">${description}</p>
    </div>
    <div class="meals-header">
      <h2>MEALS</h2>
    </div>
    <div class="meals-grid">
      ${mealsHTML}
    </div>
  `;
}

// Display meals for search or menu category (no description)
function displaySearchMeals(meals) {
  const mealsHTML = meals
    .map(
      (meal) => `
        <div class="meal" onclick="fetchMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="meal-info">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      `
    )
    .join("");

  mealsContainer.innerHTML = `
    <div class="meals-header">
      <h2>MEALS</h2>
    </div>
    <div class="meals-grid">
      ${mealsHTML}
    </div>
  `;
}

// Fetch detailed info of a meal by ID
async function fetchMealDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();

    if (data.meals) {
      displayMealDetails(data.meals[0]);
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

// Display detailed meal info including ingredients and instructions
function displayMealDetails(meal) {
  const ingredients = [];
  const measures = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
      ingredients.push(meal[`strIngredient${i}`]);
      measures.push(meal[`strMeasure${i}`] || "");
    }
  }

  const ingredientsHTML = ingredients
    .map(
      (ing) => `
      <div class="ingredient-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${ing}</span>
      </div>
    `
    )
    .join("");

  const measuresHTML = measures
    .map(
      (measure) => `
      <div class="measure-item">
        <i class="fa-solid fa-spoon"></i>
        <span>${measure}</span>
      </div>
    `
    )
    .join("");

  mealsContainer.innerHTML = `
    <div class="meal-detail-container">
      <button class="back-btn" onclick="location.reload()">
        <i class="fa-solid fa-arrow-left"></i> Back
      </button>
      
      <div class="meal-detail-content">
        <div class="meal-image-section">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        
        <div class="meal-info-section">
          <h1 class="meal-title">${meal.strMeal}</h1>
          <div class="meal-meta">
            <p><strong>CATEGORY:</strong> <span class="category-tag">${
              meal.strCategory
            }</span></p>
            <p><strong>Source:</strong> ${
              meal.strSource
                ? `<a href="${meal.strSource}" target="_blank">${meal.strSource}</a>`
                : "N/A"
            }</p>
            <p><strong>Tags:</strong> <span class="meal-tag">${
              meal.strTags || "soup"
            }</span></p>
          </div>
          
          <div class="ingredients-box">
            <h3>Ingredients</h3>
            <div class="ingredients-grid">${ingredientsHTML}</div>
          </div>
        </div>
      </div>

      <div class="measures-section">
        <h3>Measure:</h3>
        <div class="measures-grid">${measuresHTML}</div>
      </div>

      <div class="instructions-section">
        <h3>Instructions:</h3>
        <div class="instructions-content">
          ${meal.strInstructions
            .split("\n")
            .map((line) =>
              line.trim()
                ? `<p><i class="fa-solid fa-square-check"></i> ${line}</p>`
                : ""
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  mealsContainer.scrollIntoView({ behavior: "smooth" });
}

// Search functionality on button click ONLY
searchBtn.addEventListener("click", async () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    alert("Please enter a search term");
    return;
  }

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );
    const data = await response.json();

    if (data.meals) {
      displaySearchMeals(data.meals);
      mealsContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      mealsContainer.innerHTML = `
        <div class="meals-header">
          <h2>MEALS</h2>
        </div>
        <p class="no-results">No meals found. Try another search!</p>
      `;
    }
  } catch (error) {
    console.error("Error fetching meals:", error);
    mealsContainer.innerHTML =
      '<p class="no-results">Error loading meals. Please try again.</p>';
  }
});

// Trigger search on Enter key
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
