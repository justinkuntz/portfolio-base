import { MEDIA } from "@config/media";
import type { ProjectCardEntry } from "@types";

type Props = {
  entry: ProjectCardEntry;
  showTags?: boolean;
};

export default function ProjectsWaterfall({
  entry,
  showTags = true,
}: Props) {
  return (
    <a href={`/projects/${entry.slug}`}>
      {showTags && <p>{entry.tags.join(", ")}</p>}
      <h3>{entry.title}</h3>
      <img
        style={{ "aspect-ratio": MEDIA.projectThumbnail.aspectRatio }}
        src={entry.image.src}
        srcset={entry.image.srcset}
        sizes={entry.image.sizes}
        width={entry.image.width}
        height={entry.image.height}
        alt={entry.thumbNailAlt}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
