import { fetchBlogs } from "./api.js";
export const categoryFilterKeyName = "categoryFilter";
export const emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@redberry.ge/); // Regex for email pattern

export const getCategoryFiltersFromLocalSotrage = () => {
  const categoryIdStringArr = JSON.parse(
    localStorage.getItem(categoryFilterKeyName)
  );
  return categoryIdStringArr.map((e) => parseInt(e));
};

export const insertBlog = (blog, insertLocation) => {
  const blogCategoriesHTML = blog.categories
    .map(
      (category) =>
        `
                <p id=${category.id} style='color: ${category.text_color}; background-color: ${category.background_color}'>
                    ${category.title}
                </p>
            `
    )
    .join("");

  // Add email if available
  let email = "";
  if (blog.email) {
    email = "&bull; " + blog.email;
  }

  const blogContainerHTML = `
        <div id='_${blog.id}' class='blog-container'>
            <img class='blog-image' src=${blog.image}>
    
            <p class='blog-author'>
                 ${blog.author}
            </p>
    
            <p class='blog-publish-date'>
                 ${blog.publish_date.split(" ")[0]}
                 ${email}
            </p>
    
            <p class='blog-title'>
                 ${blog.title}
            </p>
    
            <div class='blog-categories js-blog-categories'>
                ${blogCategoriesHTML}
            </div>
    
            <p class='blog-description'>
                ${blog.description}
            </p>
    
            <a class='blog-link' href='blog_page.html?id=${blog.id}'>
                სრულად ნახვა
            </a>
        </div>
        `;

  document
    .querySelector(insertLocation)
    .insertAdjacentHTML("beforeend", blogContainerHTML);
};

export const filterBlogs = (blogs, categoryFilters) => {
  return blogs.filter((blog) => {
    const blogCategoryIds = blog.categories.map((category) => category.id);
    return (
      categoryFilters.length === 0 ||
      categoryFilters.some((categoryId) => blogCategoryIds.includes(categoryId))
    );
  });
};

export const displayBlogData = async (
  categoryFilterIds,
  blogInsertLocation = ".js-blog-list"
) => {
  const blogs = await fetchBlogs();

  // Clear blog list
  document.querySelector(blogInsertLocation).innerHTML = "";

  // Filter blogs
  const filteredBlogs = filterBlogs(blogs.data, categoryFilterIds);

  filteredBlogs.forEach((blog) => insertBlog(blog, blogInsertLocation));
};
