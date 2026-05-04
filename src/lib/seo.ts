import * as cheerio from 'cheerio';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface SeoIssue {
  type: 'error' | 'warning' | 'info' | 'pass';
  message: string;
  detail?: string;
}

export interface CategoryResult {
  score: number;
  issues: SeoIssue[];
  data: Record<string, any>;
}

export interface SeoReport {
  url: string;
  scannedAt: string;
  score: number;
  grade: string;
  categories: {
    onPage:      CategoryResult;
    technical:   CategoryResult;
    content:     CategoryResult;
    social:      CategoryResult;
    links:       CategoryResult;
  };
  pagespeed?: PageSpeedResult | null;
  summary: string[];
}

export interface PageSpeedResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcp: number;
  cls: number;
  fcp: number;
  tbt: number;
  si: number;
  tti: number;
}

// ─────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────
export async function analyzeUrl(inputUrl: string): Promise<SeoReport> {
  // Normalize URL
  let url = inputUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // 1. Fetch HTML
  let html = '';
  let fetchError: string | null = null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) fetchError = `HTTP ${res.status} ${res.statusText}`;
    else html = await res.text();
  } catch (err: any) {
    fetchError = err.message;
  }

  const $ = html ? cheerio.load(html) : cheerio.load('');

  // 2. Run all category analyses in parallel
  const [onPage, technical, content, social, links, pagespeed] = await Promise.all([
    analyzeOnPage($, url, html),
    analyzeTechnical($, url, html),
    analyzeContent($, html),
    analyzeSocial($),
    analyzeLinks($, url),
    fetchPageSpeed(url),
  ]);

  if (fetchError) {
    onPage.issues.unshift({ type: 'error', message: `Could not fully fetch page: ${fetchError}` });
    onPage.score = Math.max(0, onPage.score - 30);
  }

  // 3. Weighted overall score
  const score = Math.round(
    onPage.score    * 0.30 +
    technical.score * 0.25 +
    content.score   * 0.20 +
    social.score    * 0.15 +
    links.score     * 0.10,
  );

  const grade =
    score >= 90 ? 'A' :
    score >= 80 ? 'B' :
    score >= 70 ? 'C' :
    score >= 60 ? 'D' : 'F';

  // 4. Top-level summary bullets
  const allErrors = [onPage, technical, content, social, links]
    .flatMap(c => c.issues)
    .filter(i => i.type === 'error' || i.type === 'warning')
    .slice(0, 5)
    .map(i => i.message);

  return {
    url,
    scannedAt: new Date().toISOString(),
    score,
    grade,
    categories: { onPage, technical, content, social, links },
    pagespeed,
    summary: allErrors,
  };
}

