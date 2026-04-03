export default function Stories() {
  return (
    <div className="flex gap-3 overflow-x-auto">

      {/* YOUR STORY */}
      <div className="w-[120px] h-[180px] bg-blue-900 rounded-lg flex flex-col justify-end items-center text-white">
        <div className="mb-4 text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">+</div>
          <p className="text-xs">Your Story</p>
        </div>
      </div>

      {/* OTHER STORIES */}
      {[1,2,3].map((i)=>(
        <div key={i} className="w-[120px] h-[180px] bg-gray-300 rounded-lg relative">
          <p className="absolute bottom-2 left-2 text-white text-xs">
            Ryan Roslansky
          </p>
        </div>
      ))}

    </div>
  );
}