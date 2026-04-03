import type { CollectionEntry } from "astro:content";
import { createMemo, createSignal } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import FilterBar from "@components/FilterBar";

type Props = {
  tags: string[];
  data: CollectionEntry<"blog">[];
};

export default function Blog({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const posts = createMemo(() =>
    data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some(
          (tag: string) => tag.toLowerCase() === String(value).toLowerCase()
        )
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
      <ul>
        {posts().map((post) => (
          <li>
            <ArrowCard entry={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
