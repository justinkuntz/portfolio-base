import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";
import "./ProjectsWaterfall.css";

type Props = {
  entry: CollectionEntry<"projects">;
};

export default function ProjectsWaterfall({ entry }: Props) {
  return (
    <div class="waterfall-project">
      <a href={`/projects/${entry.slug}`} class="waterfall-project__link">
        <div class="waterfall-project__content">
          <div class="waterfall-project__header">
            <div class="waterfall-project__date">
              {formatDate(entry.data.date)}
            </div>
            <div class="waterfall-project__tags">
              {entry.data.tags.map((tag: string) => (
                <div class="waterfall-project__tag">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div class="waterfall-project__title-wrapper">
            <h3 class="waterfall-project__title">
              {entry.data.title}
            </h3>
            <svg
              class="waterfall-project__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                class="waterfall-project__icon-line"
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />
              <polyline
                class="waterfall-project__icon-arrow"
                points="12 5 19 12 12 19"
              />
            </svg>
          </div>
        </div>
        <img
          class="waterfall-project__image"
          src={entry.data.thumbNail.src}
          width={entry.data.thumbNail.width}
          height={entry.data.thumbNail.height}
          alt={entry.data.thumbNailAlt}
        />
      </a>
    </div>
  );
}
