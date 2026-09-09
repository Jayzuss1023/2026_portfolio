import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-heading mt-8 mb-4 text-3xl font-semibold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading mt-8 mb-3 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading mt-6 mb-2 text-xl font-semibold">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-muted-foreground mb-4 leading-7">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-accent text-muted-foreground my-4 border-l-4 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-primary underline-offset-4 hover:underline"
        rel="noreferrer"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-5">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground mb-4 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    ),
  },
};

type Props = {
  value: React.ComponentProps<typeof PortableText>["value"];
};

export function PortableTextBody({ value }: Props) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
