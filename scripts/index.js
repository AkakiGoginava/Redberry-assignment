let filter = [] // Array to store chosen categories to filter
let categoriesHTML = ''; // Variable to contain category HTML string for insertion 

// Fetch category data
fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(response => response.json())
    .then(categories => categories)
    // Create HTML string for category section
    .then(categories => {
        categories.data.forEach((category) => {
            categoriesHTML += `
            <button id=${category.id} class='category-button js-category-button' style='
            color:${category.text_color};
            background-color:${category.background_color};'>
            ${category.title}
            </button>`
        })
        // Insert HTML into category section to display categories
        document.querySelector('.js-categories').innerHTML = categoriesHTML;
    })
    // Make category buttons interactive
    .then(() => {
        // Iterate over each category button to add functionality
        document.querySelectorAll('.js-category-button')
            .forEach((categoryButton) => {
                categoryButton.addEventListener('click', (event) => {
                    // Add event listeners to category buttons
                    if (event.target.classList.contains('category-button-toggled')) {
                        event.target.classList.remove('category-button-toggled');
                        // Remove from filter
                        const index = filter.indexOf(`${categoryButton.id}`);
                        filter.splice(index, 1);
                        // Save the state of the category button to local storage
                        localStorage.setItem(event.target.id, 'false');
                    } else {
                        event.target.classList.add('category-button-toggled');
                        // Add to filter
                        filter.push(categoryButton.id);
                        // Save the state of the category button to local storage
                        localStorage.setItem(event.target.id, 'true');
                    }})
                    // Check the local storage for category button states
                    const state = localStorage.getItem(categoryButton.id);
                    if (state === 'true') {
                        // Update the category button state
                        categoryButton.classList.add('category-button-toggled');
                        // Update the filter
                        filter.push(categoryButton.id);
                    }
            })
    })
    .catch(error => console.error('Error:', error))

    console.log(filter)
        

