import React, { useEffect, useState } from "react";
import "./BulkGroups.css"

export default function BulkGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bulk-groups");
        const data = await res.json();
        setGroups(data);
      } catch (e) {
        setErr("Failed to load bulk groups");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const joinGroup = async (id) => {
  const qty = Number(prompt("Enter quantity you want to commit:"));
  if (!qty || qty <= 0) return;

  const vendorId = "6884e1c1c6bb5e111aedc8bf"; // TODO: dynamically get from localStorage or login
  try {
    const res = await fetch(`http://localhost:5000/api/bulk-groups/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, qty }),
    });

    if (!res.ok) throw new Error("Join failed");
    const updated = await res.json();
    setGroups((prev) => prev.map((g) => (g._id === id ? updated.group : g)));
    alert("Joined successfully!");
  } catch (e) {
    alert("Failed to join group");
  }
};

  if (loading) return <div className="bulk-wrapper">Loading…</div>;
  if (err) return <div className="bulk-wrapper">{err}</div>;

  return (
    <div className="bulk-wrapper">
      <h1>🤝 Bulk Groups</h1>

      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        <div className="bulk-list">
          {groups.map((g) => {
            const percent = Math.min(
              Math.round((g.currentQty / g.minQtyTarget) * 100),
              100
            );
            const deadline = new Date(g.deadline).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            return (
              <div className="bulk-card" key={g._id}>
                <img src={g.imageUrl} alt={g.name} />
                <div className="info">
                  <h2>{g.name}</h2>
                  <p className="category">{g.category}</p>

                  <div className="prices">
                    <span className="bulk">₹{g.bulkPrice}</span>
                    <span className="actual">₹{g.actualPrice}</span>
                    <span className="off">
                      {Math.round(
                        ((g.actualPrice - g.bulkPrice) / g.actualPrice) * 100
                      )}
                      % OFF
                    </span>
                  </div>

                  <p className="qty">
                    {g.currentQty}/{g.minQtyTarget} {g.unit} committed
                  </p>

                  <div className="progress">
                    <div className="bar" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="meta">
                    <span>Participants: {g.participants}</span>
                    <span>Last date: {deadline}</span>
                  </div>

                  <button className="join-btn" onClick={() => joinGroup(g._id)}>
                    Join Group
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .bulk-wrapper {
          padding: 1rem;
        }
        h1 {
          margin-bottom: 1rem;
          color: #ff5a1f;
        }
        .bulk-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .bulk-card {
          display: flex;
          gap: 1rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1rem;
        }
        .bulk-card img {
          width: 20%;
          object-fit:contain;
          border-radius: 8px;
        }
        .info {
          flex: 1;
          width : 80%;
        }
        .category {
          color: #777;
          font-size: 0.9rem;
          margin: 0.2rem 0 0.5rem;
        }
        .prices {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }
        .bulk {
          font-weight: 700;
          color: #1a892e;
          font-size: 1.1rem;
        }
        .actual {
          text-decoration: line-through;
          color: #999;
          font-size: 0.9rem;
        }
        .off {
          color: #1a892e;
          font-size: 0.9rem;
        }
        .qty {
          font-size: 0.85rem;
          color: #555;
        }
        .progress {
          width: 100%;
          background: #eee;
          height: 10px;
          border-radius: 10px;
          margin: 0.4rem 0 0.6rem;
          overflow: hidden;
        }
        .bar {
          height: 100%;
          background: #ff5a1f;
          border-radius: 10px;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 0.8rem;
          color: #555;
        }
        .join-btn {
          background: #ff5a1f;
          color: #fff;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
