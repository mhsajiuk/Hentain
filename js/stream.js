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
            let serverButtons = data.streams.map((stream, index) => `
                <button class="download-btn server-btn" data-url="${stream.url}" ${index === 0 ? 'style="background: var(--primary); border-color: var(--primary);"' : ''}>
                    ${stream.server}
                </button>
            `).join('');

            streamHtml = `
                <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;" id="server-list">
                    ${serverButtons}
                </div>
                <div class="video-wrapper">
                    <iframe id="stream-iframe" src="${data.streams[0].url}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
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

        // Add event listeners for server buttons
        const serverBtns = document.querySelectorAll('.server-btn');
        const iframe = document.getElementById('stream-iframe');
        if (serverBtns && iframe) {
            serverBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const url = e.target.getAttribute('data-url');
                    iframe.src = url;
                    
                    // Reset all buttons style
                    serverBtns.forEach(b => {
                        b.style.background = 'rgba(255, 255, 255, 0.05)';
                        b.style.borderColor = 'var(--glass-border)';
                    });
                    
                    // Highlight selected button
                    e.target.style.background = 'var(--primary)';
                    e.target.style.borderColor = 'var(--primary)';
                });
            });
        }
    } else {
        content.innerHTML = '<p>Gagal memuat video.</p>';
    }
});
