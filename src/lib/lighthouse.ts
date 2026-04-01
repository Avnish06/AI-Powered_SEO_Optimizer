import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export interface AuditResults {
  url: string;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  pwaScore: number;
  metrics: {
    lcp: number;
    tbt: number;
    cls: number;
    fcp: number;
    si: number;
    tti: number;
  };
  audits: any;
}

export async function runLighthouseAudit(url: string): Promise<AuditResults> {
  const isWindows = process.platform === 'win32';
  const lhPath = path.join(process.cwd(), 'node_modules', '.bin', isWindows ? 'lighthouse.cmd' : 'lighthouse');
  const tempFile = path.join(process.cwd(), `lh-${Date.now()}.json`);
  
  // Lighthouse CLI command
  const cmd = `"${lhPath}" "${url}" --output=json --output-path="${tempFile}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo`;

  try {
    console.log("Running Lighthouse CLI:", cmd);
    await execAsync(cmd);
    
    const reportJson = fs.readFileSync(tempFile, 'utf8');
    const lhr = JSON.parse(reportJson);
    
    // Clean up temp file
    fs.unlinkSync(tempFile);

    return {
      url: lhr.requestedUrl,
      performanceScore: (lhr.categories.performance.score || 0) * 100,
      accessibilityScore: (lhr.categories.accessibility.score || 0) * 100,
      bestPracticesScore: (lhr.categories['best-practices'].score || 0) * 100,
      seoScore: (lhr.categories.seo.score || 0) * 100,
      pwaScore: (lhr.categories.pwa?.score || 0) * 100,
      metrics: {
        lcp: lhr.audits['largest-contentful-paint']?.numericValue || 0,
        tbt: lhr.audits['total-blocking-time']?.numericValue || 0,
        cls: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
        fcp: lhr.audits['first-contentful-paint']?.numericValue || 0,
        si: lhr.audits['speed-index']?.numericValue || 0,
        tti: lhr.audits['interactive']?.numericValue || 0,
      },
      audits: lhr.audits,
    };
  } catch (error: any) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    console.error("Lighthouse CLI error:", error);
    throw new Error(`Lighthouse audit failed: ${error.message}`);
  }
}
