export default function PortalLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-cream-deep" />
        <div className="h-8 w-64 rounded bg-cream-deep" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card h-24 p-5">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-cream-deep" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-cream-deep" />
                <div className="h-5 w-12 rounded bg-cream-deep" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card h-64 p-6">
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-cream-deep" />
          <div className="h-3 w-full rounded bg-cream-deep" />
          <div className="h-3 w-5/6 rounded bg-cream-deep" />
          <div className="h-3 w-4/6 rounded bg-cream-deep" />
        </div>
      </div>
    </div>
  );
}
