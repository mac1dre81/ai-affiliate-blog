import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | AI Affiliate Blog",
  description:
    "Our privacy policy - how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose lg:prose-xl max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to AI Affiliate Blog (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law
            protects you.
          </p>
        </section>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4">Quick Summary</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>We collect minimal personal information</li>
            <li>We use cookies and analytics to improve your experience</li>
            <li>We never sell your personal information</li>
            <li>We use secure systems to protect your data</li>
            <li>You can request deletion of your data at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Information You Provide to Us
          </h3>
          <p className="mb-4">We may collect the following information when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Subscribe to our newsletter:</strong> Email address, name
              (optional)
            </li>
            <li>
              <strong>Contact us:</strong> Name, email address, message content
            </li>
            <li>
              <strong>Create an account:</strong> Username, email address,
              password (encrypted)
            </li>
            <li>
              <strong>Make a purchase:</strong> Name, email, payment information
              (processed securely by Stripe)
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Information Automatically Collected
          </h3>
          <p className="mb-4">
            When you visit our website, we automatically collect certain
            information about your device and browsing activity:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Technical Data:</strong> IP address, browser type and
              version, time zone setting, operating system, device type
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, time spent on pages,
              links clicked, referral source
            </li>
            <li>
              <strong>Location Data:</strong> Approximate geographic location
              based on IP address
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>To provide our services:</strong> Deliver content, process
              subscriptions, respond to inquiries
            </li>
            <li>
              <strong>To improve our website:</strong> Analyze usage patterns,
              optimize content, fix bugs
            </li>
            <li>
              <strong>To communicate with you:</strong> Send newsletters,
              updates, and promotional content (with your consent)
            </li>
            <li>
              <strong>For security:</strong> Detect and prevent fraud, abuse, and
              security incidents
            </li>
            <li>
              <strong>For legal compliance:</strong> Comply with legal
              obligations and protect our rights
            </li>
            <li>
              <strong>For analytics:</strong> Understand how visitors use our
              site to improve user experience
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on
            our website and store certain information.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Essential Cookies:</strong> Required for the website to
              function properly (e.g., authentication, security)
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how visitors
              interact with our website (Google Analytics)
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your preferences and
              settings
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Track your browsing habits to
              show relevant advertisements
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Managing Your Cookie Preferences
          </h3>
          <p className="mb-4">
            You can control and manage cookies in various ways:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Most browsers allow you to refuse or accept cookies through
              settings
            </li>
            <li>You can delete cookies already stored on your device</li>
            <li>
              Note: Disabling cookies may affect website functionality
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Third-Party Services
          </h2>
          <p className="mb-4">
            We use third-party services that may collect, monitor, and analyze
            data:
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Analytics</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Google Analytics:</strong> Tracks website usage and
              performance
            </li>
            <li>
              <strong>Privacy Policy:</strong>{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Privacy Policy
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Payment Processing
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Stripe:</strong> Processes payments securely. We do not
              store your credit card information.
            </li>
            <li>
              <strong>Privacy Policy:</strong>{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Stripe Privacy Policy
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Email Marketing</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Email Service Provider:</strong> We use email marketing
              services to send newsletters and updates
            </li>
            <li>You can unsubscribe at any time using the link in our emails</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Affiliate Programs
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              We participate in affiliate programs that may use cookies to track
              referrals
            </li>
            <li>
              See our{" "}
              <Link href="/disclosure" className="text-blue-600 hover:underline">
                Affiliate Disclosure
              </Link>{" "}
              for more information
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Error Tracking</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>GlitchTip/Sentry:</strong> Monitors and tracks errors to
              improve website stability
            </li>
            <li>Collects technical data about errors and crashes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers:</strong> Third-party services that help
              us operate our website (hosting, analytics, email)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets
            </li>
            <li>
              <strong>With Your Consent:</strong> When you explicitly agree to
              share your information
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security
            measures to protect your personal data:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure password storage using industry-standard hashing</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure cloud infrastructure (Netlify, MongoDB Atlas, Upstash)</li>
          </ul>
          <p className="mb-4">
            <strong>Note:</strong> No method of transmission over the internet is
            100% secure. While we strive to protect your personal data, we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this privacy policy:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Account Data:</strong> Until you delete your account
            </li>
            <li>
              <strong>Email Subscriptions:</strong> Until you unsubscribe
            </li>
            <li>
              <strong>Analytics Data:</strong> Typically 26 months (Google
              Analytics default)
            </li>
            <li>
              <strong>Transaction Records:</strong> As required by law (typically
              7 years for tax purposes)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Your Rights and Choices</h2>
          <p className="mb-4">Depending on your location, you may have the following rights:</p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Access and Portability</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Request a copy of your personal data</li>
            <li>Receive your data in a portable format</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Correction and Deletion</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Update or correct inaccurate information</li>
            <li>Request deletion of your personal data</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Opt-Out and Restrictions
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Unsubscribe from marketing emails</li>
            <li>Opt-out of certain data processing activities</li>
            <li>Restrict how we use your data</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Withdraw Consent
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Withdraw consent for data processing at any time</li>
            <li>This does not affect the lawfulness of processing before withdrawal</li>
          </ul>

          <p className="mb-4 mt-6">
            To exercise your rights, please{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Children&apos;s Privacy
          </h2>
          <p className="mb-4">
            Our website is not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13. If
            you are a parent or guardian and believe your child has provided us
            with personal information, please{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. International Data Transfers
          </h2>
          <p className="mb-4">
            Your information may be transferred to and maintained on servers
            located outside of your state, province, country, or other
            governmental jurisdiction where data protection laws may differ.
          </p>
          <p className="mb-4">
            We take steps to ensure that your data is treated securely and in
            accordance with this privacy policy, regardless of where it is
            processed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. GDPR Compliance (EU Users)</h2>
          <p className="mb-4">
            If you are located in the European Economic Area (EEA), you have
            certain data protection rights under GDPR:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
          </ul>
          <p className="mb-4">
            <strong>Legal Basis for Processing:</strong> We process your data
            based on:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your consent</li>
            <li>Contract performance</li>
            <li>Legitimate interests</li>
            <li>Legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. CCPA Rights (California Users)</h2>
          <p className="mb-4">
            If you are a California resident, you have specific rights under the
            California Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to say no to the sale of personal information</li>
            <li>Right to delete personal information</li>
            <li>Right to non-discrimination for exercising CCPA rights</li>
          </ul>
          <p className="mb-4">
            <strong>Note:</strong> We do not sell your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            13. Changes to This Privacy Policy
          </h2>
          <p className="mb-4">
            We may update this privacy policy from time to time to reflect changes
            in our practices or for legal, regulatory, or operational reasons.
          </p>
          <p className="mb-4">
            We will notify you of any material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Posting the new privacy policy on this page</li>
            <li>Updating the &quot;Last Updated&quot; date</li>
            <li>Sending you an email notification (for significant changes)</li>
          </ul>
          <p className="mb-4">
            We encourage you to review this privacy policy periodically for any
            changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this privacy
            policy or our data practices, please contact us:
          </p>
          <ul className="list-none mb-4">
            <li className="mb-2">
              <strong>Email:</strong> [YOUR-EMAIL@example.com]
            </li>
            <li className="mb-2">
              <strong>Contact Form:</strong>{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact Us Page
              </Link>
            </li>
            <li className="mb-2">
              <strong>Response Time:</strong> We aim to respond within 30 days
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Privacy Matters</h2>
          <p className="mb-0">
            We are committed to protecting your privacy and handling your data
            responsibly. This privacy policy is part of our commitment to
            transparency and compliance with data protection laws worldwide.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-gray-600">
            <strong>Related Pages:</strong>
          </p>
          <ul className="text-sm text-gray-600">
            <li>
              <Link href="/disclosure" className="text-blue-600 hover:underline">
                Affiliate Disclosure
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
