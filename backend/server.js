const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Membuat folder uploads dapat diakses secara publik oleh orang lain
// BENAR
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Pastikan folder uploads ada
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Konfigurasi Database SQLite
const db = new sqlite3.Database('./gallery.db', (err) => {
    if (err) console.error(err.message);
    console.log('Terhubung ke database SQLite.');
});

// Membuat tabel foto jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Konfigurasi Penyimpanan Gambar dengan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API 1: Upload Foto Baru
app.post('/api/upload', upload.single('image'), (req, res) => {
    const { title } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'Format file tidak didukung atau kosong' });
    }
    
    // Simpan path URL gambar relatif agar bisa diakses public
    const imageUrl = `/uploads/${req.file.filename}`;

    const query = `INSERT INTO photos (title, image_url) VALUES (?, ?)`;
    db.run(query, [title, imageUrl], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, imageUrl });
    });
});

// API 2: Ambil Semua Foto (Untuk dilihat semua orang)
app.get('/api/photos', (req, res) => {
    db.all(`SELECT * FROM photos ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
