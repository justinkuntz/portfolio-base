import { For } from "solid-js";
import styles from "./FilterBar.module.css";

type Props = {
  tags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  label?: string;
};

export default function FilterBar(props: Props) {
  return (
    <div class={styles.root}>
      <div class={styles.inner}>
        <span class={styles.label}>{props.label ?? "Filter:"}</span>
        <ul class={styles.list}>
          <For each={props.tags}>
            {(tag, index) => (
              <li>
                <label
                  class={styles.control}
                  classList={{ [styles.controlActive]: props.selectedTags.has(tag) }}
                  for={`filter-${index()}`}
                >
                  <input
                    id={`filter-${index()}`}
                    type="checkbox"
                    class={styles.input}
                    checked={props.selectedTags.has(tag)}
                    onChange={() => props.onToggleTag(tag)}
                  />
                  <svg class={styles.icon} aria-hidden="true">
                    <use href="/ui.svg#square" class={styles.iconUnchecked} />
                    <use href="/ui.svg#square-check" class={styles.iconChecked} />
                  </svg>
                  <span>{tag}</span>
                </label>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
}
