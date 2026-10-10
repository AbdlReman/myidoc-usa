import SubscribeForm from "@/components/SubscribeForm";

export default function Newsletter() {
  return (
    <section className="newsletter-wrap">
      <div className="container">
        <div className="newsletter">
          <div className="newsletter__copy">
            <h2 className="h2 h2--sm">Subscribe to Our Newsletter</h2>
            <p>Stay updated with our latest news, articles and offers.</p>
          </div>
          <SubscribeForm
            source="homepage-newsletter"
            formClassName="newsletter__form"
            statusClassName="newsletter__status"
            showNameField={false}
          />
        </div>
      </div>
    </section>
  );
}
