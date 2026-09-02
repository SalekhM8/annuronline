type Course = { title: string };

export default function CourseCards({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {courses.map((c) => (
        <div key={c.title} className="option-card bg-gold-soft">
          <div className="font-medium text-[--brand-green]">{c.title}</div>
        </div>
      ))}
    </div>
  );
}


