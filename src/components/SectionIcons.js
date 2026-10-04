// Small inline icons for the content sections (1.5px stroke, currentColor).
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function ArrowUpRight({ className, size = 16 }) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Star({ className, size = 14 }) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export function GraduationCap({ className, size = 16 }) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z" />
      <path d="M6.5 11.2V16c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.8M21.5 9v5" />
    </svg>
  );
}
