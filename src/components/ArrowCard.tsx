import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">;
  pill?: boolean;
};

export default function ArrowCard({ entry, pill }: Props) {
  const typeLabel = entry.collection === "blog" ? "post" : "project";

  return (
    <a href={`/${entry.collection}/${entry.id}`}>
      <p>
        {pill ? `${typeLabel} · ` : ""}
        {formatDate(entry.data.date)}
      </p>
      <h2>{entry.data.title}</h2>
      <p>{entry.data.description}</p>
      <p>{entry.data.tags.join(", ")}</p>
    </a>
  );
}
