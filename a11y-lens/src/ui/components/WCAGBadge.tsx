export function WCAGBadge({
  criterion,
  title,
  level,
  url,
  showLink,
}: {
  criterion: string;
  title: string;
  level: string;
  url: string;
  showLink: boolean;
}) {
  return (
    <p className="tiny">
      WCAG 2.2 {criterion} {title} — Level {level}
      {showLink ? (
        <>
          {" "}
          <a href={url} target="_blank" rel="noreferrer">
            Learn more
          </a>
        </>
      ) : null}
    </p>
  );
}
