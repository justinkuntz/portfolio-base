import { createEffect, createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { MEDIA } from "@config/media";
import type { ProjectCardEntry } from "@types";
import styles from "./AnimatedProjects.module.css";

type Props = {
  projects: ProjectCardEntry[];
};

export default function AnimatedProjects({ projects }: Props): JSX.Element {
  const [entered, setEntered] = createSignal(0);
  const refs: HTMLElement[] = [];
  let observer: IntersectionObserver | undefined;

  onMount(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        const idx = Number((entry.target as HTMLElement).dataset.index);
        if (!Number.isFinite(idx)) return;

        // Advance the stack one card at a time so shorter cards do not cause
        // the whole sequence to complete immediately on initial load.
        setEntered((current) => (idx === current + 1 ? idx : current));
      },
      {
        threshold: 0.6,
        rootMargin: "0px 0px -10% 0px",
      },
    );
  });

  createEffect(() => {
    if (!observer) return;

    observer.disconnect();
    const nextIdx = entered() + 1;
    const nextRef = refs[nextIdx];
    if (nextRef) observer.observe(nextRef);
  });

  onCleanup(() => observer?.disconnect());

  return (
    <div class={styles.root}>
      <div class={styles.stack}>
        {projects.map((entry, idx) => {
          const z = projects.length - idx - 1;
          return (
            <section
              ref={(el) => (refs[idx] = el!)}
              data-index={idx}
              style={`--i: ${idx}; --e: ${entered()};`}
            >
              <div
                class={styles.cardWrap}
                style={{ "z-index": z }}
                classList={{
                  [styles.cardWrapEntered]: entered() >= idx,
                  [styles.cardWrapPending]: entered() < idx,
                }}
              >
                <a
                  href={`/projects/${entry.slug}`}
                  class={styles.card}
                >
                  <div class={`${styles.cardInner} blend`}>
                    <div class={styles.cardTitleRow}>
                      <h3 class={styles.cardTitle}>
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
                  <div class={styles.cardImgWrap}>
                    <img
                      class={styles.cardImg}
                      style={{ "aspect-ratio": MEDIA.homepageProjectThumbnail.aspectRatio }}
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
