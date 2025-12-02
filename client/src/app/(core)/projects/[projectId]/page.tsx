import ProjectDetailsContent from "@/components/pages/projectPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { projectId: string } }): Promise<Metadata> {
  const projectName = params.projectId.split("-")[1] || "Unknown";

  return {
    title: `Project ${projectName} - Formiq`,
    description: `View and edit details for project ${projectName} on Formiq. Track submissions, analytics, and settings.`,
    robots: { index: false, follow: false },
  };
}

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div> 
      <ProjectDetailsContent projectId={params.projectId} />
    </div>
  );
}
