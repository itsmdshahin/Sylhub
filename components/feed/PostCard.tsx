export default function PostCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <img src="/avatar.png" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-medium text-sm">Karim Saif</p>
          <p className="text-xs text-gray-500">5 minute ago . Public</p>
        </div>
      </div>

      {/* TEXT */}
      <p className="text-sm mb-3">-Healthy Tracking App</p>

      {/* IMAGE */}
      <img src="/post.jpg" className="rounded-lg mb-3" />

      {/* STATS */}
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <span>9+ reactions</span>
        <span>12 Comment 122 Share</span>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-around border-t pt-3 text-sm text-gray-600">
        <button>Haha</button>
        <button>Comment</button>
        <button>Share</button>
      </div>

      {/* COMMENT INPUT */}
      <div className="mt-3">
        <input
          className="w-full bg-[#F5F5F5] rounded-full px-4 py-2 text-sm outline-none"
          placeholder="Write a comment"
        />
      </div>
    </div>
  );
}