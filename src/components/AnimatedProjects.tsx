import { createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";

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
    <div class="mx-auto">
      <div class="relative z-0 space-y-14 overflow-visible">
        {projects.map((entry, idx) => {
          // compute a *static* stacking order: first card highest, last card lowest
          const z = projects.length - idx - 1;

          return (
            <section
              ref={(el) => (refs[idx] = el!)}
              // inject the two CSS-vars for the translate calc
              style={`--i:${idx};--e:${entered()};`}
            >
              <div
                class="relative transition-transform duration-700 ease-in-out"
                style={{ "z-index": z }}
                classList={{
                  "translate-y-0": entered() >= idx,
                  // this must be literal so Tailwind JIT picks it up
                  "-translate-y-[calc(100%*(var(--i)-var(--e)))]": entered() < idx,
                }}
              >
                <a
                  href={`/projects/${entry.slug}`}
                  class="group flex flex-col flex-1 items-center rounded-md transition-colors shadow-xl bg-gradient-to-b from-surface2 via-surface10/10 to-surface10/10 p-px duration-300 ease-in-out"
                >
                  <div class="w-full p-6 group-hover:text-surface10/80 blend bg-surface rounded-t-md">
                    <div class="flex items-center justify-between gap-x-4 border-b border-surface10/25 pb-2 mb-6">
                      <div class="text-xs uppercase">
                        {formatDate(entry.data.date)}
                      </div>
                      <div class="flex flex-row gap-2">
                        {entry.data.tags.map((tag) => (
                          <div class="text-xs uppercase tracking-wider py-0.5 px-1 rounded bg-surface10/10 text-surface10/75">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div class="flex flex-1 items-center justify-between gap-x-4 text-surface10/80 hover:text-surface10 ease-in-out duration-300">
                      <h3 class="text-3xl sm:text-5xl font-bold">
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
                        class="stroke-current group-hover:stroke-surface10"
                      >
                        <line
                          x1="5"
                          y1="12"
                          x2="19"
                          y2="12"
                          class="scale-x-0 group-hover:scale-x-100 translate-x-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
                        />
                        <polyline
                          points="12 5 19 12 12 19"
                          class="translate-x-0 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="overflow-hidden w-full">
                  <img
                    class="mx-auto w-full h-[32rem] object-cover rounded-b-md scale-110 transition-all duration-300 hover:scale-100"
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