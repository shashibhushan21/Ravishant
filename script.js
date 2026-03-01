document.getElementById('generateBtn').addEventListener('click', function () {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const qrcodeContainer = document.getElementById('qrcode');
    const placeholder = document.querySelector('.placeholder-text');
    const downloadGroup = document.getElementById('downloadGroup');

    // 1. Validation
    if (!text) {
        errorMsg.style.display = 'block';
        textInput.classList.add('error-border');
        return;
    } else {
        errorMsg.style.display = 'none';
        textInput.classList.remove('error-border');
    }

    // 2. Clear previous QR code
    qrcodeContainer.innerHTML = '';
    placeholder.style.display = 'none';
    downloadGroup.style.display = 'flex';

    // 3. Process the text to match the requested "Popup" format (join lines with pipes)
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const formattedText = lines.map(line => line.trim()).join(' | ');

    // 4. Update Preview to look like the "Recognition Result" popup
    renderSimulatedPopup(formattedText);

    // 5. Generate QR Code with formatted text
    new QRCode(document.getElementById('qrcode'), {
        text: formattedText,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
});

function renderSimulatedPopup(text) {
    const previewArea = document.getElementById('previewArea');
    previewArea.style.padding = '0';
    previewArea.style.border = 'none';
    previewArea.style.background = 'transparent';
    previewArea.style.minHeight = 'auto';

    previewArea.innerHTML = `
        <div class="simulated-popup">
            <div class="popup-header">Recognition Result</div>
            <div class="popup-body">${text}</div>
            <div class="popup-footer">
                <span>Cancel</span>
                <span>Copy</span>
            </div>
        </div>
        <div id="qrcode" style="margin-top: 24px;"></div>
    `;
}

// Download PNG
document.getElementById('downloadPng').addEventListener('click', function () {
    const qrElement = document.querySelector('#qrcode img') || document.querySelector('#qrcode canvas');
    if (!qrElement) return;

    let dataUrl;
    if (qrElement.tagName.toLowerCase() === 'canvas') {
        dataUrl = qrElement.toDataURL("image/png");
    } else {
        dataUrl = qrElement.src;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Download PDF
document.getElementById('downloadPdf').addEventListener('click', function () {
    const qrElement = document.querySelector('#qrcode img') || document.querySelector('#qrcode canvas');
    if (!qrElement) return;

    let dataUrl;
    if (qrElement.tagName.toLowerCase() === 'canvas') {
        dataUrl = qrElement.toDataURL("image/png");
    } else {
        dataUrl = qrElement.src;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Center the QR code on the PDF page (A4: 210 x 297 mm)
    const imgWidth = 100;
    const imgHeight = 100;
    const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    const y = (doc.internal.pageSize.getHeight() - imgHeight) / 2;

    doc.setFontSize(20);
    doc.text("Generated QR Code", 105, 40, { align: 'center' });
    doc.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
    doc.save('qrcode.pdf');
});
