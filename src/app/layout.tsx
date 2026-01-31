import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Affiliate Blog",
  description:
    "AI-powered affiliate marketing blog with the latest product recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold">
              AI Affiliate Blog
            </a>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/categories" className="hover:underline">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">
                    About
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-800 text-white p-6 mt-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">AI Affiliate Blog</h3>
                <p>
                  Your source for AI-powered product recommendations and
                  reviews.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="hover:underline">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/categories" className="hover:underline">
                      Categories
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:underline">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:underline">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/disclosure" className="hover:underline">
                      Affiliate Disclosure
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-700 text-center">
              <p>
                © {new Date().getFullYear()} AI Affiliate Blog. All rights
                reserved.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <a href="/privacy" className="hover:underline">
                  Privacy
                </a>{" "}
                |
                <a href="/terms" className="hover:underline">
                  {" "}
                  Terms
                </a>{" "}
                |
                <a href="/disclosure" className="hover:underline">
                  {" "}
                  Disclosure
                </a>{" "}
                |
                <a href="/contact" className="hover:underline">
                  {" "}
                  Contact
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
