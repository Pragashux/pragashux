import { site } from "@/content/site";

export function ContactCTA() {
  return (
    <section className="contact wrap" id="contact">
      <p className="kicker">Contact</p>
      <h2 className="display">Have a problem worth solving?</h2>
      <p className="sub">Let&apos;s talk about it.</p>
      <div className="contact-actions">
        <a className="btn" href={site.linkedin} target="_blank" rel="noreferrer">
          View LinkedIn
        </a>
        <a className="btn ghost" href={site.behance} target="_blank" rel="noreferrer">
          View Behance
        </a>
        <a className="btn ghost" href={`mailto:${site.email}`}>
          Email Me
        </a>
      </div>
    </section>
  );
}
