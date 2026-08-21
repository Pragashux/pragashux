export function Philosophy() {
  return (
    <section className="philosophy wrap" id="think">
      <h2 className="display">
        Before I design the interface, I try to understand the problem.
      </h2>
      <div className="belief-grid">
        <p className="belief-lead">
          UX is not about making screens beautiful. Beauty without a job to do is just noise. I start with the people in the product, the work they are trying to finish, and the business constraint sitting next to that work.
        </p>
        <ul className="question-list">
          <li>Who is using the product?</li>
          <li>What are they trying to accomplish?</li>
          <li>Where are they struggling?</li>
          <li>What does the business need?</li>
          <li>What should we simplify?</li>
          <li>What should we not build?</li>
        </ul>
      </div>
      <p className="tool-note">
        Figma is a tool, not a starting point. If I open it too early, I am decorating a problem I have not earned.
      </p>
    </section>
  );
}
