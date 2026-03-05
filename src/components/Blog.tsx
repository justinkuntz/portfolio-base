import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import "./Blog.css";

type Props = {
  tags: string[]
  data: CollectionEntry<"blog">[]
}

export default function Blog({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [posts, setPosts] = createSignal<CollectionEntry<"blog">[]>(data);

  createEffect(() => {
    setPosts(data.filter((entry) =>
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
    <div class="blog">
      <div class="blog__filter-section">
        <div class="blog__filter">
          <div class="blog__filter-label">Filter:</div>
          <ul class="blog__filter-list">
            <For each={tags}>
              {(tag) => (
                <li class="blog__filter-item">
                  <button
                    class="blog__filter-button"
                    classList={{ "blog__filter-button--active": filter().has(tag) }}
                    onClick={() => toggleTag(tag)}
                  >
                    <svg class="blog__filter-icon">
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
      <div class="blog__posts-section">
        <ul class="blog__posts-list">
          {posts().map((post) => (
            <li class="blog__posts-item">
              <ArrowCard entry={post} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
