import { MEDIA } from "@config/media";
import type { ProjectCardEntry } from "@types";
import styles from "./ProjectsWaterfall.module.css";

type ProjectCardVariant = "landing" | "homepage-grid";

type Props = {
  entry: ProjectCardEntry;
  variant?: ProjectCardVariant;
  showTags?: boolean;
};

export default function ProjectsWaterfall({
  entry,
  variant = "landing",
  showTags = true,
}: Props) {
  return (
    <a href={`/projects/${entry.slug}`} class={styles.card} data-variant={variant}>
      <div class={styles.card__body}>
        {showTags && (
          <div class={styles.card__meta}>
            {entry.tags.map((tag) => (
              <span class={styles.card__tag}>{tag}</span>
            ))}
          </div>
        )}
        <h3 class={styles.card__title}>{entry.title}</h3>
      </div>
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
    </a>
  );
}
