import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="hero wrap-wide">
      <div className="hero-grid">
        <div>
          <p className="kicker reveal">
            {site.name} · {site.title}
          </p>
          <h1 className="display reveal delay-1">{site.heroLine}</h1>
          <p className="hero-note reveal delay-2">{site.heroPhilosophy}</p>
          <a className="explore reveal delay-3" href="#work">
            Explore my work <span className="arrow">↓</span>
          </a>
        </div>
        <figure className="portrait-frame reveal delay-2">
          <img
            src={site.portrait}
            alt="Editorial portrait of Pragash Santhakumar, looking upward with a thoughtful expression"
            width={900}
            height={900}
          />
          <figcaption className="portrait-caption">
            <span>Chennai</span>
            <span>UX · Product · Systems</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
