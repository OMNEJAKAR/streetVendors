// src/pages/VendorDashboard.jsx
import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "./VendorDashboard.css";

const VendorDashboard = () => {
    const [surplusDeals, setSurplusDeals] = useState([]);
    const [activeDeals, setActiveDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
  (async () => {
    try {
      const sRes = await fetch("http://localhost:5000/api/deals");
    //   const aRes = await fetch("http://localhost:5000/api/deals");

      if (!sRes.ok ) {
        const sText = await sRes.text();
        // const aText = await aRes.text();
        throw new Error(
          `Surplus: ${sRes.status} ${sText}\nActive:`
        );
      }

      const [sData] = await Promise.all([sRes.json()]);
      setSurplusDeals(sData);
    //   setActiveDeals(aData);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  })();
}, []);

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <h1>VendorMart</h1>
        <div className="credit-balance">Credit Balance: ₹0</div>
        <button className="logout-btn">Logout</button>
      </div>

      {/* Welcome */}
      <div className="welcome-card">
        <h2>Hello Om!</h2>
        <p>Ready to stock up your stall today?</p>
        <button className="voice-btn">🎤 Tap to order by voice</button>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card">Browse Products</div>
          <div className="action-card">Surplus Deals</div>
          <div className="action-card">Bulk Groups</div>
          <Link to="/storage" className="action-card">Storage</Link>
        </div>
      </section>

      {/* Status */}
      <section className="status-section">
        <h3>Your Status</h3>
        <div className="status-card">
          <p>Bronze Member</p>
          <p>Rating: 0/5</p>
        </div>
      </section>

      {/* Hot Surplus Deals */}
       <section className="deals-section">
        <h3>🔥 Hot Surplus Deals</h3>
        <div className="deals-list">
          {surplusDeals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      </section>

      {/* <section className="deals-section">
        <h3>Active Deals</h3>
        <div className="deals-list">
          {activeDeals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      </section> */}
    </div>
  );
};

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
