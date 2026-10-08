import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | MYiDocUSA",
  description: "How MYiDocUSA collects, uses, discloses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Legal" title="Privacy Policy" crumb="Privacy Policy" />
        <section className="section">
          <div className="container post">
            <p className="post__meta">
              <strong>Effective Date:</strong> April 3, 2025
              <br />
              <strong>Last Updated:</strong> April 3, 2025
            </p>

            <div className="post__content">
              <p>
                This Privacy Policy explains how MYiDocUSA (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
                collects, uses, discloses, and protects your information when you use our website (
                <a href="https://www.myidocusa.com" target="_blank" rel="noopener noreferrer">
                  www.myidocusa.com
                </a>
                ) and services. By using our website, you consent to the practices described in this policy.
              </p>

              <h2>1. Information We Collect</h2>
              <ul>
                <li>
                  Information you provide directly (e.g., name, email, contact details) when you register, book
                  sessions, or contact support.
                </li>
                <li>
                  Usage data such as IP address, browser type, pages visited, and interactions with our site.
                </li>
                <li>Cookies and similar technologies to enhance user experience and analyze performance.</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To provide, operate, and improve our website and services.</li>
                <li>To communicate with you regarding updates, inquiries, and support.</li>
                <li>To ensure security, prevent fraud, and comply with legal obligations.</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <ul>
                <li>
                  We do not sell your personal information. We may share information with trusted service providers
                  who assist in operating our website and services, under confidentiality obligations.
                </li>
                <li>We may disclose information if required by law or to protect our rights and users.</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical safeguards to protect your
                information. However, no method of transmission over the Internet or electronic storage is 100%
                secure.
              </p>

              <h2>5. Your Choices</h2>
              <ul>
                <li>You may update or correct your account information by contacting us.</li>
                <li>You can manage cookie preferences through your browser settings.</li>
                <li>
                  You may opt out of non-essential communications by using the unsubscribe link or contacting us.
                </li>
              </ul>

              <h2>6. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the content or
                privacy practices of those sites. We encourage you to review their privacy policies.
              </p>

              <h2>7. Children&rsquo;s Privacy</h2>
              <p>
                Our website is not intended for children under 13. We do not knowingly collect personal information
                from children under 13. If you believe a child has provided us information, please contact us to
                remove it.
              </p>

              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Material changes will be posted on this page
                and, where appropriate, notified to you by email or site notice. Continued use of the website after
                updates constitutes acceptance of the revised policy.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our practices, please contact:
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
