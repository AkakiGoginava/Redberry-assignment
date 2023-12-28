import { fetchBlogs } from "./api.js";

// Function for inserting blogs into document
export function insertBlog(blog, insertLocation, filter = []) {

    // Store list of category Ids of current blog in blogCategoryIdList
    let blogCategoryIdList = [];
    
    blog.categories.forEach(category => {
        blogCategoryIdList.push(category.id.toString());
    });

    // Filter blogs based on list of category ids in filter array
    if (filter.length === 0 || filter.some(categoryId => blogCategoryIdList.includes(categoryId))) {
        let blogContainerHTML = `
            <div class='blog-container'>
            <img class='blog-image' src=${blog.image}>
            <p class='blog-author'>${blog.author}</p>
            <p class='blog-publish-date'>${blog.publish_date.split(" ")[0]}</p>
            <p class='blog-title'>${blog.title}</p>
            <div class='blog-categories js-blog-categories'>
            </div>
            <p class='blog-description'>${blog.description}</p>
            <a class='blog-link' href='blog_page.html?id=${blog.id}'>სრულად ნახვა</a>
            </div>`;    

        let blogCategoriesHTML = '' // Variable to contain HTML for blog categories

        // Iterate over current blog's categories to create an HTML string
        blog.categories.forEach(category => {
            blogCategoriesHTML += `
                <p id=${category.id} style='
                color: ${category.text_color};
                background-color: ${category.background_color}'>
                ${category.title}
                </p>`;
        });

        // Create temporary DOM element for blogContainerHTML to insert blogCategoriesHTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = blogContainerHTML;

        // Insert blogcategoriesHTML into blogcontainerHTML
        tempElement.querySelector('.js-blog-categories').insertAdjacentHTML('beforeend', blogCategoriesHTML);
        blogContainerHTML = tempElement.innerHTML;

        // Insert blogContainer HTML into blog list
        document.querySelector(insertLocation).insertAdjacentHTML('beforeend', blogContainerHTML);
    }
}

export const insertBlog2 = (blog, insertLocation) => {
    const blogCategoriesHTML = blog
        .categories
        .map(category =>
            `
                <p id=${category.id} style='color: ${category.text_color}; background-color: ${category.background_color}'>
                    ${category.title}
                </p>
            `
        )
        .join('');
            
    // Add email if available
    let email = '';
    if (blog.email) {
        email = '&bull; ' + blog.email; 
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
  
    document.querySelector(insertLocation).insertAdjacentHTML('beforeend', blogContainerHTML);
}

export const filterBlogs = (blogs, categoryFilters) => {
    return blogs.filter(blog => {
        const blogCategoryIds = blog.categories.map(category => category.id);
        return categoryFilters.length === 0 || categoryFilters.some(categoryId => blogCategoryIds.includes(categoryId));
    })
}

export const displayBlogData = async (blogInsertLocation, categoryFilterIds) => {
    const blogs = await fetchBlogs();
  
    // Clear blog list
    document.querySelector(blogInsertLocation).innerHTML = '';
  
    // Filter blogs
    const filteredBlogs = filterBlogs(blogs.data, categoryFilterIds)
  
    filteredBlogs.forEach(blog => insertBlog2(blog, blogInsertLocation));
}
