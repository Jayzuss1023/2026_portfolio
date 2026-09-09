type Span = { text?: string | null };
type Block = {
  _type?: string;
  children?: Span[] | null;
};

export function portableTextToPlain(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      const b = block as Block;
      if (b._type !== "block" || !Array.isArray(b.children)) return "";
      return b.children.map((c) => c.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
