const baseUrl = "https://api.blog.redberryinternship.ge/api";
const authHeaders = {
  Authorization: `Bearer 461124bfccffbea9073153b2d1ecf01ae9dfbb9f0b37839a65aaecb384f8f029`,
};

export const fetchBlogCategories = async () => {
  const categoriesResponse = await fetch(`${baseUrl}/categories`);

  if (!categoriesResponse.ok) {
    return [];
  }

  return categoriesResponse.json();
};

export const fetchBlogs = async () => {
  const blogsResponse = await fetch(`${baseUrl}/blogs`, {
    headers: authHeaders,
  });

  if (!blogsResponse.ok) {
    return [];
  }

  return blogsResponse.json();
};

export const fetchBlogById = async (blogId) => {
  const blogResponse = await fetch(`${baseUrl}/blogs/${blogId}`, {
    headers: authHeaders,
  });

  if (!blogResponse.ok) {
    return null;
  }

  return blogResponse.json();
};
