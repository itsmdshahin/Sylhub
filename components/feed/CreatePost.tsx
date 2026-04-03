"use client";

type Props = {
  createPost: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: (v: string) => void;
  currentUserName: string;
  setImageFile: (file: File | null) => void;
  visibility: "PUBLIC" | "PRIVATE";
  setVisibility: (v: "PUBLIC" | "PRIVATE") => void;
  busy: boolean;
};

export default function CreatePost({
  createPost,
  content,
  setContent,
  currentUserName,
  setImageFile,
  visibility,
  setVisibility,
  busy,
}: Props) {
  return (
    <form onSubmit={createPost} className="card composer">

      {/* TOP ROW */}
      <div className="composer-top">
        <div className="feed-avatar" />
        
        <textarea
          placeholder={`What's on your mind, ${currentUserName}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="post-actions">

        {/* LEFT */}
        <div className="post-actions-left">
          <label>
            📷 Photo
            <input
              type="file"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
            />
          </label>

          <span>🎥 Video</span>
          <span>📅 Event</span>
          <span>📝 Article</span>
        </div>

        {/* RIGHT */}
        <div className="post-actions-right">
          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "PUBLIC" | "PRIVATE")
            }
          >
            <option value="PUBLIC">🌍 Public</option>
            <option value="PRIVATE">🔒 Private</option>
          </select>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </form>
  );
}