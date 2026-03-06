import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import styles from "./Projects.module.css";

type Props = {
  tags: string[];
  data: CollectionEntry<"projects">[];
};

export default function Projects({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [projects, setProjects] = createSignal<CollectionEntry<"projects">[]>([]);

  createEffect(() => {
    setProjects(
      data.filter((entry) =>
        Array.from(filter()).every((value) =>
          entry.data.tags.some(
            (tag: string) =>
              tag.toLowerCase() === String(value).toLowerCase()
          )
        )
      )
    );
  });

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(
        prev.has(tag) ? [...prev].filter((t) => t !== tag) : [...prev, tag]
      )
    );
  }

  return (
    <div class={styles.root}>
      <div class={styles.filters}>
        <div class={styles.filtersInner}>
          <span class={styles.filtersLabel}>Filter:</span>
          <ul class={styles.filtersList}>
            <For each={tags}>
              {(tag) => (
                <li>
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    class={styles.filterBtn}
                    classList={{ [styles.filterBtnActive]: filter().has(tag) }}
                  >
                    <svg class={styles.filterIcon} aria-hidden="true">
                      <use href="/ui.svg#square" class={styles.filterIconUnchecked} />
                      <use href="/ui.svg#square-check" class={styles.filterIconChecked} />
                    </svg>
                    {tag}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class={styles.grid}>
        {projects().map((project) => (
          <ProjectsWaterfall entry={project} />
        ))}
      </div>
    </div>
  );
}
