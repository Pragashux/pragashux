import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "80px 0" }}>
      <p className="kicker">404</p>
      <h1 className="display" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
        This page is not part of the story.
      </h1>
      <p>
        <Link className="link-arrow" href="/">
          Back to work →
        </Link>
      </p>
    </section>
  );
}
