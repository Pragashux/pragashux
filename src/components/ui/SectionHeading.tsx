type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  id?: string;
};

export function SectionHeading({ kicker, title, subtitle, id }: Props) {
  return (
    <header className="section-heading">
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 id={id} className="display">
        {title}
      </h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}
