import { MEDIA } from "@config/media";
import type { ProjectCardEntry } from "@types";
import styles from "./ProjectsWaterfall.module.css";

type Props = {
  entry: ProjectCardEntry;
};

export default function ProjectsWaterfall({ entry }: Props) {
  return (
    <div class={styles.root}>
      <a href={`/projects/${entry.slug}`} class={styles.card}>
        <div class={styles.card__body}>
          <div class={styles.card__meta}>
            <div class={styles.card__tags}>
              {entry.tags.map((tag) => (
                <span class={styles.card__tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div class={styles.card__titleRow}>
            <h3 class={styles.card__title}>
              {entry.title}
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
        <div class={styles.card__imgWrap}>
          <img
            class={styles.card__img}
            style={{ "aspect-ratio": MEDIA.projectThumbnail.aspectRatio }}
            src={entry.image.src}
            srcset={entry.image.srcset}
            sizes={entry.image.sizes}
            width={entry.image.width}
            height={entry.image.height}
            alt={entry.thumbNailAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
      </a>
    </div>
  );
}
