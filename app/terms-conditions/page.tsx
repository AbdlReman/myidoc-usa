import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | MYiDocUSA",
  description: "The terms and conditions governing your use of the MYiDocUSA website and services.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Legal" title="Terms & Conditions" crumb="Terms & Conditions" />
        <section className="section">
          <div className="container post">
            <p className="post__meta">
              <strong>Effective Date:</strong> April 3, 2025
              <br />
              <strong>Last Updated:</strong> April 3, 2025
            </p>

            <div className="post__content">
              <p>
                Welcome to MYiDocUSA! These Terms and Conditions govern your use of our website (
                <a href="https://www.myidocusa.com" target="_blank" rel="noopener noreferrer">
                  www.myidocusa.com
                </a>
                ) and any services, content, or features offered through it. By accessing or using this website, you
                agree to these Terms and Conditions. If you do not agree, please do not use this website.
              </p>
              <p>
                For the purposes of these Terms, &ldquo;Affiliates&rdquo; refers collectively to the doctors, cancer
                coaches, wellness coaches, and support staff affiliated with MYiDocUSA.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>By accessing, browsing, or using the MYiDocUSA website, you confirm that you:</p>
              <ul>
                <li>Are at least 18 years old or have the consent of a legal guardian.</li>
                <li>
                  Understand that MYiDocUSA and its Affiliates do not provide medical advice, diagnosis, or
                  treatment through this website.
                </li>
                <li>Agree to comply with these Terms and Conditions and all applicable laws and regulations.</li>
              </ul>

              <h2>2. No Medical Advice or Patient Relationship</h2>
              <ul>
                <li>MYiDocUSA and its Affiliates provide educational and informational content only.</li>
                <li>This website does not offer medical advice, diagnoses, treatments, or prescriptions.</li>
                <li>
                  No doctor-patient relationship is established through website use, virtual coaching, or any other
                  interaction with MYiDocUSA or its Affiliates.
                </li>
                <li>
                  Any health-related information provided is for general knowledge only. Always consult with a
                  licensed physician or medical professional before making health decisions.
                </li>
              </ul>

              <h2>3. Use of Website &amp; Services</h2>
              <p>
                <strong>Permitted Use</strong>
              </p>
              <p>You may use the website for lawful purposes, including:</p>
              <ul>
                <li>Accessing health and wellness educational content.</li>
                <li>Registering for virtual coaching sessions.</li>
                <li>Contacting MYiDocUSA for inquiries.</li>
              </ul>
              <p>
                <strong>Prohibited Use</strong>
              </p>
              <p>You may NOT:</p>
              <ul>
                <li>Use the website to seek emergency medical care.</li>
                <li>Copy, distribute, or use any content without written permission.</li>
                <li>Engage in unauthorized data mining, scraping, or hacking.</li>
                <li>Use the website in a way that disrupts or harms other users.</li>
              </ul>

              <h2>4. Intellectual Property</h2>
              <p>
                All content, including text, images, logos, videos, and design elements, is the exclusive property
                of MYiDocUSA and is protected by copyright, trademark, and intellectual property laws. You may not
                reproduce, distribute, modify, or exploit any content without prior written consent.
              </p>

              <h2>5. Privacy Policy</h2>
              <p>
                MYiDocUSA collects and processes personal information in accordance with its{" "}
                <a href="/legal/privacy-policy">Privacy Policy</a>. While reasonable measures are taken to protect
                your information, absolute security cannot be guaranteed. By using this website, you acknowledge and
                accept our Privacy Policy.
              </p>

              <h2>6. Third-Party Links</h2>
              <p>
                The website may contain links to third-party websites. MYiDocUSA does not control, endorse, or
                assume responsibility for any third-party sites, policies, or content. Accessing third-party sites
                is at your own risk.
              </p>

              <h2>7. Virtual Coaching Sessions</h2>
              <p>By booking a session with MYiDocUSA and its Affiliates, you agree that:</p>
              <ul>
                <li>These sessions are not a substitute for in-person medical care.</li>
                <li>Affiliates do not diagnose, prescribe, or provide medical treatment.</li>
                <li>MYiDocUSA is not responsible for technical failures during virtual sessions.</li>
                <li>You are responsible for ensuring privacy during sessions and securing your devices.</li>
              </ul>

              <h2>8. Disclaimer of Warranties</h2>
              <ul>
                <li>The website and services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind.</li>
                <li>MYiDocUSA does not guarantee that the website will be error-free, secure, or uninterrupted.</li>
                <li>No specific results are guaranteed from virtual coaching sessions.</li>
                <li>
                  MYiDocUSA and its Affiliates are not liable for any decisions made based on website content or
                  coaching services.
                </li>
              </ul>

              <h2>9. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law:</p>
              <ul>
                <li>
                  MYiDocUSA and its Affiliates shall not be liable for any direct, indirect, incidental, or
                  consequential damages.
                </li>
                <li>
                  This includes but is not limited to data loss, personal injury, or financial loss arising from use
                  of the website or services.
                </li>
              </ul>

              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless MYiDocUSA and its Affiliates from any claims, liabilities,
                damages, or expenses resulting from:
              </p>
              <ul>
                <li>Your use of the website.</li>
                <li>Your reliance on information provided by MYiDocUSA.</li>
                <li>Your participation in virtual coaching sessions.</li>
              </ul>

              <h2>11. Cancellation &amp; Refund Policy</h2>
              <ul>
                <li>
                  <strong>Fees:</strong> All session fees must be paid in advance.
                </li>
                <li>
                  <strong>Cancellations:</strong> Must be made at least 24 hours before the session to avoid
                  penalties.
                </li>
                <li>
                  <strong>Refunds:</strong> Non-refundable, except in cases where MYiDocUSA is unable to provide the
                  agreed service.
                </li>
              </ul>

              <h2>12. Changes to Terms</h2>
              <p>
                MYiDocUSA may update these Terms and Conditions at any time. Users will be notified of significant
                changes via email or website updates. Continued use of the website constitutes acceptance of
                revised terms.
              </p>

              <h2>13. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms and Conditions are governed by the laws of the State of New York. Any disputes shall be
                resolved exclusively in the courts of New York.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                For any questions, please contact:
                <br />
                MYiDocUSA
                <br />
                <a href="mailto:admin@myidocusa.com">admin@myidocusa.com</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
