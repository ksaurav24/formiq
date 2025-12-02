import ProjectSubmissionsList from "@/components/pages/projectSubmissionPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { projectId: string } }): Promise<Metadata> {
  const projectName = params.projectId.split("-")[1] || "Unknown";

  return {
    title: `Submissions ${projectName} - Formiq`,
    description: `View and edit details for submissions of project ${projectName} on Formiq. Track submissions.`,
    robots: { index: false, follow: false },
  };
}
export default function ProjectSubmissionPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <ProjectSubmissionsList projectId={params.projectId}/>
    </div>
  )
}