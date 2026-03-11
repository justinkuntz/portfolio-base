import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal } from "solid-js";
import Fuse from "fuse.js";
import ArrowCard from "./ArrowCard";
import styles from "./Search.module.css";

type SearchEntry = CollectionEntry<"blog"> | CollectionEntry<"projects">;

type Props = {
  data: SearchEntry[];
};

export default function Search({ data }: Props) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<SearchEntry[]>([]);

  const fuse = new Fuse<SearchEntry>(data, {
    keys: [
      "slug",
      "data.title",
      "data.description",
      "data.tags",
      "data.challenge",
      "data.solution",
      "data.results",
      "body",
    ],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  });

  createEffect(() => {
    if (query().length < 2) {
      setResults([]);
    } else {
      setResults(fuse.search(query()).map((result) => result.item));
    }
  });

  const onInput = (e: Event) => {
    const target = (e.target as HTMLInputElement);
    setQuery(target.value);
  };

  return (
    <div class={styles.root}>
      <label class="sr-only" for="site-search">
        Search blog posts and projects
      </label>
      <p id="site-search-help" class="sr-only">
        Enter at least two characters to search blog posts and projects.
      </p>
      <div class={styles.inputWrap}>
        <input
          id="site-search"
          name="search"
          type="search"
          value={query()}
          onInput={onInput}
          aria-describedby="site-search-help site-search-results"
          autocomplete="off"
          spellcheck={false}
          placeholder="What are you looking for?"
          class={styles.input}
        />
        <svg class={styles.inputIcon} aria-hidden="true">
          <use href="/ui.svg#search" />
        </svg>
      </div>
      {query().length >= 2 && (
        <div class={styles.results}>
          <div id="site-search-results" class={styles.resultsLabel} role="status" aria-live="polite">
            {results().length >= 1
              ? `Found ${results().length} results for "${query()}"`
              : `No results found for "${query()}"`}
          </div>
          {results().length >= 1 && (
            <ul class={styles.resultsList}>
              {results().map((result) => (
                <li>
                  <ArrowCard entry={result} pill={true} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