// ─────────────────────────────────────────────
// Category: On-Page SEO
// ─────────────────────────────────────────────
async function analyzeOnPage($: any, url: string, html: string): Promise<CategoryResult> {
  let score = 100;
  const issues: SeoIssue[] = [];

  const title     = $('title').text().trim();
  const metaDesc  = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robots    = $('meta[name="robots"]').attr('content') || '';
  const h1Tags    = $('h1').map((_: any, el: any) => $(el).text().trim()).get() as string[];
  const h2Count   = $('h2').length;
  const h3Count   = $('h3').length;
  const imgs      = $('img');
  const noAlt     = imgs.filter((_: any, el: any) => !$(el).attr('alt')).length;
  const noAltSrc  = imgs.filter((_: any, el: any) => !$(el).attr('alt')).first().attr('src') || '';

  // Title
  if (!title) {
    score -= 25; issues.push({ type: 'error', message: 'Missing <title> tag', detail: 'Every page must have a unique title tag for SEO.' });
  } else if (title.length < 30) {
    score -= 10; issues.push({ type: 'warning', message: `Title too short (${title.length} chars)`, detail: 'Recommended: 50–60 characters.' });
  } else if (title.length > 65) {
    score -= 8; issues.push({ type: 'warning', message: `Title too long (${title.length} chars)`, detail: 'Google truncates titles over 60 characters.' });
  } else {
    issues.push({ type: 'pass', message: `Title is well optimized (${title.length} chars)` });
  }

  // Meta description
  if (!metaDesc) {
    score -= 20; issues.push({ type: 'error', message: 'Missing meta description', detail: 'Meta descriptions increase CTR from search results.' });
  } else if (metaDesc.length < 100) {
    score -= 8; issues.push({ type: 'warning', message: `Meta description too short (${metaDesc.length} chars)`, detail: 'Recommended: 120–160 characters.' });
  } else if (metaDesc.length > 165) {
    score -= 5; issues.push({ type: 'warning', message: `Meta description too long (${metaDesc.length} chars)`, detail: 'Google may truncate descriptions over 160 chars.' });
  } else {
    issues.push({ type: 'pass', message: `Meta description is well optimized (${metaDesc.length} chars)` });
  }

  // H1
  if (h1Tags.length === 0) {
    score -= 20; issues.push({ type: 'error', message: 'Missing H1 heading', detail: 'Every page should have exactly one H1 tag.' });
  } else if (h1Tags.length > 1) {
    score -= 8; issues.push({ type: 'warning', message: `Multiple H1 tags found (${h1Tags.length})`, detail: 'Use only one H1 per page.' });
  } else {
    issues.push({ type: 'pass', message: `H1 present: "${h1Tags[0].slice(0, 60)}"` });
  }

  // Images without alt
  if (noAlt > 0) {
    const deduction = Math.min(15, noAlt * 3);
    score -= deduction;
    issues.push({ type: 'warning', message: `${noAlt} image(s) missing alt text`, detail: 'Alt attributes help accessibility and image SEO.' });
  } else if (imgs.length > 0) {
    issues.push({ type: 'pass', message: `All ${imgs.length} images have alt attributes` });
  }

  // Canonical
  if (!canonical) {
    score -= 5; issues.push({ type: 'warning', message: 'No canonical URL tag', detail: 'Canonical tags prevent duplicate content issues.' });
  } else {
    issues.push({ type: 'pass', message: `Canonical URL set` });
  }

  // Robots
  if (robots.includes('noindex')) {
    score -= 30; issues.push({ type: 'error', message: 'Page has noindex directive', detail: 'This page is blocked from search engines!' });
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { title, metaDesc, h1Tags, h2Count, h3Count, canonical, robots, imagesTotal: imgs.length, imagesNoAlt: noAlt },
  };
}

// ─────────────────────────────────────────────
// Category: Technical SEO
// ─────────────────────────────────────────────
async function analyzeTechnical($: any, url: string, html: string): Promise<CategoryResult> {
  let score = 100;
  const issues: SeoIssue[] = [];

  const isHttps      = url.startsWith('https://');
  const hasViewport  = $('meta[name="viewport"]').length > 0;
  const lang         = $('html').attr('lang') || '';
  const hasCharset   = $('meta[charset]').length > 0 || html.toLowerCase().includes('charset');
  const hasStructuredData = $('script[type="application/ld+json"]').length > 0;
  const htmlSize     = Buffer.byteLength(html, 'utf8');
  const scripts      = $('script:not([type="application/ld+json"])').length;
  const styleSheets  = $('link[rel="stylesheet"]').length;
  const hasNoScript  = $('noscript').length > 0;

  // HTTPS
  if (!isHttps) {
    score -= 40; issues.push({ type: 'error', message: 'Site is not on HTTPS', detail: 'HTTPS is a confirmed Google ranking factor.' });
  } else {
    issues.push({ type: 'pass', message: 'HTTPS enabled (secure connection)' });
  }

  // Viewport
  if (!hasViewport) {
    score -= 20; issues.push({ type: 'error', message: 'Missing viewport meta tag', detail: 'Required for mobile-friendly rendering.' });
  } else {
    issues.push({ type: 'pass', message: 'Viewport meta tag present (mobile-ready)' });
  }

  // Language
  if (!lang) {
    score -= 5; issues.push({ type: 'warning', message: 'HTML lang attribute missing', detail: 'Helps search engines understand page language.' });
  } else {
    issues.push({ type: 'pass', message: `Language declared: "${lang}"` });
  }

  // Charset
  if (!hasCharset) {
    score -= 5; issues.push({ type: 'warning', message: 'No charset declaration found' });
  } else {
    issues.push({ type: 'pass', message: 'Character encoding declared' });
  }

  // Structured Data
  if (!hasStructuredData) {
    score -= 10; issues.push({ type: 'warning', message: 'No structured data (JSON-LD) found', detail: 'Schema markup enables rich results in Google.' });
  } else {
    issues.push({ type: 'pass', message: 'Structured data (JSON-LD) detected' });
  }

  // Page size
  const kbSize = Math.round(htmlSize / 1024);
  if (kbSize > 500) {
    score -= 10; issues.push({ type: 'warning', message: `Large HTML page size (${kbSize} KB)`, detail: 'Large pages slow down crawling and loading.' });
  } else {
    issues.push({ type: 'info', message: `HTML document size: ${kbSize} KB` });
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { isHttps, hasViewport, lang, hasCharset, hasStructuredData, pageSizeKb: kbSize, scripts, styleSheets },
  };
}

