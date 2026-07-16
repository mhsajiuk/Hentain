document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const content = document.getElementById('detail-content');

    if (!slug) {
        content.innerHTML = '<p>Series tidak ditemukan.</p>';
        return;
    }

    const data = await getDetail(slug);

    if (data) {
        let tagsHtml = '';
        if (data.genres && Array.isArray(data.genres)) {
            tagsHtml = data.genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
        }

        let episodesHtml = '';
        if (data.episodes && Array.isArray(data.episodes)) {
            episodesHtml = data.episodes.map(ep => `
                <a href="stream.html?slug=${ep.slug}" class="episode-item">
                    <span class="episode-title">${ep.title}</span>
                    <span class="episode-date">${ep.date || ''}</span>
                </a>
            `).join('');
        }

        content.innerHTML = `
            <div class="detail-header">
                <img src="${data.thumbnail || 'https://via.placeholder.com/300x400'}" alt="${data.title}" class="detail-poster">
                <div class="detail-info">
                    <h1>${data.title}</h1>
                    <div class="detail-meta">
                        <span><strong>Status:</strong> ${data.status || 'N/A'}</span>
                        <span><strong>Skor:</strong> ${data.score || 'N/A'}</span>
                        <span><strong>Produser:</strong> ${data.producers || 'N/A'}</span>
                        <span><strong>Studio:</strong> ${data.studio || 'N/A'}</span>
                    </div>
                    <div class="detail-meta">
                        <strong>Sinopsis:</strong>
                        <p>${data.synopsis || 'Tidak ada sinopsis'}</p>
                    </div>
                    <div class="genre-tags">
                        ${tagsHtml}
                    </div>
                </div>
            </div>

            <div class="episode-list">
                <h2>Daftar Episode</h2>
                <div style="margin-top: 1rem;">
                    ${episodesHtml || '<p>Belum ada episode.</p>'}
                </div>
            </div>
        `;
    } else {
        // Fallback if detail fails but maybe it's an episode that was wrongly linked
        content.innerHTML = '<p>Gagal memuat detail series. Jika ini adalah episode, <a href="stream.html?slug=' + slug + '">klik di sini untuk streaming</a>.</p>';
    }
});
