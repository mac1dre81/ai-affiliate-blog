import Link from "next/link";

export const metadata = {
  title: "Contact Us | AI Affiliate Blog",
  description:
    "Get in touch with us - we'd love to hear from you. Contact us with questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="prose lg:prose-xl max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          We&apos;d love to hear from you! Whether you have a question about
          our content, need support, or have a partnership proposal, our team
          is ready to answer all your questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Email Us</h2>
            <p className="mb-4">
              For general inquiries, feedback, or support:
            </p>
            <p className="text-lg">
              <strong>support@[yourdomain].com</strong>
            </p>
            <p className="text-sm text-gray-600 mt-4">
              We typically respond within 24-48 hours
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Business Inquiries
            </h2>
            <p className="mb-4">
              For partnerships, sponsorships, or media inquiries:
            </p>
            <p className="text-lg">
              <strong>business@[yourdomain].com</strong>
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Let&apos;s explore opportunities together
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          <form className="space-y-6 bg-white p-8 rounded-lg shadow-md border">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback or Suggestion</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="press">Press or Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a demo contact form. To make it
                functional, you&apos;ll need to:
              </p>
              <ul className="list-disc pl-6 text-sm text-gray-700 mt-2">
                <li>Create an API route to handle form submissions</li>
                <li>
                  Integrate with an email service (SendGrid, Mailgun, AWS SES)
                </li>
                <li>
                  Or use a form service like Formspree, Netlify Forms, or
                  Formspark
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled
            >
              Send Message (Form Not Active - See Note Above)
            </button>

            <p className="text-sm text-gray-600 text-center">
              * Required fields
            </p>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                How quickly will I receive a response?
              </summary>
              <p className="mt-2 text-gray-700">
                We aim to respond to all inquiries within 24-48 hours during
                business days (Monday-Friday). For urgent matters, please
                indicate this in your subject line.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Can I request a product review?
              </summary>
              <p className="mt-2 text-gray-700">
                Yes! We&apos;re always interested in reviewing relevant products
                for our audience. Please send product details and specifications
                to our business email. Note that we maintain editorial
                independence and cannot guarantee a positive review.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Do you accept guest posts?
              </summary>
              <p className="mt-2 text-gray-700">
                We occasionally accept high-quality guest posts that provide
                genuine value to our audience. Please send your pitch to our
                business email with a brief outline and writing samples.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                How do I report an issue with your website?
              </summary>
              <p className="mt-2 text-gray-700">
                If you encounter technical issues, broken links, or have
                accessibility concerns, please email us with details including
                the page URL, browser you&apos;re using, and a description of
                the issue.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Can I advertise on your website?
              </summary>
              <p className="mt-2 text-gray-700">
                We offer various advertising opportunities. Please contact us at
                our business email with details about your company and what
                you&apos;re looking to promote. We&apos;ll provide our media kit
                and pricing information.
              </p>
            </details>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
          <p className="mb-4">Stay up to date with our latest content:</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Twitter
            </a>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Facebook
            </a>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              YouTube
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Note: Update these links with your actual social media profiles
          </p>
        </section>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Privacy & Your Information
          </h2>
          <p className="mb-4">
            When you contact us, we collect your name, email address, and any
            information you choose to provide in your message. We use this
            information solely to respond to your inquiry and will not share it
            with third parties without your consent.
          </p>
          <p className="mb-0">
            For more information, please read our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-gray-600">
            <strong>Other Ways to Learn More:</strong>
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
              <Link href="/" className="text-blue-600 hover:underline">
                Back to Homepage
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
