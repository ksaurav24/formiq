// app/legal/terms/page.tsx
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
import {
  Shield,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

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
      <p className="text-muted-foreground">
        Welcome to Formiq (“we”, “our”, or “us”). Formiq provides a lightweight backend and SDK for frontend developers to manage and store form submissions securely. These Terms and Conditions (“Terms”) govern your access to and use of the Formiq platform, SDK, website, and related services (collectively, the “Service”). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with any provision herein, you must not access or use the Service.
      </p>
    ),
  },
  {
    id: "service-overview",
    title: "2. Service Overview",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>Formiq enables developers to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Collect and manage form submissions from static or frontend‑only websites.</li>
          <li>Authenticate using social login via Google or GitHub.</li>
          <li>View and manage submission data through a developer dashboard.</li>
          <li>Receive email notifications for new submissions (where applicable).</li>
        </ul>
        <p>
          This MVP version of Formiq is offered free of charge and is intended solely for personal or educational use, particularly for developer portfolios or prototype projects.
        </p>
      </div>
    ),
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>To use the Service, you must:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Be at least 13 years of age or the age of digital consent in your jurisdiction.</li>
          <li>Have a valid Google or GitHub account for authentication.</li>
          <li>Use the Service in compliance with applicable local, national, and international laws.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "account-security",
    title: "4. Account Registration and Security",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          You must authenticate using a supported OAuth provider (Google or GitHub). You are responsible for all activity that occurs under your account. You must not share, sell, or transfer your access credentials to any third party. We reserve the right to suspend or terminate any account suspected of misuse or violation of these Terms.
        </p>
      </div>
    ),
  },
  {
    id: "permitted-use",
    title: "5. Permitted Use",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You may use Formiq only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use the Service to collect or transmit any content that is unlawful, abusive, or infringes upon the rights of others.</li>
          <li>Use the Service to collect sensitive personal information, including but not limited to passwords, credit card numbers, government IDs, or health data.</li>
          <li>Attempt to access data or systems without authorization, interfere with platform integrity, or reverse‑engineer any part of the Service.</li>
          <li>Use automated bots or scripts to overwhelm the Service or bypass rate limits.</li>
          <li>Use Formiq for commercial SaaS, production systems, or high‑volume traffic without prior consent.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "ip-rights",
    title: "6. Intellectual Property Rights",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>All content, software, SDKs, APIs, designs, trademarks, and documentation made available through the Service are the property of Formiq and protected by applicable intellectual property laws.</p>
        <p>You are granted a limited, non‑exclusive, revocable, and non‑transferable license to use the SDKs and APIs solely for integrating your frontend forms with Formiq.</p>
        <p>You retain ownership of the data and content you submit through the Service.</p>
      </div>
    ),
  },
  {
    id: "data-handling",
    title: "7. Data Handling and Storage",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>Form submissions and associated metadata (e.g., timestamps, form IDs) are securely stored and may be automatically deleted after a defined retention period for maintenance or compliance reasons.</p>
        <p>We may temporarily log certain technical data (e.g., IP address, request counts) for performance, rate‑limiting, and security purposes.</p>
        <p>The Service is provided “as‑is” and does not guarantee permanent data storage or continuous availability.</p>
      </div>
    ),
  },
  {
    id: "warranties",
    title: "8. Disclaimer of Warranties",
    content: (
      <p className="text-muted-foreground">
        The Service is provided “as is” and “as available,” without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error‑free, secure, or meet your specific requirements.
      </p>
    ),
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: (
      <p className="text-muted-foreground">
        To the maximum extent permitted by law, Formiq, its developers, and affiliates shall not be liable for any indirect, incidental, consequential, or special damages arising from or in connection with your use of the Service, even if advised of the possibility of such damages. Your sole remedy for dissatisfaction with the Service is to discontinue its use.
      </p>
    ),
  },
  {
    id: "termination",
    title: "10. Suspension and Termination",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We may suspend or terminate your account or access to the Service, with or without notice, if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>You violate these Terms.</li>
          <li>Your usage poses a security or operational risk to the Service.</li>
          <li>We are required to do so by law or regulatory order.</li>
        </ul>
        <p>Upon termination, all rights granted to you under these Terms will immediately cease.</p>
      </div>
    ),
  },
  {
    id: "modifications",
    title: "11. Modifications to the Service",
    content: (
      <p className="text-muted-foreground">
        We reserve the right to modify, update, or discontinue any part of the Service at any time, with or without notice, for maintenance, feature changes, or other operational reasons.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    content: (
      <p className="text-muted-foreground">
        These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
      </p>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content: (
      <p className="text-muted-foreground">
        For questions or concerns about these Terms, please contact: formiq.support@gmail.com
      </p>
    ),
  },
  {
    id: "changes",
    title: "14. Changes to these Terms",
    content: (
      <p className="text-muted-foreground">
        We may update these Terms from time to time. When we do, we will revise the “Last Updated” date at the top of this page. Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    id: "severability",
    title: "15. Severability and Waiver",
    content: (
      <p className="text-muted-foreground">
        If any provision of these Terms is held to be invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision shall not be deemed a waiver of such right or provision.
      </p>
    ),
  },
  {
    id: "entire-agreement",
    title: "16. Entire Agreement",
    content: (
      <p className="text-muted-foreground">
        These Terms constitute the entire agreement between you and Formiq regarding the Service and supersede any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and Formiq regarding the Service.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div id="top" className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Shield className="size-5 text-muted-foreground" />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Terms & Conditions
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Effective: {EFFECTIVE}</Badge>
            <Badge variant="outline">Last Updated: {UPDATED}</Badge>
          </div>
          <p className="text-muted-foreground">
            Please review these Terms carefully before using the Service.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* SSR-safe guidance for print */}
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
        <CardContent className="pt-4">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
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
                By using Formiq, you agree to these Terms. If you disagree, please discontinue use of the Service.
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
          <Link href="/legal/privacy">Privacy Policy</Link>
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
