/** @jsxImportSource solid-js */
import { For, createSignal, onMount } from "solid-js";
import type { CollectionEntry } from "astro:content";

type ProjectEntry = CollectionEntry<"projects">;

export default function ProjectsWaterfall(props: { projects: ProjectEntry[] }) {
  const [entered, setEntered] = createSignal(0);
  const sections: HTMLElement[] = [];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((el) => el === entry.target);
            if (idx >= 0) setEntered(idx);
          }
        }
      },
      { rootMargin: "-70% 0% -30% 0", threshold: 0 }
    );
    sections.forEach((el) => el && observer.observe(el));
  });

  return (
    <ul class="relative z-0 space-y-14 max-w-5xl mx-auto">
      <For each={props.projects}>
        {(card, idx) => (
          <section
            ref={(el) => (sections[idx()] = el!)}
            style={{
              "--i": idx().toString(),
              "--e": entered().toString(),
            }}
          >
            <div
              class={`relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden
                      transition-transform duration-700 ease-in-out
                      ${
                        entered() >= idx()
                          ? "translate-y-0"
                          : "-translate-y-[calc(100%*(var(--i)-var(--e)))]"
                      }`}
            >
              <div class="md:flex justify-between items-center">
                <div class="shrink-0 px-12 py-14 max-md:pb-0 md:pr-0">
                  <div class="md:max-w-md">
                    <div
                      class={`text-xl mb-2 relative inline-flex justify-center items-end`}
                    >
                      AccentLabel
                      <svg
                        class="absolute opacity-40 -z-10"
                        xmlns="http://www.w3.org/2000/svg"
                        width="88"
                        height="4"
                        viewBox="0 0 88 4"
                        aria-hidden="true"
                        preserveAspectRatio="none"
                      >
                        <path
                          class="fill-red-700"
                          d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999"
                        />
                      </svg>
                    </div>
                    <h1 class="text-4xl font-extrabold text-slate-50 mb-4">
                      {card.data.title}
                    </h1>
                    <p class="text-slate-400 mb-6">
                      {card.data.description}
                    </p>
                    <a
                      href={card.data.demoURL}
                      class="text-sm font-medium inline-flex items-center justify-center px-3 py-1.5 border border-slate-700 rounded-lg tracking-normal transition text-slate-300 hover:text-slate-50 group"
                    >
                      {card.data.demoText}
                      <span class="text-slate-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                        -&gt;
                      </span>
                    </a>
                  </div>
                </div>
                <img
                  class="mx-auto max-md:-translate-x-[5%]"
                  src={card.data.thumbNail}
                  width="519"
                  height="490"
                  alt={card.data.thumbNailAlt}
                />
              </div>
              <div class="absolute left-12 bottom-0 h-14 flex items-center text-xs font-medium text-slate-400">
                {String(idx() + 1).padStart(2, "0")}
              </div>
            </div>
          </section>
        )}
      </For>
    </ul>
  );
}
