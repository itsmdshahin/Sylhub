export default function RightSidebar() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="font-semibold mb-3">Suggestions</p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>John Doe</span>
          <button className="text-blue-500">Add</button>
        </div>
      </div>
    </div>
  );
}