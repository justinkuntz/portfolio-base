import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import { cn } from "@lib/utils";

type Props = {
  tags: string[]
  data: CollectionEntry<"projects">[]
}

export default function Projects({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [projects, setProjects] = createSignal<CollectionEntry<"projects">[]>([]);

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
    <div class="grid grid-cols-1 gap-6">
      <div class="col-span-3 w-full mt-12 md:mt-24">
        <div class="flex items-center justify-end gap-3">
          <div class="text-sm font-semibold uppercase text-surface10">Filter:</div>
          <ul class="flex flex-wrap gap-1.5">
            <For each={tags}>
              {(tag) => (
                <li>
                  <button onClick={() => toggleTag(tag)} class={cn("w-full px-2 py-1 rounded", "whitespace-nowrap overflow-hidden overflow-ellipsis", "flex gap-2 items-center", "bg-surface10/5", "hover:bg-surface10/10", "transition-colors duration-300 ease-in-out", filter().has(tag) && "text-surface10")}>
                    <svg class={cn("size-5 fill-surface10/50", "transition-colors duration-300 ease-in-out", filter().has(tag) && "fill-surface10")}>
                      <use href={`/ui.svg#square`} class={cn(!filter().has(tag) ? "block" : "hidden")} />
                      <use href={`/ui.svg#square-check`} class={cn(filter().has(tag) ? "block" : "hidden")} />
                    </svg>
                    {tag}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class="col-span-3">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects().map((project) => (
            <ProjectsWaterfall entry={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
