const menuBtn = document.getElementById("MenuBtn");
const dropdownMenu = document.querySelector(".dropdown-menu");

// Toggle dropdown on hamburger click
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent immediate closing
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== menuBtn) {
    dropdownMenu.style.display = "none";
  }
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
