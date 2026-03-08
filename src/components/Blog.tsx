import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import FilterBar from "@components/FilterBar";
import styles from "./Blog.module.css";

type Props = {
  tags: string[];
  data: CollectionEntry<"blog">[];
};

export default function Blog({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [posts, setPosts] = createSignal<CollectionEntry<"blog">[]>([]);

  createEffect(() => {
    setPosts(
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
      <FilterBar
        tags={tags}
        selectedTags={filter()}
        onToggleTag={toggleTag}
      />
      <div class={styles.grid}>
        <ul class={styles.gridList}>
          {posts().map((post) => (
            <li>
              <ArrowCard entry={post} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
