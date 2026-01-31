import Link from "next/link";

export const metadata = {
  title: "Affiliate Disclosure | AI Affiliate Blog",
  description:
    "Our affiliate disclosure policy - transparency about our affiliate relationships and how we earn commissions.",
};

export default function DisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>

      <div className="prose lg:prose-xl max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            FTC Disclosure Compliance
          </h2>
          <p className="mb-4">
            In accordance with the Federal Trade Commission&apos;s 16 CFR, Part
            255: &quot;Guides Concerning the Use of Endorsements and
            Testimonials in Advertising,&quot; this website provides the
            following disclosure regarding affiliate relationships.
          </p>
        </section>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4">
            Our Affiliate Relationship Disclosure
          </h2>
          <p className="mb-4">
            <strong>
              This website contains affiliate links and advertisements.
            </strong>
          </p>
          <p className="mb-4">
            When you click on an affiliate link or advertisement and make a
            purchase, we may earn a commission or receive compensation. This
            commission comes at no additional cost to you. The price you pay is
            the same whether you use our affiliate link or go directly to the
            vendor&apos;s website.
          </p>
          <p className="mb-4">
            <strong>We only recommend products and services that:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>We have personally used or thoroughly researched</li>
            <li>We genuinely believe will provide value to our readers</li>
            <li>
              Meet our quality standards and align with our editorial guidelines
            </li>
            <li>We would recommend regardless of any affiliate compensation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Affiliate Programs We Participate In
          </h2>
          <p className="mb-4">
            We are a participant in various affiliate programs, which may
            include but are not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Amazon Associates Program:</strong> As an Amazon
              Associate, we earn from qualifying purchases. This means we may
              earn a commission when you purchase products through our Amazon
              links.
            </li>
            <li>
              <strong>Other Affiliate Networks:</strong> We also participate in
              other affiliate marketing programs including ShareASale, CJ
              Affiliate, Impact, and direct partnerships with brands.
            </li>
            <li>
              <strong>Product Vendors:</strong> We may have direct affiliate
              relationships with specific product manufacturers and service
              providers.
            </li>
          </ul>
          <p className="mb-4">
            The specific affiliate programs and partners may change over time as
            we discover new products and services to recommend to our audience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Our Editorial Independence
          </h2>
          <p className="mb-4">
            While we do earn commissions from affiliate links, our editorial
            content is never influenced by these relationships. We maintain full
            editorial independence and control over all content published on
            this website.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Our reviews, comparisons, and recommendations are based on
              objective research and analysis
            </li>
            <li>
              We clearly label sponsored content when we receive payment
              specifically for creating content
            </li>
            <li>
              Affiliate compensation does not influence our product rankings or
              recommendations
            </li>
            <li>We will not recommend products solely for commission purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            How Affiliate Links Work
          </h2>
          <p className="mb-4">
            When you click on an affiliate link on our website and make a
            purchase:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              You are redirected to the merchant&apos;s website
            </li>
            <li className="mb-2">
              A tracking cookie may be placed in your browser
            </li>
            <li className="mb-2">
              If you complete a purchase within the cookie duration (typically
              24-90 days), we receive a commission
            </li>
            <li className="mb-2">
              The commission is paid by the merchant, not added to your purchase
              price
            </li>
          </ol>
          <p className="mb-4">
            <strong>Important:</strong> You are never obligated to purchase
            through our affiliate links. You can always go directly to the
            merchant&apos;s website if you prefer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Product Reviews and Recommendations
          </h2>
          <p className="mb-4">
            Our product reviews and recommendations are based on:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal experience with the product or service</li>
            <li>Extensive research including user reviews and expert opinions</li>
            <li>Comparison with similar products in the market</li>
            <li>Value for money and quality considerations</li>
            <li>Customer support and company reputation</li>
          </ul>
          <p className="mb-4">
            We strive to provide honest, balanced, and helpful information to
            assist you in making informed purchasing decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Sponsored Content and Paid Partnerships
          </h2>
          <p className="mb-4">
            In addition to affiliate relationships, we may occasionally publish
            sponsored content or enter into paid partnerships with brands.
          </p>
          <p className="mb-4">
            <strong>All sponsored content will be clearly labeled as:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>&quot;Sponsored Post&quot;</li>
            <li>&quot;Paid Partnership&quot;</li>
            <li>&quot;In collaboration with [Brand Name]&quot;</li>
          </ul>
          <p className="mb-4">
            Even for sponsored content, we maintain editorial independence and
            only partner with brands that align with our values and provide
            genuine value to our audience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Trust Matters</h2>
          <p className="mb-4">
            Your trust is our most valuable asset. We are committed to
            transparency about our business model and how we earn revenue.
            Affiliate commissions help us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Keep this website free for all visitors</li>
            <li>Create high-quality, researched content</li>
            <li>Test and review products thoroughly</li>
            <li>Maintain and improve our website</li>
            <li>Continue providing valuable resources to our community</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Price and Availability</h2>
          <p className="mb-4">
            Please note that prices and availability of products mentioned on
            this website:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Are subject to change at any time</li>
            <li>May vary by location and retailer</li>
            <li>Were accurate at the time of publication but may have changed</li>
            <li>
              Should be verified on the merchant&apos;s website before purchase
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Third-Party Advertisements
          </h2>
          <p className="mb-4">
            We may use third-party advertising companies to serve ads when you
            visit our website. These companies may use information about your
            visits to this and other websites to provide advertisements about
            goods and services of interest to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4">
            We may update this affiliate disclosure from time to time to reflect
            changes in our affiliate relationships or to comply with regulatory
            requirements. We encourage you to review this page periodically.
          </p>
          <p className="mb-4">
            The &quot;Last Updated&quot; date at the top of this page indicates
            when this disclosure was last revised.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
          <p className="mb-4">
            If you have any questions about our affiliate relationships or this
            disclosure policy, please{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
          <p className="mb-4">
            We are committed to transparency and are happy to answer any
            questions you may have about how we operate this website and earn
            revenue.
          </p>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Thank You for Your Support
          </h2>
          <p className="mb-4">
            By using our affiliate links, you help support this website at no
            extra cost to you. We genuinely appreciate your support, which
            allows us to continue creating valuable content for our community.
          </p>
          <p className="mb-0">
            Thank you for being part of our community and for your trust in our
            recommendations!
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
