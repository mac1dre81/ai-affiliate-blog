import { getBlogPosts } from '@/lib/blog';
import { getAffiliateLinks, getRevenueStats, getAffiliateProgramStats } from '@/lib/affiliate';

export default async function AdminDashboard() {
  const posts = await getBlogPosts();
  const affiliateLinks = getAffiliateLinks();
  const revenueStats = getRevenueStats();
  const programStats = getAffiliateProgramStats();
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold">{revenueStats.totalClicks}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold">{revenueStats.conversionRate.toFixed(2)}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${revenueStats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Blog Posts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Published</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map(post => (
                  <tr key={post.slug} className="border-b">
                    <td className="py-2 px-4">{post.title}</td>
                    <td className="py-2 px-4">{post.category}</td>
                    <td className="py-2 px-4">{post.publishedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top Performing Affiliate Links</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Clicks</th>
                  <th className="py-2 px-4 text-left">Conversions</th>
                  <th className="py-2 px-4 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {affiliateLinks
                  .sort((a, b) => b.clicks - a.clicks)
                  .slice(0, 5)
                  .map(link => (
                    <tr key={link.id} className="border-b">
                      <td className="py-2 px-4">{link.productName}</td>
                      <td className="py-2 px-4">{link.clicks}</td>
                      <td className="py-2 px-4">{link.conversions}</td>
                      <td className="py-2 px-4">${link.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}