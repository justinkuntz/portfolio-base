import { createMemo, createSignal } from "solid-js";
import FilterBar from "@components/FilterBar";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import type { GridColumns, ProjectCardEntry } from "@types";
import styles from "./Projects.module.css";

type Props = {
  tags: string[];
  data: ProjectCardEntry[];
  gridColumns: GridColumns;
};

export default function Projects({ data, tags, gridColumns }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const projects = createMemo(() =>
    data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.tags.some((tag) => tag.toLowerCase() === String(value).toLowerCase())
      )
    )
  );

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(
        prev.has(tag) ? [...prev].filter((t) => t !== tag) : [...prev, tag]
      )
    );
  }

  return (
    <div class={styles.root}>
      <FilterBar
        tags={tags}
        selectedTags={filter()}
        onToggleTag={toggleTag}
      />
      <div
        classList={{
          [styles.grid]: true,
          [styles["grid--1"]]: gridColumns === 1,
          [styles["grid--2"]]: gridColumns === 2,
          [styles["grid--3"]]: gridColumns === 3,
          [styles["grid--4"]]: gridColumns === 4,
        }}
      >
        {projects().map((project) => (
          <ProjectsWaterfall entry={project} />
        ))}
      </div>
    </div>
  );
}
