import { insertBlog } from './shared.js';

const params = new URLSearchParams(window.location.search);
const openBlogId = params.get('id');

let blogList = []; // Array to store available blogs
let filter = []; // Filter based on open blog categories 

// Function for inserting open blog HTML
function insertOpenBlogHTML(openBlog) {

    // Save open blog HTML
    let blogColumnHTML =`
    <img class='blog-image-big' src=${openBlog.image}>
    <p class='blog-author'>${openBlog.author}</p>
    <span class='blog-publish-date'>${openBlog.publish_date.split(" ")[0]}</span>
    <span class='blog-author-mail js-blog-author-mail'></span>
    <p class='blog-title-big'>${openBlog.title}</p>
    <div class='blog-categories js-blog-categories'></div>
    <div class='blog-text'>${openBlog.description}</div>`

    let openBlogCategoriesHTML = '' // Variable to store open blog categories

    // Iterate over blog's categories to create an HTML string
    openBlog.categories.forEach(category => {
        openBlogCategoriesHTML += `
            <p id=${category.id} style='
            color: ${category.text_color};
            background-color: ${category.background_color}'>
            ${category.name}
            </p>`;
    });

    // Create temporary DOM element for blogColumnHTML to insert openBlogCategoriesHTML and email
    const tempElement = document.createElement('div');
    tempElement.innerHTML = blogColumnHTML;

    // Add HTML for email if available
    if (openBlog.email) {
        tempElement.querySelector('.js-blog-author-mail').innerHTML =  '&bull; ' + openBlog.email;
    }

    // Add HTML for cateogries
    tempElement.querySelector('.js-blog-categories').insertAdjacentHTML('beforeend', openBlogCategoriesHTML);
    blogColumnHTML = tempElement.innerHTML;

    // Insert final HTML
    document.querySelector('.blog-column').innerHTML = blogColumnHTML;
}

// Fetch blog data
fetch('../mock.json')
    .then(response => response.json())
    .then(blogs => {
        
        // Fill blog list
        blogs.data.forEach(blog => {blogList.push(blog);})
        
        // Find relevant blog data
        const openBlog = blogList.find(blogData => blogData.id === parseInt(openBlogId, 10));
        
        // Remove opened blog from the list
        blogList.splice(blogList.findIndex(blog => blog === openBlog), 1);

        // Save open blog category ids for recommendations
        openBlog.categories.forEach(category => {
            filter.push(category.id.toString());
        });

        // Insert HTML for open blog
        insertOpenBlogHTML(openBlog);

        const insertLocation = '.js-blog-slider';
        blogList.forEach(blog => {insertBlog(blog, insertLocation, filter)});
        })



