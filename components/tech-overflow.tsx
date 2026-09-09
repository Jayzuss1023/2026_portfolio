"use client";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  technologies: string[];
  visibleCount?: number;
};

export function TechOverflow({ technologies, visibleCount = 4 }: Props) {
  const cleaned = technologies.filter(Boolean);
  if (cleaned.length === 0) return null;

  const visible = cleaned.slice(0, visibleCount);
  const hidden = cleaned.slice(visibleCount);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((tech) => (
        <Badge key={tech} variant="secondary">
          {tech}
        </Badge>
      ))}
      {hidden.length > 0 ? (
        <Popover>
          <PopoverTrigger className="inline-flex cursor-pointer border-0 bg-transparent p-0">
            <Badge variant="outline">+{hidden.length}</Badge>
          </PopoverTrigger>
          <PopoverContent className="w-auto max-w-xs p-3" align="start">
            <div className="flex flex-wrap gap-2">
              {hidden.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
}
