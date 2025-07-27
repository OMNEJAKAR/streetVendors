export default function VoiceSearchModal({ isOpen, results, onClose }) {
  if (!isOpen) return null;

  const list = Array.isArray(results)
    ? results
    : Array.isArray(results?.matches)
    ? results.matches
    : [];

  const transcript = Array.isArray(results) ? "" : results?.transcript || "";

  return (
    <div className="voice-modal-overlay">
      <div className="voice-modal">
        <h2>🎤 Voice Search Results</h2>
        {transcript && (
          <p>You said: <strong>{transcript}</strong></p>
        )}

        {list.length === 0 ? (
          <p>No matching products found.</p>
        ) : (
          <div className="products-list">
            {list.map((p) => (
              <div key={p._id} className="product-card">
                <img src={p.imageUrl} alt={p.name} />
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <button>Add to Cart</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}