import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/no-image').then(res => {
      setProducts(res.data);
    });
  }, []);

  const searchImages = async (product) => {
    const res = await axios.get('http://localhost:5000/api/products/search-image?q=' + product.name);
    setSelectedProduct(product);
    setImages(res.data);
  };

  const selectImage = async (url) => {
    await axios.post('http://localhost:5000/api/products/save-image', {
      productId: selectedProduct.id,
      imageUrl: url
    });
    alert('Image saved successfully!');
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products Missing Images</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} className="mb-2">
            {p.name} ({p.code})
            <button onClick={() => searchImages(p)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">Find Image</button>
          </li>
        ))}
      </ul>

      {images.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Select an Image for {selectedProduct.name}</h2>
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img key={i} src={img} alt="option" className="cursor-pointer border" onClick={() => selectImage(img)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;