import type { JSX } from "solid-js";
import ProjectsWaterfall from "@components/ProjectsWaterfall";
import type { ProjectCardEntry } from "@types";
import styles from "./AnimatedProjects.module.css";

type Props = {
  projects: ProjectCardEntry[];
};

export default function AnimatedProjects({ projects }: Props): JSX.Element {
  return (
    <div class={styles.root}>
      {projects.map((entry) => (
        <ProjectsWaterfall entry={entry} />
      ))}
    </div>
  );
}
