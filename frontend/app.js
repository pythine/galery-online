const API_BASE_URL = 'http://localhost:5000';
const galleryGrid = document.getElementById('galleryGrid');
const uploadForm = document.getElementById('uploadForm');

// 1. Fungsi untuk mengambil dan menampilkan foto dari backend
async function fetchPhotos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/photos`);
        const photos = await response.json();
        
        galleryGrid.innerHTML = ''; // Kosongkan grid sebelum render ulang

        if (photos.length === 0) {
            galleryGrid.innerHTML = '<p>Belum ada foto yang diupload.</p>';
            return;
        }

        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            
            // Menggabungkan URL base backend dengan path relatif gambar
            card.innerHTML = `
                <img src="${API_BASE_URL}${photo.image_url}" alt="${photo.title}">
                <h3>${photo.title}</h3>
            `;
            galleryGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Gagal memuat foto:', error);
    }
}

// 2. Event Listener untuk menangani upload file
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const imageFile = document.getElementById('image').files[0];

    // Menggunakan FormData karena kita mengirimkan file (binary)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Foto berhasil diupload!');
            uploadForm.reset();
            fetchPhotos(); // Refresh galeri agar foto baru langsung muncul
        } else {
            alert('Gagal mengupload foto.');
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat upload:', error);
    }
});

// Jalankan fungsi load foto saat halaman pertama kali dibuka
fetchPhotos();
