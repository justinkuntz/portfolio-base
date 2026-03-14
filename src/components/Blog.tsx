import type { CollectionEntry } from "astro:content";
import { createMemo, createSignal } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import FilterBar from "@components/FilterBar";
import type { GridColumns } from "@types";
import styles from "./Blog.module.css";

type Props = {
  tags: string[];
  data: CollectionEntry<"blog">[];
  gridColumns: GridColumns;
};

export default function Blog({ data, tags, gridColumns }: Props) {
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
    <div class={styles.root}>
      <FilterBar
        tags={tags}
        selectedTags={filter()}
        onToggleTag={toggleTag}
      />
      <div class={styles.grid}>
        <ul
          classList={{
            [styles.gridList]: true,
            [styles["gridList--1"]]: gridColumns === 1,
            [styles["gridList--2"]]: gridColumns === 2,
            [styles["gridList--3"]]: gridColumns === 3,
            [styles["gridList--4"]]: gridColumns === 4,
          }}
        >
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
