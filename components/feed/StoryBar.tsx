type StoryUser = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function StoryBar({
  currentUser,
  users = [],
}: {
  currentUser: StoryUser;
  users?: StoryUser[];
}) {
  const stories = [
    { ...currentUser, label: "Your story", accent: true },
    ...users
      .filter((u) => u.id !== currentUser.id)
      .slice(0, 7)
      .map((u) => ({
        ...u,
        label: `${u.firstName} ${u.lastName}`.trim() || "User",
        accent: false,
      })),
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Stories</h3>
        <span className="text-xs text-slate-500">Latest updates</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {stories.map((story, index) => (
          <button
            key={`${story.id}-${index}`}
            className="group w-24 shrink-0 text-left"
          >
            <div
              className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-3xl p-[2px] ${
                story.accent
                  ? "bg-slate-900"
                  : "bg-gradient-to-br from-slate-200 to-slate-400"
              }`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-slate-200 text-sm font-semibold text-slate-700">
                  {(story.firstName?.[0] ?? "U").toUpperCase()}
                  {(story.lastName?.[0] ?? "").toUpperCase()}
                </div>
              </div>
            </div>

            <p className="line-clamp-1 text-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
              {story.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}