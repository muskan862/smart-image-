const express = require('express');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const db = require('../db');
const router = express.Router();

// Get products with no image
router.get('/no-image', (req, res) => {
  db.all('SELECT * FROM products WHERE image_path IS NULL', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Search images using Unsplash API (or Google/Bing API)
router.get('/search-image', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query, per_page: 5 },
      headers: { Authorization: `Client-ID YOUR_UNSPLASH_ACCESS_KEY` },
    });
    const imageUrls = response.data.results.map(img => img.urls.small);
    res.json(imageUrls);
  } catch (err) {
    res.status(500).json({ error: 'Image search failed' });
  }
});

// Download, resize, and save selected image
router.post('/save-image', async (req, res) => {
  const { productId, imageUrl } = req.body;
  const filename = `images/product_${productId}.jpg`;

  try {
    const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    await sharp(buffer).resize(500, 500).toFile(filename);

    db.run('UPDATE products SET image_path = ? WHERE id = ?', [filename, productId], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Image saved', path: filename });
    });
  } catch (err) {
    res.status(500).json({ error: 'Image processing failed' });
  }
});

module.exports = router;
