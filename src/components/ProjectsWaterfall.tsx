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
  const isHomepageGrid = variant === "homepage-grid";

  return (
    <div classList={{ [styles.root]: true, [styles.rootHomepageGrid]: isHomepageGrid }}>
      <a
        href={`/projects/${entry.slug}`}
        classList={{ [styles.card]: true, [styles.cardHomepageGrid]: isHomepageGrid }}
      >
        <div
          classList={{
            [styles.card__body]: true,
            [styles.card__bodyHomepageGrid]: isHomepageGrid,
          }}
        >
          {showTags && (
            <div class={styles.card__meta}>
              <div class={styles.card__tags}>
                {entry.tags.map((tag) => (
                  <span class={styles.card__tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div
            classList={{
              [styles.card__titleRow]: true,
              [styles.card__titleRowHomepageGrid]: isHomepageGrid,
            }}
          >
            <h3
              classList={{
                [styles.card__title]: true,
                [styles.card__titleHomepageGrid]: isHomepageGrid,
              }}
            >
              {entry.title}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isHomepageGrid ? "32" : "48"}
              height={isHomepageGrid ? "32" : "48"}
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              classList={{
                [styles.card__arrow]: true,
                [styles.card__arrowHomepageGrid]: isHomepageGrid,
              }}
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
