import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css"
export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const { vendorId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${vendorId}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        setErr(e.message || "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  if (loading) return <div className="profile-wrapper">Loading...</div>;
  if (err) return <div className="profile-wrapper">{err}</div>;

  const { vendor, stats, orders, bulkGroups } = profile;

  return (
    <div className="profile-wrapper">
      <h1>👤 Profile</h1>

      <section className="profile-card">
        <h2>{vendor.name}</h2>
        <p>@{vendor.username}</p>
        <p>📞 {vendor.phone}</p>
      </section>

      <section className="stats-grid">
        <Stat label="Credit Score" value={stats.creditScore} highlight />
        <Stat label="Amount Spent" value={`₹${stats.amountSpent.toFixed(2)}`} />
        <Stat label="Savings / Profit" value={`₹${stats.profit.toFixed(2)}`} />
        <Stat label="Total Orders" value={stats.totalOrders} />
        <Stat label="Bulk Groups Joined" value={stats.bulkGroupsJoined} />
      </section>

      {/* Orders Section */}
      <section className="section">
        <h2>🧾 Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="list">
            {orders.map((o) => (
              <div className="list-item" key={o._id}>
                <div className="left">
                  <p className="date">
                    {new Date(o.createdAt).toLocaleString("en-IN")}
                  </p>
                  <ul className="items">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        {it.name} &times; {it.qty} @ ₹{it.unitPrice}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="right">
                  <p>Paid: <strong>₹{o.totalPaid.toFixed(2)}</strong></p>
                  <p className="saving">
                    Saved: ₹{(o.totalOriginal - o.totalPaid).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bulk Groups Section */}
      <section className="section">
        <h2>🤝 Bulk Groups You’re In</h2>
        {bulkGroups.length === 0 ? (
          <p>You haven’t joined any bulk groups yet.</p>
        ) : (
          <div className="list">
            {bulkGroups.map((bg) => {
              const progress = Math.min(
                100,
                Math.round((bg.currentQty / bg.minQtyTarget) * 100)
              );
              return (
                <div className="list-item" key={bg.id}>
                  <div className="left">
                    <h3>{bg.name}</h3>
                    <p>
                      <span className="bulk">₹{bg.bulkPrice}</span>{" "}
                      <span className="original">₹{bg.actualPrice}</span>
                    </p>
                    <p className="qty">
                      You committed: <strong>{bg.qty}</strong>
                    </p>
                    <p className="deadline">
                      Deadline:{" "}
                      {new Date(bg.deadline).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <div className="progressbar">
                      <div className="bar" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="progress-text">
                      {bg.currentQty}/{bg.minQtyTarget}
                    </p>
                  </div>
                  <div className="right">
                    <p className="joined-at">
                      Joined: {new Date(bg.joinedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`stat ${highlight ? "highlight" : ""}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
