import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ArrowCard from "@components/ArrowCard";
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
