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
      <span>{props.label ?? "Filter:"}</span>
      <ul class={styles.list}>
        <For each={props.tags}>
          {(tag) => (
            <li>
              <label class={styles.control}>
                <input
                  type="checkbox"
                  checked={props.selectedTags.has(tag)}
                  onChange={() => props.onToggleTag(tag)}
                />
                <span>{tag}</span>
              </label>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
