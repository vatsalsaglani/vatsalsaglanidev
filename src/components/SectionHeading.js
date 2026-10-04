// Consistent section header: numbered mono eyebrow + large serif title + optional lede.
export default function SectionHeading({ index, eyebrow, title, lede, action }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow mb-4 flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span>{eyebrow}</span>
        </p>
        <h2 className="font-serif text-display-md">{title}</h2>
        {lede && <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
