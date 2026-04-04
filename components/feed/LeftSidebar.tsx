export default function LeftSidebar() {
  return (
    <div className="left-sidebar">

      {/* EXPLORE */}
      <div className="card sidebar-card">
        <h3>Explore</h3>

        <ul>
          <li>📘 Learning</li>
          <li>📊 Insights</li>
          <li>👥 Find Friends</li>
          <li>🔖 Bookmarks</li>
          <li>👨‍👩‍👧 Groups</li>
          <li>🎮 Gaming</li>
          <li>⚙️ Settings</li>
          <li>💾 Save Post</li>
        </ul>
      </div>

      {/* SUGGESTED PEOPLE */}
      <div className="card sidebar-card">
        <h3>Suggested People</h3>

        {["Steve Jobs", "Ryan Roslansky", "Dylan Field"].map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="feed-avatar" style={{ width: 32, height: 32 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{name}</p>
                <p style={{ fontSize: 12, color: "#64748b" }}>CEO</p>
              </div>
            </div>

            <button className="icon-btn">Connect</button>
          </div>
        ))}
      </div>

      {/* EVENTS */}
      <div className="card sidebar-card">
        <h3>Events</h3>

        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
          <img src="/event.jpg" />
        </div>

        <p style={{ fontSize: 14, fontWeight: 500 }}>
          No more terrorism no more cry
        </p>

        <button
          className="primary-btn"
          style={{ marginTop: 8, fontSize: 12, padding: "6px 10px" }}
        >
          Going
        </button>
      </div>

    </div>
  );
}