// ─────────────────────────────────────────────
// Category: Content Quality
// ─────────────────────────────────────────────
async function analyzeContent($: any, html: string): Promise<CategoryResult> {
  let score = 100;
  const issues: SeoIssue[] = [];

  const bodyText   = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount  = bodyText.split(' ').filter(Boolean).length;
  const paraCount  = $('p').length;
  const listCount  = $('ul, ol').length;
  const tableCount = $('table').length;

  // Reading time estimate
  const readingMin = Math.ceil(wordCount / 200);

  // Word count
  if (wordCount < 200) {
    score -= 40; issues.push({ type: 'error', message: `Very thin content (${wordCount} words)`, detail: 'Pages with fewer than 300 words rank poorly.' });
  } else if (wordCount < 600) {
    score -= 20; issues.push({ type: 'warning', message: `Thin content (${wordCount} words)`, detail: 'Aim for 800+ words for competitive keywords.' });
  } else if (wordCount < 1000) {
    score -= 5; issues.push({ type: 'info', message: `Moderate content length (${wordCount} words)` });
  } else {
    issues.push({ type: 'pass', message: `Good content length (${wordCount} words, ~${readingMin} min read)` });
  }

  // Paragraphs
  if (paraCount < 3) {
    score -= 10; issues.push({ type: 'warning', message: `Very few paragraphs (${paraCount})`, detail: 'Structure content with more paragraphs for readability.' });
  } else {
    issues.push({ type: 'pass', message: `${paraCount} paragraphs found (good structure)` });
  }

  // Lists & tables
  if (listCount > 0 || tableCount > 0) {
    issues.push({ type: 'pass', message: `${listCount} list(s) and ${tableCount} table(s) found (rich formatting)` });
  } else {
    score -= 5; issues.push({ type: 'info', message: 'No lists or tables found', detail: 'Lists and tables improve content structure.' });
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { wordCount, paraCount, listCount, tableCount, readingMin },
  };
}

