// app/legal/privacy/page.tsx
// Server Component (no "use client")
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, ArrowUpRight, CheckCircle2 } from "lucide-react";

type Section = {
  id: string;
  title: string;
  content: any;
};

const EFFECTIVE = "October 17, 2025";
const UPDATED = "October 17, 2025";

const sections: Section[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          This Privacy Policy describes how Formiq (“we”, “our”, “us”) collects, uses, and protects
          personal information when you use our Service.
        </p>
        <p>
          By using Formiq, you agree to the collection and use of information in accordance with this
          Policy.
        </p>
      </div>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <div className="space-y-6 text-muted-foreground">
        <div className="space-y-2">
          <h3 className="text-base font-medium">a. Authentication Information</h3>
          <p>
            When you sign in using Google or GitHub OAuth, we collect: Name, Email address, Profile
            picture (if available). This data is used solely for user authentication and identification
            within the Formiq platform.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-medium">b. Project and Usage Information</h3>
          <p>
            We collect data related to your Formiq projects, including: Project name and identifier,
            Authorized domains, API key (public key for integration), Number and timing of submissions,
            and metadata such as timestamps and IP addresses (for rate limiting and analytics).
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-medium">c. Form Submission Data</h3>
          <p>
            The actual data submitted through your frontend forms (e.g., name, message, email) is
            stored securely and only accessible to you through your dashboard.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We use collected data to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Authenticate users and manage access;</li>
          <li>Store and deliver form submissions;</li>
          <li>Monitor system health and performance;</li>
          <li>Prevent abuse and enforce rate limits;</li>
          <li>Improve service quality and reliability.</li>
        </ul>
        <p>We do not sell, rent, or trade your information with third parties.</p>
      </div>
    ),
  },
  {
    id: "data-retention",
    title: "4. Data Retention",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Form submissions and related logs may be automatically deleted after a defined retention
          period or upon account deletion.
        </p>
        <p>We may retain anonymized analytical data for service improvement.</p>
      </div>
    ),
  },
  {
    id: "sharing-disclosure",
    title: "5. Data Sharing and Disclosure",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We may disclose limited data only when required:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>To comply with legal obligations or court orders;</li>
          <li>To protect the rights, property, or safety of Formiq or other users;</li>
          <li>
            To service providers strictly necessary for operating the platform (e.g., email notifications
            via SendGrid).
          </li>
        </ul>
        <p>
          These third-party services are contractually bound to protect your data and comply with
          applicable data protection laws.
        </p>
      </div>
    ),
  },
  {
    id: "data-security",
    title: "6. Data Security",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We implement appropriate technical and organizational measures to protect personal data from
          unauthorized access, alteration, or destruction, including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>HTTPS encryption for all network communications;</li>
          <li>Secure token-based authentication;</li>
          <li>Access controls and limited database exposure.</li>
        </ul>
        <p>
          While we strive to protect your data, no online service can guarantee absolute security.
        </p>
      </div>
    ),
  },
  {
    id: "cookies-tracking",
    title: "7. Cookies and Tracking",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We use minimal session cookies solely for authentication and maintaining your logged-in state.
          We do not use cookies for advertising, tracking, or profiling purposes.
        </p>
      </div>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You may:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Request access to the personal data we hold about you;</li>
          <li>Request correction or deletion of your data;</li>
          <li>Withdraw consent and delete your account at any time.</li>
        </ul>
        <p>
          All such requests can be made by contacting <a className="underline" href="mailto:formiq.support@gmail.com">formiq.support@gmail.com</a>.
        </p>
      </div>
    ),
  },
  {
    id: "children",
    title: "9. Children’s Privacy",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Formiq does not knowingly collect data from individuals under 13 years of age. If we learn
          that we have inadvertently collected personal information from a minor, we will promptly
          delete it.
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to This Privacy Policy",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices or legal
          requirements. The latest version will always be available on our website, with the “Last
          Updated” date clearly indicated.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Information",
    content: (
      <div className="space-y-1 text-muted-foreground">
        <p>For questions, concerns, or data-related requests, contact:</p>
        <p>Email: <a className="underline" href="mailto:formiq.support@gmail.com">formiq.support@gmail.com</a></p>
        <p>Address: Pune, Maharashtra, India</p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div id="top" className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Shield className="size-5 text-muted-foreground" />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Effective: {EFFECTIVE}</Badge>
            <Badge variant="outline">Last Updated: {UPDATED}</Badge>
          </div>
          <p className="text-muted-foreground">
            Learn how Formiq collects, uses, and protects your information.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* SSR-friendly print hint */}
          <Button asChild variant="outline">
            <a href="#top" aria-label="Print this page (use your browser’s print dialog)">
              Print (Ctrl/Cmd+P)
            </a>
          </Button>
          <Button asChild>
            <Link href="/help">Contact Support</Link>
          </Button>
        </div>
      </div>

      {/* ToC */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">On this page</CardTitle>
          <CardDescription>Jump to a section</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 ">
          <div className="flex overflow-x-auto gap-2  no-scrollbar">
            {sections.map((s) => (
              <Button
                key={s.id}
                asChild
                variant="outline"
                size="sm"
                className="whitespace-nowrap mb-4"
              >
                <a href={`#${s.id}`}>{s.title}</a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-10">
            {/* Intro summary ribbon */}
            <div className="rounded-lg border bg-muted/30 p-4 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                We collect only what’s necessary to provide the Service, protect against abuse, and
                improve reliability. You control your data and can request access or deletion at any time.
              </p>
            </div>

            {/* Sections */}
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-20">
                <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
                <Separator className="my-3" />
                <div className="leading-7">{s.content}</div>
                <div className="mt-4">
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <a href="#top" aria-label="Back to top">
                      Back to top
                      <ArrowUpRight className="ml-1 size-4" />
                    </a>
                  </Button>
                </div>
              </section>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Helpful links */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/legal/terms">Terms & Conditions</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/help">Help Center</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/status">Status</Link>
        </Button>
      </div>
    </div>
  );
}
