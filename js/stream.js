document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const content = document.getElementById('stream-content');

    if (!slug) {
        content.innerHTML = '<p>Video tidak ditemukan.</p>';
        return;
    }

    const data = await getStream(slug);

    if (data) {
        // Stream iframe
        let streamHtml = '';
        if (data.streams && data.streams.length > 0) {
            streamHtml = `
                <div class="video-wrapper">
                    <iframe src="${data.streams[0].url}" allowfullscreen></iframe>
                </div>
            `;
        } else {
            streamHtml = '<div class="video-wrapper" style="display:flex;align-items:center;justify-content:center;color:white;">Video tidak tersedia / Server error</div>';
        }

        // Download links
        let downloadHtml = '';
        if (data.downloads && data.downloads.length > 0) {
            downloadHtml = data.downloads.map(dl => {
                let links = dl.links.map(link => `
                    <a href="${link.url}" target="_blank" class="download-btn">${link.server}</a>
                `).join('');
                return `
                    <div class="download-box">
                        <h3>${dl.quality}</h3>
                        <div class="download-buttons">
                            ${links}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            downloadHtml = '<p>Tidak ada link download.</p>';
        }

        content.innerHTML = `
            <h1 style="margin-bottom:1rem;color:var(--primary);">${data.title || 'Streaming Episode'}</h1>
            ${streamHtml}
            <div class="download-links">
                <h2 style="margin-bottom:1rem;">Link Download</h2>
                ${downloadHtml}
            </div>
            ${data.prev_episode || data.next_episode ? `
            <div style="margin-top:2rem;display:flex;justify-content:space-between;">
                ${data.prev_episode ? `<a href="stream.html?slug=${data.prev_episode.slug || data.prev_episode}" class="download-btn">Episode Sebelumnya</a>` : '<div></div>'}
                ${data.next_episode ? `<a href="stream.html?slug=${data.next_episode.slug || data.next_episode}" class="download-btn">Episode Selanjutnya</a>` : '<div></div>'}
            </div>` : ''}
        `;
    } else {
        content.innerHTML = '<p>Gagal memuat video.</p>';
    }
});
