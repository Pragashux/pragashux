import { journey } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Timeline() {
  return (
    <section className="journey wrap" id="journey">
      <SectionHeading kicker="My journey" title="How the work changed." />
      <div className="timeline">
        {journey.map((item) => (
          <article className="timeline-item" key={item.era}>
            <p className="era">{item.era}</p>
            <div className="spine" aria-hidden>
              <span className="dot" />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
