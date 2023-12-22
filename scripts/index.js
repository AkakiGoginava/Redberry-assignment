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
        document.querySelectorAll('.js-category-button')
            .forEach((categoryButton) => {
                // Check the local storage for button states         
                const state = localStorage.getItem(categoryButton.id);
                if (state === 'true') {
                    categoryButton.classList.add('category-button-toggled');
                } else if (state === 'false') {
                    categoryButton.classList.remove('category-button-toggled');
                }
                // Add event listeners to category buttons
                categoryButton.addEventListener('click', (event) => {
                    if (event.target.classList.contains('category-button-toggled')) {
                        event.target.classList.remove('category-button-toggled');
                        // Save the state of the button to local storage
                        localStorage.setItem(event.target.id, 'false');
                    } else {
                        event.target.classList.add('category-button-toggled');
                        // Save the state of the button to local storage
                        localStorage.setItem(event.target.id, 'true');
                    }})
            })
    })
    .catch(error => console.error('Error:', error))
        

