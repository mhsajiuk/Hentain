const API_BASE = 'https://www.sankavollerei.web.id/anime/nekopoi';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        return null;
    }
}

// Get Home Page Data
async function getHome() {
    return await fetchAPI('/home');
}

// Get Series Detail
async function getDetail(slug) {
    return await fetchAPI(`/detail/${slug}`);
}

// Get Stream Links
async function getStream(slug) {
    return await fetchAPI(`/episode/${slug}`);
}

// Search
async function searchAnime(query, page = 1) {
    return await fetchAPI(`/search?q=${query}&page=${page}`);
}
