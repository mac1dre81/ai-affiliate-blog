import Link from "next/link";

export const metadata = {
  title: "Terms of Service | AI Affiliate Blog",
  description:
    "Terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose lg:prose-xl max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Agreement to Terms
          </h2>
          <p className="mb-4">
            By accessing or using AI Affiliate Blog (the &quot;Website&quot;),
            you agree to be bound by these Terms of Service
            (&quot;Terms&quot;). If you do not agree to these Terms, please do
            not use our Website.
          </p>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. Changes
            will be effective immediately upon posting. Your continued use of
            the Website after changes are posted constitutes your acceptance of
            the modified Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">Permitted Use</h3>
          <p className="mb-4">You may use our Website for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal, non-commercial purposes</li>
            <li>Reading and sharing our content</li>
            <li>Engaging with our community</li>
            <li>Purchasing products through affiliate links</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Prohibited Activities
          </h3>
          <p className="mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Violate any applicable laws or regulations
            </li>
            <li>
              Infringe on our or any third party&apos;s intellectual property
              rights
            </li>
            <li>
              Transmit any viruses, malware, or harmful code
            </li>
            <li>
              Attempt to gain unauthorized access to our systems
            </li>
            <li>
              Scrape, harvest, or collect information from the Website using
              automated means
            </li>
            <li>
              Interfere with or disrupt the Website or servers
            </li>
            <li>
              Use the Website for any fraudulent or illegal purpose
            </li>
            <li>
              Impersonate any person or entity
            </li>
            <li>
              Post or transmit any offensive, defamatory, or inappropriate
              content
            </li>
            <li>
              Spam or engage in unsolicited advertising
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Intellectual Property Rights
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">Our Content</h3>
          <p className="mb-4">
            All content on this Website, including but not limited to text,
            graphics, logos, images, videos, audio clips, digital downloads,
            and software, is the property of AI Affiliate Blog or its content
            suppliers and is protected by United States and international
            copyright laws.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Limited License</h3>
          <p className="mb-4">
            We grant you a limited, non-exclusive, non-transferable license to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and use the Website for personal purposes</li>
            <li>Print or download content for personal use</li>
            <li>Share our content with proper attribution</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Restrictions</h3>
          <p className="mb-4">You may NOT:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy our content without permission</li>
            <li>Use our content for commercial purposes</li>
            <li>Remove copyright or proprietary notices</li>
            <li>Transfer or sell our content to third parties</li>
            <li>Create derivative works from our content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. User-Generated Content
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Your Responsibilities
          </h3>
          <p className="mb-4">
            If you submit, post, or transmit any content to our Website
            (comments, reviews, feedback, etc.), you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Grant us a worldwide, royalty-free license to use your content</li>
            <li>Warrant that you own or have rights to the content</li>
            <li>Agree not to post illegal or infringing content</li>
            <li>Acknowledge that we may remove any content at our discretion</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Content Moderation</h3>
          <p className="mb-4">
            We reserve the right to monitor, edit, or remove any user-generated
            content that violates these Terms or is otherwise objectionable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Affiliate Relationships and Links
          </h2>
          <p className="mb-4">
            This Website contains affiliate links. When you click on these links
            and make a purchase, we may earn a commission at no additional cost
            to you.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              We are not responsible for the content, products, or services of
              third-party websites
            </li>
            <li>
              Your transactions with third parties are solely between you and
              the third party
            </li>
            <li>
              We do not warrant or guarantee any products or services offered
              through affiliate links
            </li>
            <li>
              Please read our{" "}
              <Link href="/disclosure" className="text-blue-600 hover:underline">
                Affiliate Disclosure
              </Link>{" "}
              for more information
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Third-Party Links and Services
          </h2>
          <p className="mb-4">
            Our Website may contain links to third-party websites or services
            that are not owned or controlled by us.
          </p>
          <p className="mb-4">
            <strong>We have no control over and assume no responsibility for:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The content, privacy policies, or practices of third-party websites</li>
            <li>Any damages or losses caused by third-party websites</li>
            <li>The availability or accuracy of third-party services</li>
          </ul>
          <p className="mb-4">
            We strongly advise you to read the terms and conditions and privacy
            policies of any third-party websites you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Purchases and Payment
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">Payment Processing</h3>
          <p className="mb-4">
            If you purchase any products or services through our Website:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Payment processing is handled by Stripe</li>
            <li>You agree to provide accurate payment information</li>
            <li>You authorize us to charge your payment method</li>
            <li>All sales are final unless otherwise stated</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Pricing</h3>
          <p className="mb-4">
            All prices are in USD unless otherwise specified. We reserve the
            right to change prices at any time without prior notice. Price
            changes do not affect orders already placed.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Refunds</h3>
          <p className="mb-4">
            Refund eligibility depends on the specific product or service
            purchased. Please refer to the product-specific refund policy or
            contact us for details.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Disclaimers and Warranties
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            &quot;As Is&quot; Basis
          </h3>
          <p className="mb-4">
            THE WEBSITE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
            OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy or completeness of content</li>
            <li>Uninterrupted or error-free operation</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            No Professional Advice
          </h3>
          <p className="mb-4">
            The content on this Website is for informational purposes only and
            should not be considered:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Professional advice (legal, financial, medical, etc.)</li>
            <li>A substitute for professional consultation</li>
            <li>Personalized recommendations for your specific situation</li>
          </ul>
          <p className="mb-4">
            Always consult with qualified professionals for advice specific to
            your circumstances.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Product Reviews</h3>
          <p className="mb-4">
            Product reviews and recommendations represent our opinions based on
            our research and experience. Your experience may differ. We are not
            responsible for your purchase decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Limitation of Liability
          </h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI AFFILIATE BLOG AND ITS
            OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages
            </li>
            <li>Loss of profits, revenue, data, or use</li>
            <li>
              Damages arising from your use or inability to use the Website
            </li>
            <li>
              Damages resulting from any products or services purchased through
              affiliate links
            </li>
            <li>
              Errors, mistakes, or inaccuracies in content
            </li>
            <li>
              Unauthorized access to our servers or personal information
            </li>
          </ul>
          <p className="mb-4">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU
            PAID US IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO
            LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold harmless AI Affiliate Blog
            and its officers, directors, employees, and agents from any claims,
            damages, obligations, losses, liabilities, costs, or debt, and
            expenses arising from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your use of the Website</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Any content you submit or post</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            11. Privacy and Data Protection
          </h2>
          <p className="mb-4">
            Your use of the Website is also governed by our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . Please review our Privacy Policy to understand our practices
            regarding collection and use of your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            12. Account Termination
          </h2>
          <p className="mb-4">
            We reserve the right to terminate or suspend your access to the
            Website immediately, without prior notice or liability, for any
            reason, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Breach of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>At our sole discretion</li>
          </ul>
          <p className="mb-4">
            Upon termination, your right to use the Website will immediately
            cease.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            13. Governing Law and Jurisdiction
          </h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of [YOUR STATE], United States, without regard
            to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Any disputes arising from or relating to these Terms or the Website
            shall be resolved in the state or federal courts located in [YOUR
            COUNTY], [YOUR STATE], and you consent to the personal jurisdiction
            of such courts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            14. Dispute Resolution
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Informal Negotiation
          </h3>
          <p className="mb-4">
            If you have a dispute with us, you agree to first contact us and
            attempt to resolve the dispute informally by contacting us at{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              our contact page
            </Link>
            .
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Arbitration</h3>
          <p className="mb-4">
            If we cannot resolve the dispute within 30 days of your initial
            contact, the dispute shall be resolved by binding arbitration in
            accordance with the rules of the American Arbitration Association.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            Class Action Waiver
          </h3>
          <p className="mb-4">
            You agree to bring claims against us only in your individual
            capacity and not as a plaintiff or class member in any class or
            representative action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
          <p className="mb-4">
            If any provision of these Terms is held to be unenforceable or
            invalid, such provision will be changed and interpreted to accomplish
            the objectives of such provision to the greatest extent possible
            under applicable law, and the remaining provisions will continue in
            full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
          <p className="mb-4">
            These Terms, together with our Privacy Policy and Affiliate
            Disclosure, constitute the entire agreement between you and AI
            Affiliate Blog regarding the use of the Website and supersede all
            prior agreements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please
            contact us:
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
          </ul>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Acknowledgment</h2>
          <p className="mb-0">
            BY USING THIS WEBSITE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE
            TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE
            TO THESE TERMS, PLEASE DO NOT USE OUR WEBSITE.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-gray-600">
            <strong>Related Pages:</strong>
          </p>
          <ul className="text-sm text-gray-600">
            <li>
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/disclosure" className="text-blue-600 hover:underline">
                Affiliate Disclosure
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
