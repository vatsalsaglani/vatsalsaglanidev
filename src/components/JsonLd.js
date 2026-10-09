// Renders a schema.org JSON-LD block. `data` must be built from the data files, never hand-typed facts.
export default function JsonLd({ data }) {
  const json = JSON.stringify(data, (_, v) => (v === undefined ? undefined : v)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
