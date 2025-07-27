import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        setErr(e.message || "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

      <style jsx>{`
        .profile-wrapper {
          min-height: 100vh;
          background: #f6f7fb;
          padding: 1.5rem;
        }
        h1 {
          color: #ff5a1f;
          margin-bottom: 1rem;
        }
        .profile-card {
          background: #fff;
          padding: 1rem 1.2rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          margin-bottom: 1.2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .stat {
          background: #fff;
          padding: 0.9rem 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .stat.highlight {
          border-left: 4px solid #ff5a1f;
        }
        .stat .label {
          color: #777;
          font-size: 0.8rem;
        }
        .stat .value {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 0.2rem;
        }
        .section h2 {
          margin: 1rem 0 0.5rem;
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .list-item {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
        }
        .date {
          font-size: 0.85rem;
          color: #555;
        }
        .items {
          margin: 0.4rem 0 0;
          padding-left: 1rem;
        }
        .saving {
          color: #1a892e;
          font-weight: 600;
        }
        .bulk {
          color: #1a892e;
          font-weight: 600;
        }
        .original {
          text-decoration: line-through;
          color: #999;
          margin-left: 0.3rem;
        }
        .progressbar {
          height: 8px;
          border-radius: 8px;
          background: #eee;
          margin: 0.4rem 0 0.2rem;
          overflow: hidden;
        }
        .bar {
          height: 100%;
          background: #ff5a1f;
        }
        .progress-text {
          font-size: 0.8rem;
          color: #666;
        }
      `}</style>
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
