let categoriesHTML = '';
// Fetch category data
fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(response => response.json())
    .then(categories => categories)
    // Create HTML string for category section
    .then(categories => {
        categories.data.forEach((category) => {
            categoriesHTML += `
            <button class='category-button' style='
            color:${category.text_color};
            background-color:${category.background_color};'>
            ${category.title}
            </button>`
        })
        // Insert HTML into category section to display categories
        document.querySelector('.js-categories').innerHTML = categoriesHTML;
    })
    .catch(error => console.error('Error:', error))
        

