/**
 * Self-hosted open/click tracking. Gmail SMTP (nodemailer) has no delivery
 * webhooks, so opens/clicks are tracked via a 1x1 pixel and link-rewriting
 * instead of provider callbacks.
 */

const HREF_PATTERN = /href=(["'])(https?:\/\/[^"']+)\1/gi;

/** Rewrites outbound links to go through the click-tracking redirect, and appends an open-tracking pixel. */
export function injectTracking(html: string, scheduledEmailId: string, baseUrl: string): string {
  const withClickTracking = html.replace(HREF_PATTERN, (match, quote, url) => {
    const tracked = `${baseUrl}/api/track/click/${scheduledEmailId}?u=${encodeURIComponent(url)}`;
    return `href=${quote}${tracked}${quote}`;
  });

  const pixel = `<img src="${baseUrl}/api/track/open/${scheduledEmailId}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;

  if (withClickTracking.includes("</body>")) {
    return withClickTracking.replace("</body>", `${pixel}</body>`);
  }
  return `${withClickTracking}${pixel}`;
}
