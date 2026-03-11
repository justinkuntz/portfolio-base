import { createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import type { CollectionEntry } from "astro:content";
import styles from "./AnimatedProjects.module.css";

type Props = {
  projects: CollectionEntry<"projects">[];
};

export default function AnimatedProjects({ projects }: Props): JSX.Element {
  const [entered, setEntered] = createSignal(0);
  const refs: HTMLElement[] = [];
  const cleanups: (() => void)[] = [];

  onMount(() => {
    projects.forEach((_, idx) => {
      const obs = new IntersectionObserver(
        ([e]) => e.isIntersecting && setEntered(idx),
        { rootMargin: "-70% 0px -30% 0px" }
      );
      obs.observe(refs[idx]);
      cleanups.push(() => obs.disconnect());
    });
  });
  onCleanup(() => cleanups.forEach((fn) => fn()));

  return (
    <div class={styles.root}>
      <div class={styles.stack}>
        {projects.map((entry, idx) => {
          const z = projects.length - idx - 1;
          return (
            <section
              ref={(el) => (refs[idx] = el!)}
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
                  <div class={styles.cardImgWrap}>
                    <img
                      class={styles.cardImg}
                      src={entry.data.thumbNail.src}
                      width={entry.data.thumbNail.width}
                      height={entry.data.thumbNail.height}
                      alt={entry.data.thumbNailAlt}
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
