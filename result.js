document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const rawData = urlParams.get('data');
    const resultContent = document.getElementById('resultContent');

    if (!rawData) {
        resultContent.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data found in QR code.</p>';
        return;
    }

    const docText = decodeURIComponent(rawData);
    const lines = docText.split('\n').filter(line => line.trim() !== '');

    lines.forEach(line => {
        const row = document.createElement('div');
        row.className = 'result-row';

        // Try to split by colon to get Label and Value
        let label = '';
        let value = '';

        if (line.includes(':')) {
            const parts = line.split(':');
            label = parts[0].trim();
            value = parts.slice(1).join(':').trim(); // Handle multiple colons if any
        } else {
            // Default if no colon found
            label = 'Info';
            value = line.trim();
        }

        row.innerHTML = `
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        `;
        resultContent.appendChild(row);
    });
});
