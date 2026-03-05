import { createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";
import "./AnimatedProjects.css";

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
    <div class="animated-projects">
      <div class="animated-projects__stack">
        {projects.map((entry, idx) => {
          // compute a *static* stacking order: first card highest, last card lowest
          const z = projects.length - idx - 1;

          return (
            <section
              ref={(el) => (refs[idx] = el!)}
              class="animated-projects__item"
              // inject the two CSS-vars for the translate calc
              style={`--i:${idx};--e:${entered()};`}
            >
              <div
                class="animated-projects__card"
                style={{
                  "z-index": z,
                  transform: entered() >= idx
                    ? "translateY(0)"
                    : `translateY(calc(-100% * (var(--i) - var(--e))))`
                }}
              >
                <a href={`/projects/${entry.slug}`} class="project-card">
                  <div class="project-card__content">
                    <div class="project-card__meta">
                      <div class="project-card__date">
                        {formatDate(entry.data.date)}
                      </div>
                      <div class="project-card__tags">
                        {entry.data.tags.map((tag) => (
                          <div class="project-card__tag">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div class="project-card__title-wrapper">
                      <h3 class="project-card__title">
                        {entry.data.title}
                      </h3>
                      <svg
                        class="project-card__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <line
                          class="project-card__icon-line"
                          x1="5"
                          y1="12"
                          x2="19"
                          y2="12"
                        />
                        <polyline
                          class="project-card__icon-arrow"
                          points="12 5 19 12 12 19"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="project-card__image-wrapper">
                    <img
                      class="project-card__image"
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