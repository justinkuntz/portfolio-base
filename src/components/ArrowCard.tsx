import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";
import "./ArrowCard.css";

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
}

export default function ArrowCard({entry, pill}: Props) {
    return (
      <a href={`/${entry.collection}/${entry.slug}`} class="arrow-card">
        <div class="arrow-card__content">
          <div class="arrow-card__header">
            {pill && (
              <div class="arrow-card__pill">
                {entry.collection === "blog" ? "post" : "project"}
              </div>
            )}
            <div class="arrow-card__date">
              {formatDate(entry.data.date)}
            </div>
          </div>
          <div class="arrow-card__title">
            {entry.data.title}
          </div>

          <div class="arrow-card__description">
            {entry.data.description}
          </div>
          <ul class="arrow-card__tags">
            {entry.data.tags.map((tag:string) => (
              <li class="arrow-card__tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <svg class="arrow-card__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line class="arrow-card__icon-line" x1="5" y1="12" x2="19" y2="12" />
          <polyline class="arrow-card__icon-arrow" points="12 5 19 12 12 19" />
        </svg>
      </a>
   );
}