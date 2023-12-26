let filter = []; // Array to store chosen categories to filter

// Function for inserting blogs into document
function insertBlog(blog) {

    // Store list of category Ids of current blog in blogCategoryIdList
    let blogCategoryIdList = [];
    
    blog.categories.forEach(category => {
        blogCategoryIdList.push(category.id.toString());
    });

    // Filter blogs based on list of category ids in filter array
    if (filter.length === 0 || filter.some(categoryId => blogCategoryIdList.includes(categoryId))) {
        let blogContainerHTML = `
            <div id=${blog.id} class='blog-container'>
            <img class='blog-image' src=${blog.image}>
            <p class='blog-author'>${blog.author}</p>
            <p class='blog-publish-date'>${blog.publish_date.split(" ")[0]}</p>
            <p class='blog-title'>${blog.title}</p>
            <div class='blog-categories js-blog-categories'>
            </div>
            <p class='blog-description'>${blog.description}</p>
            <a class='blog-link' href=''>სრულად ნახვა</a>
            </div>`;    

        let blogCategoriesHTML = '' // Variable to contain HTML for blog categories

        // Iterate over current blog's categories to create an HTML string
        blog.categories.forEach(category => {
            blogCategoriesHTML += `
                <p id=${category.id} style='
                color: ${category.text_color};
                background-color: ${category.background_color}'>
                ${category.name}
                </p>`;
        });

        // Create temporary DOM element for blogContainerHTML to insert blogCategoriesHTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = blogContainerHTML;
        tempElement.querySelector('.js-blog-categories').insertAdjacentHTML('beforeend', blogCategoriesHTML);
        blogContainerHTML = tempElement.innerHTML;

        // Insert blogContainer HTML into blog list
        document.querySelector('.js-blog-list').insertAdjacentHTML('beforeend', blogContainerHTML);
    }
}

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
            blogs.data.forEach(blog => {insertBlog(blog)});
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
        filter.push(categoryButton.id);
    }
}

// Function for category button event listener
function categoryEventHandler(event, categoryButton) {

    // Add event listeners to category buttons
    if (event.target.classList.contains('category-button-toggled')) {
        event.target.classList.remove('category-button-toggled');
        // Remove from filter
        const index = filter.indexOf(`${categoryButton.id}`);
        filter.splice(index, 1);
        // Re-render blog list based on updated filter
        displayBlogData();
        // Save the state of the category button to local storage
        localStorage.setItem(event.target.id, 'false');
    } else {
        event.target.classList.add('category-button-toggled');
        // Add to filter
        filter.push(categoryButton.id);
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
        return displayBlogData();
    })
    .catch(error => console.error('Error:', error));

        

