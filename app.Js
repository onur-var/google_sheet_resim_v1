const API_KEY = 'AIzaSyDltb5FbPvL9bLgj_GK4_DEDaPK0A7oM_g'; // Google Sheets API Key
const SHEET_ID = '16XhSuD_8tEJ0wK_6H5f7csqIfsF6pFneNSphVb_6wsk'; // Google Sheet ID
const RANGE = 'Sayfa1'; // Sheet adı

async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.values;
    } catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
        return [];
    }
}

function populateTable(data) {
    const tbody = document.querySelector("#catalog-table tbody");
    tbody.innerHTML = ''; // Mevcut içeriği temizle

    if (data.length <= 1) {
        tbody.innerHTML = '<tr><td colspan="4">Veri bulunamadı</td></tr>';
        return;
    }

    data.slice(1).forEach(row => { // İlk satır başlıklar
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            if (index === 3 && cell) { // Image sütunu
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Catalog Image';
                img.className = 'thumbnail';
                td.appendChild(img);

                // Resme tıklandığında modal'ı açma
                img.addEventListener('click', () => openImageModal(cell));
            } else {
                td.textContent = cell || 'N/A';
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Modal açma fonksiyonu
function openImageModal(imageUrl) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = imageUrl;
    modal.style.display = 'block';
}

// Modal kapatma fonksiyonu
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

// Modal kapatma işlemleri
document.querySelector('.close').addEventListener('click', closeImageModal);
window.addEventListener('click', event => {
    const modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeImageModal();
    }
});

// Uygulama başlatma
(async function init() {
    const data = await fetchSheetData();
    populateTable(data);
})();
