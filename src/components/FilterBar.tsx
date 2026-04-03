import { For } from "solid-js";

type Props = {
  tags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  label?: string;
};

export default function FilterBar(props: Props) {
  return (
    <div>
      <span>{props.label ?? "Filter:"}</span>
      <ul>
        <For each={props.tags}>
          {(tag) => (
            <li>
              <label>
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
