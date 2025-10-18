const menuBtn = document.getElementById("MenuBtn");
const dropdownMenu = document.querySelector(".dropdown-menu");

// Toggle dropdown on hamburger click
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent immediate closing
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

// Optional: prevent page jump for href="#"
document.querySelectorAll(".dropdown-menu a").forEach((link) => {
  link.addEventListener("click", (e) => e.preventDefault());
});

// To close the menu bar
const closeMenu = document.querySelector(".Close-menu");
closeMenu.addEventListener("click", () => {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  dropdownMenu.style.display = "none";
});

// to get the photos from the api and load in the categories section
const grid = document.querySelector(".categories-grid");
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
      grid.appendChild(card);
    });
  });
