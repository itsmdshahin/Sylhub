export default function RightSidebar() {
  return (
    <div className="right-sidebar">

      {/* YOU MIGHT LIKE */}
      <div className="card sidebar-card">
        <h3>You Might Like</h3>

        {["Radovan SkillArena", "Steve Jobs", "Ryan Roslansky"].map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                className="feed-avatar"
                style={{ width: 36, height: 36 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{name}</p>
                <p style={{ fontSize: 12, color: "#64748b" }}>
                  Software Engineer
                </p>
              </div>
            </div>

            <button className="icon-btn">Follow</button>
          </div>
        ))}
      </div>

      {/* YOUR FRIENDS */}
      <div className="card sidebar-card">
        <h3>Your Friends</h3>

        {["Steve Jobs", "Ryan Roslansky", "Dylan Field"].map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                className="feed-avatar"
                style={{ width: 32, height: 32 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{name}</p>
                <p style={{ fontSize: 12, color: "#64748b" }}>
                  Online
                </p>
              </div>
            </div>

            <button className="icon-btn">Message</button>
          </div>
        ))}
      </div>

      {/* EXTRA CARD (OPTIONAL — MATCH TEMPLATE FEEL) */}
      <div className="card sidebar-card">
        <h3>Suggestions</h3>

        <div style={{ fontSize: 14, color: "#64748b" }}>
          <p>Follow people to see more content.</p>
        </div>
      </div>

    </div>
  );
}