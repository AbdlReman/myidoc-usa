import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";
import { disclaimer, site } from "@/lib/content";

const socials = [
  { name: "facebook", label: "Facebook", href: site.social.facebook },
  { name: "youtube", label: "YouTube", href: site.social.youtube },
  { name: "linkedin", label: "LinkedIn", href: site.social.linkedin },
  { name: "instagram", label: "Instagram", href: site.social.instagram },
] as const;

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo light />
            <p className="footer__about">
              Expert help for your health concerns from highly experienced, USA-trained doctors — from the comfort of your home.
            </p>
            <div className="socials">
              {socials.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.label} className="social social--dark" target="_blank" rel="noopener noreferrer">
                  <Icon name={s.name} size={15} strokeWidth={2.2} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="footer__title">Departments</h3>
            <ul className="footer__links">
              <li><Link href="/services">Cancer</Link></li>
              <li><Link href="/services">Hematology (Blood Disorders)</Link></li>
              <li><Link href="/services">Cancer Nutrition</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              <li><a href={site.bookingUrl}>Schedule a Consultation</a></li>
              <li><Link href="/doctors">Our Doctors</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Get In Touch</h3>
            <ul className="footer__contact">
              <li>
                <Icon name="mail" size={18} strokeWidth={2} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <Icon name="pin" size={18} strokeWidth={2} />
                <address>
                  {site.address[0]}
                  <br />
                  {site.address[1]}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__disclaimer">
          <strong>Disclaimer:</strong> {disclaimer}
        </p>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} MYiDocUSA, LLC. All rights reserved.</span>
          <strong>If this is a medical emergency, please call 911.</strong>
          <span className="footer__legal">
            <a href={site.termsUrl}>Terms &amp; Conditions</a>
            <a href={site.privacyUrl}>Privacy Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
