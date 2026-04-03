import type { JSX } from "solid-js";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import type { ProjectCardEntry } from "@types";

type Props = {
  projects: ProjectCardEntry[];
};

export default function AnimatedProjects({ projects }: Props): JSX.Element {
  return (
    <div>
      {projects.map((entry) => (
        <ProjectsWaterfall entry={entry} />
      ))}
    </div>
  );
}
