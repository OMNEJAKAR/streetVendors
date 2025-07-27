import React, { useState, useEffect } from "react";
import "./BrowseProducts.css"

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const res = await fetch("http://localhost:5000/api/voice/search", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log("Voice search result:", result);
      setProducts(result.matches); // Update products with matches
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);

    // Auto stop after 4 seconds
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 4000);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="browse-wrapper">
      <h1>Browse Products</h1>
      <button onClick={startRecording} className="voice-btn">
        {recording ? "🎙 Listening..." : "🎤 Voice Search"}
      </button>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <p>₹{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
