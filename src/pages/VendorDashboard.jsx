// src/pages/VendorDashboard.jsx
import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "./VendorDashboard.css";
import StatusCard from "./statusCard";
import { useNavigate } from "react-router-dom";
import VoiceSearchModal from "../backend/models/VoiceSearchModal";


const VendorDashboard = () => {
    const navigate = useNavigate();
    const VENDOR_ID = "6884e1c1c6bb5e111aedc8bf";
    const [surplusDeals, setSurplusDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [err, setErr] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [voiceResults, setVoiceResults] = useState({ transcript: "", matches: [] });
const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
  (async () => {
    try {
      const sRes = await fetch("http://localhost:5000/api/deals");

      if (!sRes.ok ) {
        const sText = await sRes.text();
        throw new Error(
          `Surplus: ${sRes.status} ${sText}\nActive:`
        );
      }

      const [sData] = await Promise.all([sRes.json()]);
      setSurplusDeals(sData);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  })();
}, []);

const startVoiceOrder = async () => {
  try {
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

      const data = await res.json(); // { transcript, matches }
      setVoiceResults({
        transcript: data.transcript || "",
        matches: Array.isArray(data.matches) ? data.matches : [],
      });
      setIsModalOpen(true);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);

    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 4000);
  } catch (err) {
    console.error("Voice capture failed:", err);
  }
};



  return (
    <div className="dashboard-wrapper">
    {/* Header */}
    <header className="dashboard-header">
      <h1>VendorMart</h1>
      <div className="header-actions">
        <button 
          className="profile-icon" 
          onClick={() => navigate(`/vendor/profile/${VENDOR_ID}`)}
        >
          👤
        </button>
        <button className="logout-btn">Logout</button>
        {/* <button className="logout-btn" onClick={handleLogout}>Logout</button> */}
      </div>

      {/* Voice Search Modal */}
      <VoiceSearchModal
  isOpen={isModalOpen}
  results={voiceResults}
  onClose={() => setIsModalOpen(false)}
/>
    </header>

      {/* Welcome */}
      <div className="welcome-card">
        <h2>Hello Om!</h2>
        <p>Ready to stock up your stall today?</p>
        <button className="voice-btn" onClick={startVoiceOrder}>
  {recording ? "🎙 Listening..." : "🎤 Tap to order by voice"}
</button>
      </div>

       {/* Profile Section */}
      { profile && (
        <ProfileCard stats={profile.stats} vendor={profile.vendor} />
      )}
      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/browse-products" className="action-card">Browse Products</Link>
          {/* <div className="action-card">Surplus Deals</div> */}
          <Link to="/bulk-groups" className="quick-action">
            <div className="action-card">View Bulk Purchase Groups</div>
          </Link>
          <Link to="/storage" className="action-card">Storage</Link>
        </div>
      </section>

      {/* Status */}
          <StatusCard vendorId="6884e1c1c6bb5e111aedc8bf" />

      {/* Hot Surplus Deals */}
       <section className="deals-section">
        <h3>🔥 Hot Surplus Deals</h3>
        <div className="deals-list">
          {surplusDeals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      </section>
    </div>
  );
};

// ProfileCard Component
function ProfileCard({ vendor, stats }) {
  return (
    <div className="profile-card">
      <button className="profile-icon overflow-hidden flex items-center justify-center">
  <img src="/path/to/profile.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" />
</button>

      <p><strong>Name:</strong> {vendor.name}</p>
      <p><strong>Username:</strong> {vendor.username}</p>
      <p><strong>Phone:</strong> {vendor.phone || "N/A"}</p>
      <h4>📊 Stats</h4>
      <ul>
        <li>Total Orders: {stats.totalOrders}</li>
        <li>Amount Spent: ₹{stats.amountSpent}</li>
        <li>Amount Original: ₹{stats.amountOriginal}</li>
        <li>Profit: ₹{stats.profit}</li>
        <li>Credit Score: {stats.creditScore}</li>
        <li>Bulk Groups Joined: {stats.bulkGroupsJoined}</li>
      </ul>
    </div>
  );
}

function DealCard({ deal }) {
  const expireDate = new Date(deal.expires).toLocaleDateString("en-IN");

  return (
    <div className="deal-card">
      <img src={deal.imageUrl} alt={deal.name} />
      <div className="deal-info">
        <h4>{deal.name}</h4>
        <p className="category">{deal.category}</p>
        <p className="price">
          ₹{deal.price.toFixed(2)}
          <span className="original"> ₹{deal.originalPrice.toFixed(2)}</span>
          <span className="discount"> {deal.discount}% OFF</span>
        </p>
        <p className="stock">{deal.stock}</p>
        <p className="expires">⚠ Expires: {expireDate}</p>
        <p className="condition">Condition: {deal.condition}</p>
        <div className="tags">
          {deal.tags?.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <button className="cart-btn">🛒 Add to Cart</button>
      </div>
    </div>
  );
}
export default VendorDashboard;