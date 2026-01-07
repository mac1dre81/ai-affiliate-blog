type AffiliateProgram = {
  id: string;
  name: string;
  baseUrl: string;
  trackingParam: string;
  commission: string; // e.g., "5%", "$10 flat"
  cookieDuration: number; // in days
};

type AffiliateLink = {
  id: string;
  programId: string;
  originalUrl: string;
  affiliateUrl: string;
  productName: string;
  productPrice?: string;
  category: string;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
  lastClickedAt?: string;
};

type ClickEvent = {
  linkId: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  ip: string; // Note: In production, handle this carefully for privacy
};

// More comprehensive affiliate programs
const affiliatePrograms: Record<string, AffiliateProgram> = {
  amazon: {
    id: 'amazon',
    name: 'Amazon Associates',
    baseUrl: 'https://amazon.com',
    trackingParam: 'tag=yourtag-20',
    commission: '1-10% depending on category',
    cookieDuration: 24, // 24 hours
  },
  bestbuy: {
    id: 'bestbuy',
    name: 'Best Buy Affiliate',
    baseUrl: 'https://bestbuy.com',
    trackingParam: 'aid=youraffid',
    commission: '1% on most items',
    cookieDuration: 1, // 1 day
  },
  walmart: {
    id: 'walmart',
    name: 'Walmart Affiliate',
    baseUrl: 'https://walmart.com',
    trackingParam: 'affid=youraffid',
    commission: 'Up to 4%',
    cookieDuration: 3, // 3 days
  },
  target: {
    id: 'target',
    name: 'Target Affiliate',
    baseUrl: 'https://target.com',
    trackingParam: 'afid=youraffid',
    commission: 'Up to 8%',
    cookieDuration: 7, // 7 days
  },
  newegg: {
    id: 'newegg',
    name: 'Newegg Affiliate',
    baseUrl: 'https://newegg.com',
    trackingParam: 'affid=youraffid',
    commission: '0.5-5% depending on category',
    cookieDuration: 30, // 30 days
  },
};

// In a real implementation, you would store this in a database
let affiliateLinks: AffiliateLink[] = [];
let clickEvents: ClickEvent[] = [];

export function createAffiliateLink(programId: string, originalUrl: string, productName: string, productPrice?: string, category: string = 'General'): AffiliateLink {
  const program = affiliatePrograms[programId];
  if (!program) {
    throw new Error(`Affiliate program ${programId} not found`);
  }
  
  // Create the affiliate URL
  const url = new URL(originalUrl);
  url.searchParams.append(program.trackingParam.split('=')[0], program.trackingParam.split('=')[1]);
  
  const link: AffiliateLink = {
    id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    programId,
    originalUrl,
    affiliateUrl: url.toString(),
    productName,
    productPrice,
    category,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
  };
  
  affiliateLinks.push(link);
  return link;
}

export function trackClick(linkId: string, referrer: string = '', userAgent: string = '', ip: string = ''): void {
  const link = affiliateLinks.find(l => l.id === linkId);
  if (link) {
    link.clicks += 1;
    link.lastClickedAt = new Date().toISOString();
    
    // Record click event
    const clickEvent: ClickEvent = {
      linkId,
      timestamp: new Date().toISOString(),
      referrer,
      userAgent,
      ip,
    };
    
    clickEvents.push(clickEvent);
    
    // In a real implementation, you would save this to a database
    console.log(`Tracked click for ${link.productName}, total clicks: ${link.clicks}`);
  }
}

export function recordConversion(linkId: string, amount: number): void {
  const link = affiliateLinks.find(l => l.id === linkId);
  if (link) {
    link.conversions += 1;
    link.revenue += amount;
    
    // In a real implementation, you would save this to a database
    console.log(`Recorded conversion for ${link.productName}, amount: $${amount}`);
  }
}

export function getAffiliateLinks(): AffiliateLink[] {
  return affiliateLinks;
}

export function getAffiliateLinksByCategory(category: string): AffiliateLink[] {
  return affiliateLinks.filter(link => link.category.toLowerCase() === category.toLowerCase());
}

export function getTopPerformingLinks(limit: number = 10): AffiliateLink[] {
  return [...affiliateLinks]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
}

export function getRevenueStats() {
  const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0);
  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);
  
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  
  return {
    totalRevenue,
    totalClicks,
    totalConversions,
    conversionRate,
    revenuePerClick: totalClicks > 0 ? totalRevenue / totalClicks : 0,
  };
}

export function getAffiliateProgramStats() {
  const stats: Record<string, { clicks: number, conversions: number, revenue: number }> = {};
  
  for (const program of Object.values(affiliatePrograms)) {
    stats[program.id] = { clicks: 0, conversions: 0, revenue: 0 };
  }
  
  for (const link of affiliateLinks) {
    if (stats[link.programId]) {
      stats[link.programId].clicks += link.clicks;
      stats[link.programId].conversions += link.conversions;
      stats[link.programId].revenue += link.revenue;
    }
  }
  
  return stats;
}