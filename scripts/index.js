import { loginStatusKeyName } from "./login.js";
import {
  categoryFilterKeyName,
  getCategoryFiltersFromLocalSotrage,
  displayBlogData,
} from "./shared/shared.js";
import { fetchBlogCategories } from "./shared/api.js";

const addCategoryButtonClickEvent = (categoryButton) => {
  categoryButton.addEventListener("click", (event) => {
    const isToggled = event.target.classList.contains(
      "category-button-toggled"
    );

    // update category filter in local storage
    const filter = JSON.parse(localStorage.getItem(categoryFilterKeyName));
    const id = categoryButton.id;

    // toggle border on category button
    if (isToggled) {
      if (filter.includes(id)) {
        filter.splice(filter.indexOf(id), 1);
      }

      event.target.classList.remove("category-button-toggled");
    } else {
      if (!filter.includes(id)) {
        filter.push(id);
      }

      event.target.classList.add("category-button-toggled");
    }

    localStorage.setItem(categoryFilterKeyName, JSON.stringify(filter));

    // Re-render blog list based on updated filter
    displayBlogData(getCategoryFiltersFromLocalSotrage());
  });
};

// Initalize function
(async () => {
  const isAuthenticated =
    JSON.parse(localStorage.getItem(loginStatusKeyName)) ?? false;

  // Check local storage for user state
  if (isAuthenticated) {
    document.querySelector(".login-button").textContent = "დაამატე ბლოგი";
  }

  // Check if {categoryFilterKeyName} exists in local storage (must always exist)
  if (!localStorage.getItem(categoryFilterKeyName)) {
    localStorage.setItem(categoryFilterKeyName, JSON.stringify([]));
  }

  const categories = await fetchBlogCategories();

  // Display categories
  categories.data.forEach((category) => {
    const button = document.createElement("button");

    button.id = category.id;
    button.textContent = category.title;
    button.style.color = category.text_color;
    button.style.backgroundColor = category.background_color;
    button.classList.add("category-button", "js-category-button");

    document.querySelector(".js-categories").append(button);
  });

  // First get filters and render category buttons accoringly
  const categoryFilterIds = getCategoryFiltersFromLocalSotrage();
  // const categoryFilters = JSON.parse(localStorage.getItem(categoryFilterKeyName))

  document.querySelectorAll(".js-category-button").forEach((categoryButton) => {
    // If category id exists add border on button (only ui change)
    if (categoryFilterIds.includes(parseInt(categoryButton.id))) {
      categoryButton.classList.add("category-button-toggled");
    }

    addCategoryButtonClickEvent(categoryButton);
  });

  // Fetch and display blog data
  await displayBlogData(getCategoryFiltersFromLocalSotrage());
})();
