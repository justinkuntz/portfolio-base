import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal } from "solid-js";
import Fuse from "fuse.js";
import ArrowCard from "./ArrowCard";
import "./Search.css";

type Props = {
  data: CollectionEntry<"blog">[]
}

export default function Search({data}: Props) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<CollectionEntry<"blog">[]>([]);

  const fuse = new Fuse(data, {
    keys: ["slug", "data.title", "data.summary", "data.tags"],
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
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
  };

  return (
    <div class="search">
      <div class="search__input-wrapper">
        <input
          name="search"
          type="text"
          value={query()}
          onInput={onInput}
          autocomplete="off"
          spellcheck={false}
          placeholder="What are you looking for?"
          class="search__input"
        />
        <svg class="search__icon">
          <use href={`/ui.svg#search`}/>
        </svg>
      </div>
      {(query().length >= 2 && results().length >= 1) && (
        <div class="search__results">
          <div class="search__results-header">
            Found {results().length} results for {`'${query()}'`}
          </div>
          <ul class="search__results-list">
            {results().map(result => (
              <li class="search__results-item">
                <ArrowCard entry={result} pill={true} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}