// ─────────────────────────────────────────────
// Category: Social & Open Graph
// ─────────────────────────────────────────────
async function analyzeSocial($: any): Promise<CategoryResult> {
  let score = 100;
  const issues: SeoIssue[] = [];

  const ogTitle   = $('meta[property="og:title"]').attr('content') || '';
  const ogDesc    = $('meta[property="og:description"]').attr('content') || '';
  const ogImage   = $('meta[property="og:image"]').attr('content') || '';
  const ogUrl     = $('meta[property="og:url"]').attr('content') || '';
  const ogType    = $('meta[property="og:type"]').attr('content') || '';
  const twCard    = $('meta[name="twitter:card"]').attr('content') || '';
  const twTitle   = $('meta[name="twitter:title"]').attr('content') || '';
  const twImage   = $('meta[name="twitter:image"]').attr('content') || '';

  const ogTags = [ogTitle, ogDesc, ogImage, ogUrl, ogType];
  const hasOg  = ogTags.some(Boolean);

  if (!ogTitle) { score -= 20; issues.push({ type: 'error',   message: 'Missing og:title',        detail: 'Required for correct social media sharing.' }); }
  else            issues.push({ type: 'pass',  message: `og:title present` });

  if (!ogDesc)  { score -= 15; issues.push({ type: 'warning', message: 'Missing og:description',   detail: 'Shown in social media link previews.' }); }
  else            issues.push({ type: 'pass',  message: 'og:description present' });

  if (!ogImage) { score -= 20; issues.push({ type: 'error',   message: 'Missing og:image',         detail: 'Without og:image, social shares look broken.' }); }
  else            issues.push({ type: 'pass',  message: 'og:image present' });

  if (!twCard)  { score -= 15; issues.push({ type: 'warning', message: 'Missing twitter:card tag', detail: 'Enables Twitter/X card previews.' }); }
  else            issues.push({ type: 'pass',  message: `twitter:card = "${twCard}"` });

  if (!twImage) { score -= 10; issues.push({ type: 'info',    message: 'No twitter:image tag' }); }
  else            issues.push({ type: 'pass',  message: 'twitter:image present' });

  return {
    score: Math.max(0, score),
    issues,
    data: { ogTitle, ogDesc, ogImage, ogUrl, ogType, twCard, twTitle, twImage },
  };
}

// ─────────────────────────────────────────────
// Category: Links
// ─────────────────────────────────────────────
async function analyzeLinks($: any, pageUrl: string): Promise<CategoryResult> {
  let score = 100;
  const issues: SeoIssue[] = [];

  const hostname  = new URL(pageUrl).hostname;
  let internal = 0, external = 0, noFollow = 0, empty = 0;

  $('a[href]').each((_: any, el: any) => {
    const href = $(el).attr('href') || '';
    const rel  = $(el).attr('rel') || '';

    if (!href || href === '#' || href.startsWith('javascript:')) { empty++; return; }
    if (rel.includes('nofollow')) noFollow++;

    try {
      const target = new URL(href, pageUrl);
      if (target.hostname === hostname) internal++;
      else external++;
    } catch { empty++; }
  });

  const total = internal + external;

  if (total === 0) {
    score -= 15; issues.push({ type: 'warning', message: 'No links found on page' });
  } else {
    issues.push({ type: 'info', message: `${total} total links found` });
  }

  if (internal < 3 && total > 0) {
    score -= 15; issues.push({ type: 'warning', message: `Low internal linking (${internal} internal links)`, detail: 'Internal links spread link equity and aid crawling.' });
  } else if (internal >= 3) {
    issues.push({ type: 'pass', message: `${internal} internal links (good internal linking)` });
  }

  if (external > 0) {
    issues.push({ type: 'pass', message: `${external} external links` });
  }

  if (empty > 0) {
    score -= Math.min(10, empty * 2);
    issues.push({ type: 'warning', message: `${empty} empty or javascript: links`, detail: 'These links waste crawl budget.' });
  }

  if (noFollow > 0) {
    issues.push({ type: 'info', message: `${noFollow} nofollow links` });
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { internal, external, noFollow, empty, total: total + empty },
  };
}

// ─────────────────────────────────────────────
// PageSpeed Insights (Google API — free, no key needed for basic)
// ─────────────────────────────────────────────
async function fetchPageSpeed(url: string): Promise<PageSpeedResult | null> {
  try {
    const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || '';
    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo${apiKey ? `&key=${apiKey}` : ''}`;

    const res = await fetch(endpoint, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;

    const data = await res.json();
    const cats  = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};

    return {
      performance:   Math.round((cats.performance?.score  || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo:           Math.round((cats.seo?.score || 0) * 100),
      lcp:           audits['largest-contentful-paint']?.numericValue  || 0,
      cls:           audits['cumulative-layout-shift']?.numericValue   || 0,
      fcp:           audits['first-contentful-paint']?.numericValue    || 0,
      tbt:           audits['total-blocking-time']?.numericValue       || 0,
      si:            audits['speed-index']?.numericValue               || 0,
      tti:           audits['interactive']?.numericValue               || 0,
    };
  } catch {
    return null;
  }
}
