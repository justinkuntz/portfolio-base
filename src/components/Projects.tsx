import { createMemo, createSignal } from "solid-js";
import FilterBar from "@components/FilterBar";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import type { ProjectCardEntry } from "@types";

type Props = {
  tags: string[];
  data: ProjectCardEntry[];
};

export default function Projects({ data, tags }: Props) {
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
    <div>
      <FilterBar
        tags={tags}
        selectedTags={filter()}
        onToggleTag={toggleTag}
      />
      <div>
        {projects().map((project) => (
          <ProjectsWaterfall entry={project} />
        ))}
      </div>
    </div>
  );
}
