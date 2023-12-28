import { insertBlog2, displayBlogData } from './shared/shared.js';
import { fetchBlogById } from './shared/api.js';

// const params = new URLSearchParams(window.location.search);
// const openBlogId = params.get('id');

// // Fetch blog data
// fetch('../mock.json')
//     .then(response => response.json())
//     .then(blogs => {
        
//         // Fill blog list
//         blogs.data.forEach(blog => {blogList.push(blog);})
        
//         // Find relevant blog data
//         const openBlog = blogList.find(blogData => blogData.id === parseInt(openBlogId, 10));
        
//         // Remove opened blog from the list
//         blogList.splice(blogList.findIndex(blog => blog === openBlog), 1);

//         // Save open blog category ids for recommendations
//         openBlog.categories.forEach(category => {
//             filter.push(category.id.toString());
//         });

//         const insertLocation2 = '.blog-column';
//         // Insert HTML for open blog
//         insertBlog2(openBlog, insertLocation2);

//         const insertLocation = '.js-blog-slider';
//         blogList.forEach(blog => {insertBlog(blog, insertLocation, filter)});
//         })

// Initialize function
(async () => {

    const params = new URLSearchParams(window.location.search);
    const openBlogId = params.get('id');

    // Fetch and insert open blog
    const openBlog = await fetchBlogById(openBlogId);
    const insertOpenBlogLocation = '.blog-column';
    insertBlog2(openBlog, insertOpenBlogLocation);

    // Fetch and insert blog recommendations based on open blog categories
    const openBlogCategories = openBlog.categories.map(category => category.id);
    await displayBlogData('.js-blog-slider', openBlogCategories);
    
    // Remove open blog from blog recommendations
    const blogSlider = document.getElementById('js-blog-slider');
    if (blogSlider.children.length) {
        blogSlider.removeChild(blogSlider.querySelector(`#_${openBlogId}`));
    }
})()

