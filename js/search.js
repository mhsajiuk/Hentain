let currentPage = 1;
let currentQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentQuery = urlParams.get('q');
    const searchGrid = document.getElementById('search-grid');
    const searchTitle = document.getElementById('search-title');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (currentQuery) {
        searchInput.value = currentQuery;
        searchTitle.textContent = `Hasil Pencarian: "${currentQuery}"`;
        await fetchAndRenderSearch(searchGrid, loadMoreBtn);
    } else {
        searchTitle.textContent = `Masukkan kata kunci pencarian`;
        searchGrid.innerHTML = '';
    }

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    loadMoreBtn.addEventListener('click', async () => {
        currentPage++;
        loadMoreBtn.textContent = 'Memuat...';
        loadMoreBtn.disabled = true;
        await fetchAndRenderSearch(searchGrid, loadMoreBtn, true);
        loadMoreBtn.textContent = 'Muat Lebih Banyak';
        loadMoreBtn.disabled = false;
    });
});

async function fetchAndRenderSearch(grid, btn, append = false) {
    if (!append) {
        grid.innerHTML = '<div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>';
    }

    const data = await searchAnime(currentQuery, currentPage);

    if (!append) {
        grid.innerHTML = '';
    }

    // Depending on API response, it might be an array or { results: [] }
    let items = Array.isArray(data) ? data : data.results || data.data;

    if (!items || items.length === 0) {
        if (!append) {
            grid.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
        }
        btn.style.display = 'none';
        return;
    }

    items.forEach(item => {
        const isEpisode = item.slug.includes('-episode-');
        const link = isEpisode ? `stream.html?slug=${item.slug}` : `detail.html?slug=${item.slug}`;

        const card = document.createElement('a');
        card.className = 'card';
        card.href = link;
        
        card.innerHTML = `
            <img class="card-img" src="${item.thumbnail || 'https://via.placeholder.com/300x169?text=No+Image'}" alt="${item.title}" loading="lazy">
            <div class="card-content">
                <div class="card-title">${item.title}</div>
                <div class="card-date">${item.date || ''}</div>
            </div>
        `;
        grid.appendChild(card);
    });

    // If less than say 10 items, hide the load more button
    if (items.length < 10) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-block';
    }
}
