import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";
import styles from "./ArrowCard.module.css";

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">;
  pill?: boolean;
};

export default function ArrowCard({ entry, pill }: Props) {
  return (
    <a
      href={`/${entry.collection}/${entry.id}`}
      class={styles.card}
    >
      <div class={styles.card__meta}>
        {pill && (
          <span class={styles.card__pill}>
            {entry.collection === "blog" ? "post" : "project"}
          </span>
        )}
        <span class={styles.card__date}>
          {formatDate(entry.data.date)}
        </span>
      </div>
      <div class={styles.card__title}>
        {entry.data.title}
      </div>
      <div class={styles.card__description}>
        {entry.data.description}
      </div>
      <ul class={styles.card__tags}>
        {entry.data.tags.map((tag: string) => (
          <li class={styles.card__tag}>
            {tag}
          </li>
        ))}
      </ul>
    </a>
  );
}
