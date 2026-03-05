import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import "./Projects.css";

type Props = {
  tags: string[]
  data: CollectionEntry<"projects">[]
}

export default function Projects({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [projects, setProjects] = createSignal<CollectionEntry<"projects">[]>(data);

  createEffect(() => {
    setProjects(data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag:string) =>
          tag.toLowerCase() === String(value).toLowerCase()
        )
      )
    ));
  });

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(prev.has(tag)
        ? [...prev].filter((t) => t !== tag)
        : [...prev, tag]
      )
    );
  }

  return (
    <div class="projects">
      <div class="projects__filter-section">
        <div class="projects__filter">
          <div class="projects__filter-label">Filter:</div>
          <ul class="projects__filter-list">
            <For each={tags}>
              {(tag) => (
                <li class="projects__filter-item">
                  <button
                    class="projects__filter-button"
                    classList={{ "projects__filter-button--active": filter().has(tag) }}
                    onClick={() => toggleTag(tag)}
                  >
                    <svg class="projects__filter-icon">
                      <use href={`/ui.svg#square`} style={{ display: !filter().has(tag) ? "block" : "none" }} />
                      <use href={`/ui.svg#square-check`} style={{ display: filter().has(tag) ? "block" : "none" }} />
                    </svg>
                    {tag}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class="projects__list-section">
        <div class="projects__list">
          {projects().map((project) => (
            <ProjectsWaterfall entry={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
