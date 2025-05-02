import { formatDate } from "@lib/utils";
import type { CollectionEntry } from "astro:content";

type Props = {
  entry: CollectionEntry<"projects">;
};

export default function ProjectsWaterfall({ entry }: Props) {
  return (
    <div class="relative z-0 space-y-4">
      <a href={`/projects/${entry.slug}`} class="group flex flex-col flex-1 items-center border rounded-md hover:bg-surface10/5 border-surface10/15 transition-colors duration-300 ease-in-out">
        <div class="w-full p-6 group-hover:text-surface10 blend">
          <div class="flex items-center justify-between gap-x-4 border-b border-surface10/25 pb-2 mb-6">
            <div class="text-xs uppercase">
              {formatDate(entry.data.date)}
            </div>
            <div class="flex flew-row gap-2">
              {entry.data.tags.map((tag: string) => (
              <div class="text-xs uppercase tracking-wider py-0.5 px-1 rounded bg-surface10/10 text-surface10/75">
                {tag}
              </div>
              ))}
            </div>
          </div>
          <div class="flex flex-1 items-center justify-between gap-x-4">
            <h3 class="text-3xl sm:text-5xl font-bold text-surface10">
            {entry.data.title}
            </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="stroke-current group-hover:stroke-surface10"
              >
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  class="scale-x-0 group-hover:scale-x-100 translate-x-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
                ></line>
                <polyline
                  points="12 5 19 12 12 19"
                  class="translate-x-0 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
                ></polyline>
              </svg>
          </div>
        </div>
        <img
          class="mx-auto w-full h-[36rem] object-cover rounded-b-md"
          src={entry.data.thumbNail.src}
          width="519"
          height="490"
          alt={entry.data.thumbNailAlt}
        />
      </a>
    </div>
  );
}
