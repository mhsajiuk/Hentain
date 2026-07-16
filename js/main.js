document.addEventListener('DOMContentLoaded', async () => {
    const latestGrid = document.getElementById('latest-grid');
    const hentaiGrid = document.getElementById('hentai-grid');
    const javGrid = document.getElementById('jav-grid');

    const data = await getHome();

    if (data) {
        renderCards(data.latest_episodes, latestGrid);
        renderCards(data.latest_hentai, hentaiGrid);
        renderCards(data.latest_jav, javGrid);
    } else {
        latestGrid.innerHTML = '<p>Gagal memuat data.</p>';
        hentaiGrid.innerHTML = '<p>Gagal memuat data.</p>';
        javGrid.innerHTML = '<p>Gagal memuat data.</p>';
    }

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

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
});

function renderCards(items, container) {
    if (!items || items.length === 0) {
        container.innerHTML = '<p>Belum ada rilis terbaru.</p>';
        return;
    }

    container.innerHTML = ''; // clear skeletons

    items.forEach(item => {
        // If series_name is present or slug doesn't have "episode", we might go to detail page
        // But the home API mostly gives direct episodes. We will route to detail if it's a series or stream if episode
        // For simplicity, let's route to detail.html to fetch metadata, and if it fails, maybe it's an episode.
        // Actually, usually episode slugs can just go to stream.html.
        // Let's use detail.html as a catch-all if possible, or we check if slug has 'episode'.
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
        container.appendChild(card);
    });
}
