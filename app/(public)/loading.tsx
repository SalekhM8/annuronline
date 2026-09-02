export default function PublicLoading() {
  return (
    <div className="container-px animate-pulse space-y-8 py-14">
      <div className="h-3 w-32 rounded bg-cream-deep" />
      <div className="h-10 w-2/3 rounded bg-cream-deep" />
      <div className="h-4 w-1/2 rounded bg-cream-deep" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-64" />
        ))}
      </div>
    </div>
  );
}
