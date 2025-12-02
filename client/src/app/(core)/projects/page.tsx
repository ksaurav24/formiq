import ProjectsPage from "@/components/pages/projectsListingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formiq Projects - Manage Your Form Projects",
  description: "View and manage all your form projects securely on Formiq. Track submissions, analytics, and project settings in one place.",
  robots: { index: false, follow: false },
};


export default function RootProjectPage() {
  return <div>
    <ProjectsPage />
  </div>;
}