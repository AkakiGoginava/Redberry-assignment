let categoriesHTML = ''; // Variable to contain category HTML string for insertion 

// Fetch category data
fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(response => response.json())
    .then(categories => categories)
    // Create HTML string for category section
    .then(categories => {
        categories.data.forEach((category) => {
            categoriesHTML += `
            <button class='category-button js-category-button' style='
            color:${category.text_color};
            background-color:${category.background_color};'>
            ${category.title}
            </button>`
        })
        // Insert HTML into category section to display categories
        document.querySelector('.js-categories').innerHTML = categoriesHTML;
    })
    //Make category buttons interactive
    .then(() => {
        document.querySelectorAll('.js-category-button')
            .forEach((button) => {
                button.addEventListener('click', (event) => {
                    if (event.target.classList.contains('category-button-toggled')) {
                        event.target.classList.remove('category-button-toggled')
                    } else {
                        event.target.classList.add('category-button-toggled')
                    }})
            })
    })
    .catch(error => console.error('Error:', error))
        

