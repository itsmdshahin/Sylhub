export default function Stories() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{
        display: "flex",
        gap: 12,
        overflowX: "auto"
      }}>

        {/* YOUR STORY */}
        <div style={{
          width: 120,
          height: 180,
          borderRadius: 18,
          background: "#3b82f6",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center"
        }}>
          <div style={{ marginBottom: 12, textAlign: "center" }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 6
            }}>
              +
            </div>
            <p style={{ fontSize: 12 }}>Your Story</p>
          </div>
        </div>

        {/* OTHER STORIES */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            width: 120,
            height: 180,
            borderRadius: 18,
            background: "#cbd5f5",
            position: "relative"
          }}>
            <p style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              fontSize: 12,
              color: "#fff"
            }}>
              User {i}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}