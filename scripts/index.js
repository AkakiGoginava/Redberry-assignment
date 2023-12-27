import { insertBlog } from './shared.js';

let categoryFilter = []; // Array to store chosen categories to filter

// Function for fetching and displaying blog data 
function displayBlogData() {
        
    //Fetch blog data
    return fetch('https://api.blog.redberryinternship.ge/api/blogs', {
            headers: {
                'Authorization': `Bearer 461124bfccffbea9073153b2d1ecf01ae9dfbb9f0b37839a65aaecb384f8f029`
            }})
        .then(response => response.json())
        .then(blogs => {

            // Clear blog list HTML from previous contents
            document.querySelector('.js-blog-list').innerHTML = '';

            // Create and insert HTML string for blogs
            const insertLocation = '.js-blog-list';
            blogs.data.forEach(blog => {insertBlog(blog, insertLocation, categoryFilter)});
        })
}

// Function for displaying categories' data
function displayCagetoriesData(categories) {

    // Create HTML string for category section
    let categoriesHTML = ''; // Variable to contain category HTML string for insertion 

        categories.data.forEach(category => {
            categoriesHTML += `
                <button id=${category.id} class='category-button js-category-button' style='
                color:${category.text_color};
                background-color:${category.background_color};'>
                ${category.title}
                </button>`;
        });

        // Insert HTML into category section to display categories
        document.querySelector('.js-categories').innerHTML = categoriesHTML;
}

// Function for loading local storage for category button states and filter
function loadLocalStorage(categoryButton) {

    const state = localStorage.getItem(categoryButton.id);
    if (state === 'true') {
    
        // Update the category button state and filter
        categoryButton.classList.add('category-button-toggled');
        categoryFilter.push(categoryButton.id);
    }
}

// Function for category button event listener
function categoryEventHandler(event, categoryButton) {

    // Add event listeners to category buttons
    if (event.target.classList.contains('category-button-toggled')) {
        event.target.classList.remove('category-button-toggled');
        // Remove from filter
        const index = categoryFilter.indexOf(`${categoryButton.id}`);
        categoryFilter.splice(index, 1);
        // Re-render blog list based on updated filter
        displayBlogData();
        // Save the state of the category button to local storage
        localStorage.setItem(event.target.id, 'false');
    } else {
        event.target.classList.add('category-button-toggled');
        // Add to filter
        categoryFilter.push(categoryButton.id);
        // Re-render blog list based on updated filter
        displayBlogData();
        // Save the state of the category button to local storage
        localStorage.setItem(event.target.id, 'true');
    };
}

// Fetch category data
fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(response => response.json())
    .then(categories => {

        // Display categories
        displayCagetoriesData(categories);

        // Iterate over each category button to add functionality
        document.querySelectorAll('.js-category-button')
            .forEach((categoryButton) => {
                categoryButton.addEventListener('click', (event) => {categoryEventHandler(event, categoryButton)});
                
                loadLocalStorage(categoryButton)
            })
        
        // Fetch and display blog data
        displayBlogData();
    })
    .catch(error => console.error('Error:', error));

        

