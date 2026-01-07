import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Affiliate Blog',
  description: 'AI-powered affiliate marketing blog with the latest product recommendations',
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
            <a href="/" className="text-2xl font-bold">AI Affiliate Blog</a>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/categories" className="hover:underline">Categories</a></li>
                <li><a href="/about" className="hover:underline">About</a></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-800 text-white p-6 mt-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">AI Affiliate Blog</h3>
                <p>Your source for AI-powered product recommendations and reviews.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="hover:underline">Home</a></li>
                  <li><a href="/categories" className="hover:underline">Categories</a></li>
                  <li><a href="/about" className="hover:underline">About</a></li>
                  <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Subscribe</h3>
                <p className="mb-2">Get the latest updates and offers</p>
                <form className="flex">
                  <input type="email" placeholder="Your email" className="px-4 py-2 w-full text-gray-800" />
                  <button type="submit" className="bg-blue-600 px-4 py-2">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-700 text-center">
              <p>© {new Date().getFullYear()} AI Affiliate Blog. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}