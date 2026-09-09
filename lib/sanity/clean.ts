import { stegaClean } from "next-sanity";

/** Strip Visual Editing stega encoding for logic, maps, and non-editable props. */
export function cleanText(value: string | null | undefined): string {
  if (!value) return "";
  return stegaClean(value);
}

export function cleanStringList(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!values) return [];
  return values.flatMap((value) => {
    const cleaned = cleanText(value);
    return cleaned ? [cleaned] : [];
  });
}
