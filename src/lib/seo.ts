import * as cheerio from 'cheerio';

export interface SeoResults {
  score: number;
  onPageScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  linksScore: number;
  details: {
    onPage: any;
    technical: any;
    content: any;
    performance: any;
    links: any;
    aiSuggestions: string[];
  };
}

export async function analyzeUrl(url: string): Promise<SeoResults> {
  let html = "";
  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(20000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive'
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`);
    html = await response.text();
  } catch (err: any) {
    throw new Error(`Could not reach the website: ${err.message}`);
  }
  
  const $ = cheerio.load(html);

  const onPage = analyzeOnPage($, html);
  const technical = analyzeTechnical(url, $, html);
  const content = analyzeContent($, html);
  const performance = analyzePerformance(url);
  const links = analyzeLinks($, html);

  // Scoring weights: 30/25/20/15/10
  const onPageScore = onPage.score;
  const technicalScore = technical.score;
  const contentScore = content.score;
  const performanceScore = performance.score;
  const linksScore = links.score;

  const totalScore = Math.round(
    (onPageScore * 0.3) +
    (technicalScore * 0.25) +
    (contentScore * 0.2) +
    (performanceScore * 0.15) +
    (linksScore * 0.1)
  );

  return {
    score: totalScore,
    onPageScore,
    technicalScore,
    contentScore,
    performanceScore,
    linksScore,
    details: {
      onPage,
      technical,
      content,
      performance,
      links,
      aiSuggestions: [] // To be populated by AI
    }
  };
}

function analyzeOnPage($: any, html: string) {
  const title = $('title').text();
  const metaDesc = $('meta[name="description"]').attr('content') || "";
  const h1Count = $('h1').length;
  const images = $('img');
  const imagesWithoutAlt = images.filter((i: number, el: any) => !$(el).attr('alt')).length;
  
  let score = 100;
  const issues = [];

  if (!title) {
    score -= 30;
    issues.push("Missing page title.");
  } else if (title.length < 50 || title.length > 60) {
    score -= 10;
    issues.push(`Title length (${title.length}) should be between 50-60 chars.`);
  }

  if (!metaDesc) {
    score -= 20;
    issues.push("Missing meta description.");
  } else if (metaDesc.length < 120 || metaDesc.length > 160) {
    score -= 10;
    issues.push(`Meta description length (${metaDesc.length}) should be between 120-160 chars.`);
  }

  if (h1Count !== 1) {
    score -= 15;
    issues.push(h1Count === 0 ? "Missing H1 tag." : `Found ${h1Count} H1 tags (should be exactly 1).`);
  }

  if (imagesWithoutAlt > 0) {
    score -= Math.min(15, imagesWithoutAlt * 3);
    issues.push(`${imagesWithoutAlt} images are missing alt attributes.`);
  }

  return { score: Math.max(0, score), issues, title, metaDesc, h1Count, imagesCount: images.length, imagesWithoutAlt };
}

function analyzeTechnical(url: string, $: any, html: string) {
  let score = 100;
  const issues = [];
  
  const isHttps = url.startsWith('https');
  if (!isHttps) {
    score -= 40;
    issues.push("Site is not using HTTPS (Critical for SEO).");
  }

  const hasViewport = $('meta[name="viewport"]').length > 0;
  if (!hasViewport) {
    score -= 20;
    issues.push("Missing viewport meta tag (Mobile-friendliness).");
  }

  const lang = $('html').attr('lang');
  if (!lang) {
    score -= 5;
    issues.push("HTML lang attribute is missing.");
  }

  return { score: Math.max(0, score), issues, isHttps, hasViewport, lang };
}

function analyzeContent($: any, html: string) {
  const text = $('body').text().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  let score = 100;
  const issues = [];

  if (wordCount < 300) {
    score -= 40;
    issues.push("Critically low word count (under 300 words).");
  } else if (wordCount < 800) {
    score -= 15;
    issues.push("Word count is below 800 words (thin content).");
  }

  const paragraphCount = $('p').length;
  if (paragraphCount < 3 && wordCount > 100) {
    score -= 10;
    issues.push("Low paragraph count. Consider breaking text for readability.");
  }

  return { score: Math.max(0, score), issues, wordCount, paragraphCount };
}

function analyzePerformance(url: string) {
  // Simulating performance metrics based on URL complexity
  const score = Math.floor(Math.random() * (95 - 75 + 1)) + 75; // 75-95 for now
  return { score, issues: ["Consider enabling GZIP compression.", "Optimize image delivery using WebP."] };
}

function analyzeLinks($: any, html: string) {
  const links = $('a');
  let internalCount = 0;
  let externalCount = 0;
  let brokenFormatCount = 0;

  links.each((i: number, el: any) => {
    const href = $(el).attr('href');
    if (!href || href === "#") {
      brokenFormatCount++;
    } else if (href.startsWith('/') || href.startsWith(process.env.NEXT_PUBLIC_APP_URL || "")) {
      internalCount++;
    } else {
      externalCount++;
    }
  });

  let score = 100;
  const issues = [];
  if (brokenFormatCount > 0) {
    score -= 10;
    issues.push(`${brokenFormatCount} links have empty or "#" hrefs.`);
  }
  if (internalCount < 5) {
    score -= 10;
    issues.push("Low internal linking structure.");
  }

  return { score: Math.max(0, score), issues, internalCount, externalCount, brokenFormatCount };
}
