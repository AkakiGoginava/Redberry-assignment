import { insertBlog, displayBlogData } from "./shared/shared.js";
import { fetchBlogById } from "./shared/api.js";

// Initialize function
(async () => {
  const blogPageElements = {
    returnButton: document.querySelector(".return-button"),
    sliderNextButton: document.querySelector(".blog-slider.next"),
    silderPrevButton: document.querySelector(".blog-slider-prev"),
  };

  const params = new URLSearchParams(window.location.search);
  const openBlogId = params.get("id");

  // Fetch and insert open blog
  const openBlog = await fetchBlogById(openBlogId);
  const insertOpenBlogLocation = ".blog-column";
  insertBlog(openBlog, insertOpenBlogLocation);

  // Fetch and insert blog recommendations based on open blog categories
  const openBlogCategories = openBlog.categories.map((category) => category.id);
  await displayBlogData(openBlogCategories, ".js-blog-slider");

  // Remove open blog from blog slider
  const blogSlider = document.getElementById("js-blog-slider");
  if (blogSlider.children.length) {
    blogSlider.removeChild(blogSlider.querySelector(`#_${openBlogId}`));
  }

  // Add event listeners
  blogPageElements.returnButton.addEventListener("click", () =>
    window.history.back()
  );
})();
