import React, { useEffect, useState } from "react";

export default function StatusCard({ vendorId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/credit/status/${vendorId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));
  }, [vendorId]);

  if (!data) return <div className="status-card">Loading status…</div>;
  if (data.error) return <div className="status-card error">Failed to load status</div>;

  return (
    <div className="status-card">
      <h3>Your Status</h3>
      <p><strong>{data.level} Member</strong></p>
      <p>Rating: {data.rating}/5</p>

      <div className="progress-wrap">
        <div className="bar" style={{ width: `${data.levelProgress}%` }} />
      </div>
      <small>
        {data.levelProgress}% to next level
        {data.nextLevelAt && ` (next at ${data.nextLevelAt} XP)`}
      </small>

      <div className="credit">
        <p>Credit: ₹{data.credit.used} / ₹{data.credit.limit}</p>
        <p>Available: ₹{data.credit.available}</p>
      </div>

      <div className="coins">
        <p>Coins: {data.coins}</p>
      </div>

      <style jsx>{`
        .status-card {
          background: #fff;
          border-radius: 8px;
          padding: 1rem 1.2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .progress-wrap {
          background: #eee;
          height: 8px;
          border-radius: 6px;
          overflow: hidden;
          margin: 0.4rem 0 0.6rem;
        }
        .bar {
          height: 100%;
          background: #ff5a1f;
        }
        .credit, .coins { margin-top: .6rem; }
      `}</style>
    </div>
  );
}
