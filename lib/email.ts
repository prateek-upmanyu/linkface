/**
 * Email dispatcher for Linkface
 * Formats luxury branded transactional emails and sends via Resend or fallback.
 */

export interface SpotlightReportEmailProps {
  toEmail: string;
  recipientName: string;
  recipientUsername: string;
  inclusionsCount: number;
  curators: Array<{
    name: string;
    username: string;
  }>;
  totalClicksThisWeek: number;
}

export function generateSpotlightWeeklyReportHtml(props: SpotlightReportEmailProps): string {
  const { recipientName, recipientUsername, inclusionsCount, curators, totalClicksThisWeek } = props;

  const curatorListHtml = curators.length > 0
    ? curators
        .slice(0, 5)
        .map(
          (c) => `
        <li style="margin-bottom: 8px; font-size: 14px; color: #18181B;">
          <strong>${c.name}</strong> (@${c.username}) 
          <a href="https://linkface.in/${c.username}" style="color: #E67E22; text-decoration: none; font-weight: 600; margin-left: 6px;">View Spotlight &rarr;</a>
        </li>
      `
        )
        .join("")
    : `<li style="font-size: 14px; color: #71717A;">Active showcase links receiving traffic across Linkface.</li>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Spotlight Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0f12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F4F4F5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d0f12; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #17191e; border: 1px solid #27272a; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.5);" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #272015 0%, #17191e 100%); border-bottom: 1px solid #332717; padding: 32px 32px 24px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #F59E0B; font-family: monospace;">
                      WEEKLY SPOTLIGHT REPORT • MONDAY BRIEF
                    </span>
                    <h1 style="margin: 12px 0 0 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">
                      Hello ${recipientName || "@" + recipientUsername},
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; color: #A1A1AA;">
                      Here is your weekly audience report for creators featuring you in their Spotlight.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Stats Cards -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="background-color: #1c1f26; border: 1px solid #2d3139; border-radius: 12px; padding: 18px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF;">
                      Spotlight Count
                    </div>
                    <div style="font-size: 32px; font-weight: 800; color: #F59E0B; margin-top: 4px;">
                      ${inclusionsCount}
                    </div>
                    <div style="font-size: 12px; color: #71717A; margin-top: 2px;">
                      Creators featuring you
                    </div>
                  </td>
                  <td width="16">&nbsp;</td>
                  <td width="50%" style="background-color: #1c1f26; border: 1px solid #2d3139; border-radius: 12px; padding: 18px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF;">
                      Total Clicks
                    </div>
                    <div style="font-size: 32px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">
                      ${totalClicksThisWeek}
                    </div>
                    <div style="font-size: 12px; color: #71717A; margin-top: 2px;">
                      Clicks this week
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Featured By List -->
              <div style="background-color: #FFFFFF; border-radius: 12px; padding: 22px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4B5563;">
                  🌟 Curators Spotlighting You
                </h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${curatorListHtml}
                </ul>
              </div>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://linkface.in/dashboard" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #000000; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 999px; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);">
                      View Your Spotlight Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="text-align: center; font-size: 12px; color: #71717A; margin-top: 28px; line-height: 1.5;">
                This weekly report is sent every Monday to your account Gmail.<br>
                Visit <a href="https://linkface.in/${recipientUsername}" style="color: #F59E0B; text-decoration: none;">linkface.in/${recipientUsername}</a> to view your live profile.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #121316; border-top: 1px solid #27272a; padding: 20px 32px; text-align: center; font-size: 11px; color: #52525B;">
              Linkface Inc. • Crafted for luxury creators & curators.<br>
              © 2026 Linkface. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send an email using Resend API if configured, with graceful logging fallback.
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[Email Mock/No API Key] To: ${options.to} | Subject: ${options.subject}`);
    return { success: true, id: `mock-${Date.now()}` };
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || "Linkface <updates@linkface.in>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn("Resend API error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("sendEmail exception:", err);
    return { success: false, error: err.message };
  }
}
