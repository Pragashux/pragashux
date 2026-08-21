import { site } from "@/content/site";

export function AboutSection() {
  return (
    <section className="about wrap" id="about">
      <div className="about-grid">
        <figure className="about-photo">
          <img
            src={site.portrait}
            alt="Closer crop of Pragash Santhakumar's editorial portrait"
            width={900}
            height={900}
          />
        </figure>
        <div>
          <p className="kicker">About</p>
          <h2 className="display">Designer. Problem solver. Constantly curious.</h2>
          <p>
            I am Pragash, a UX designer based in Chennai. I work on digital products where the complexity is the point — enterprise workflows, learning platforms, finance, healthcare, and the quiet operational tools people use all day.
          </p>
          <p>
            I care about understanding the problem before touching the pixels: who is stuck, what the business actually needs, and what we can leave unbuilt. I like design systems because they keep teams honest. I am curious about AI in product work, but I do not treat it as a personality.
          </p>
          <ul className="interest-list">
            {[
              "UX design",
              "Product design",
              "Enterprise UX",
              "Design systems",
              "AI / product experiences",
              "User problems",
              "Complex workflows",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="open-note">Currently open to interesting product design opportunities.</p>
        </div>
      </div>
    </section>
  );
}
