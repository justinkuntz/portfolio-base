import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";
import styles from "./ProjectsWaterfall.module.css";

type Props = {
  entry: CollectionEntry<"projects">;
};

export default function ProjectsWaterfall({ entry }: Props) {
  return (
    <div class={styles.root}>
      <a href={`/projects/${entry.slug}`} class={styles.card}>
        <div class={styles.card__body}>
          <div class={styles.card__meta}>
            <span class={styles.card__date}>
              {formatDate(entry.data.date)}
            </span>
            <div class={styles.card__tags}>
              {entry.data.tags.map((tag: string) => (
                <span class={styles.card__tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div class={styles.card__titleRow}>
            <h3 class={styles.card__title}>
              {entry.data.title}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class={styles.card__arrow}
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" class={styles.card__arrowLine} />
              <polyline points="12 5 19 12 12 19" class={styles.card__arrowPoly} />
            </svg>
          </div>
        </div>
        <img
          class={styles.card__img}
          src={entry.data.thumbNail.src}
          width="519"
          height="490"
          alt={entry.data.thumbNailAlt}
        />
      </a>
    </div>
  );
}
