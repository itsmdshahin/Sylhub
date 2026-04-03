export default function LeftSidebar() {
  return (
    <div className="space-y-4">

      {/* EXPLORE */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="font-semibold mb-3">Explore</p>

        <div className="space-y-3 text-sm text-gray-600">
          <p>Learning</p>
          <p>Insights</p>
          <p>Find friends</p>
          <p>Bookmarks</p>
          <p>Group</p>
          <p>Gaming</p>
          <p>Settings</p>
          <p>Save post</p>
        </div>
      </div>

      {/* SUGGESTED */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="font-semibold mb-3">Suggested People</p>

        {["Steve Jobs", "Ryan Roslansky", "Dylan Field"].map((name) => (
          <div key={name} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/avatar.png" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500">CEO</p>
              </div>
            </div>

            <button className="text-xs border px-2 py-1 rounded">
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* EVENTS */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="font-semibold mb-3">Events</p>

        <img src="/event.jpg" className="rounded-lg mb-2" />

        <p className="text-sm font-medium">
          No more terrorism no more cry
        </p>

        <button className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded">
          Going
        </button>
      </div>

    </div>
  );
}