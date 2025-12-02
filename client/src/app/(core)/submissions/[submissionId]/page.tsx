// app/submissions/[submissionId]/page.tsx
// Server Component
 
import SubmissionDetailContent from "@/components/pages/SubmissionDetailPage";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { submissionId: string };
}): Promise<Metadata> {
  const shortId = params.submissionId.slice(0, 8);

  return {
    title: `Submission ${shortId} - Formiq`,
    description: `View details and manage submission ${shortId} on Formiq. Review form data, metadata, and actions.`,
    robots: { index: false, follow: false },
  };
}

export default function SubmissionDetailPage({
  params,
}: {
  params: { submissionId: string };
}) {
  return (
    <div>
      <SubmissionDetailContent submissionId={params.submissionId} />
    </div>
  );
}
