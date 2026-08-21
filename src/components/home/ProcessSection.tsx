import { processSteps } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProcessSection() {
  return (
    <section className="process wrap" id="process">
      <SectionHeading
        kicker="How I work"
        title="A process, not a straight line."
      />
      <div className="process-track">
        {processSteps.map((step, index) => (
          <article className="process-step" key={step.id}>
            <span className="num">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.label}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
      <p className="process-aside">
        Real product work loops. I go back to Understand when a prototype proves the problem was wrong. I skip steps when the evidence is already in the room. The diagram is a map, not a contract.
      </p>
    </section>
  );
}
