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
      <div class={styles.card__body}>
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
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={styles.card__arrow}
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" class={styles.card__arrowLine} />
        <polyline points="12 5 19 12 12 19" class={styles.card__arrowPoly} />
      </svg>
    </a>
  );
}
