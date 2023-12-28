export const fetchBlogCategories = async () => {

    // Fetch category data
    const categoriesResponse = await fetch('https://api.blog.redberryinternship.ge/api/categories')
  
    if (!categoriesResponse.ok) {
        return [];
    }
  
    return categoriesResponse.json();
  }
  
export const fetchBlogs = async () => {
    const blogsResponse = await fetch('https://api.blog.redberryinternship.ge/api/blogs', {
        headers: {
            'Authorization': `Bearer 461124bfccffbea9073153b2d1ecf01ae9dfbb9f0b37839a65aaecb384f8f029`
        }
    });
  
    if (!blogsResponse.ok) {
        return [];
    }
  
    return blogsResponse.json();
}

export const fetchBlogById = async (blogId) => {
    const blogResponse = await fetch(`https://api.blog.redberryinternship.ge/api/blogs/${blogId}`, {
        headers: {
            'Authorization': `Bearer 461124bfccffbea9073153b2d1ecf01ae9dfbb9f0b37839a65aaecb384f8f029`
        }
    });

    if (!blogResponse.ok) {
        return null;
    }

    return blogResponse.json()
}