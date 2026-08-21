export function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[760px] px-5 py-20">
      <h1 className="font-display text-5xl">Privacy Policy</h1>
      <p className="mt-6 text-sm text-muted">Last updated 2026. Replace with counsel-reviewed legal copy before public launch.</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        <p>
          Snailtechs Academy collects enquiry details you submit — name, phone, email, location, course interest and
          message — so the team can respond to counselling requests.
        </p>
        <p>
          Enquiries submitted on this website are stored in your browser for demonstration. A production deployment
          should send them to a secure academy inbox or CRM and document that flow here.
        </p>
        <p>We do not sell personal data. Contact {`snailtek21@gmail.com`} for access or deletion requests.</p>
      </div>
    </article>
  )
}

export function TermsPage() {
  return (
    <article className="mx-auto max-w-[760px] px-5 py-20">
      <h1 className="font-display text-5xl">Terms & Conditions</h1>
      <p className="mt-6 text-sm text-muted">Last updated 2026. Replace with counsel-reviewed legal copy before public launch.</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        <p>
          Course fees, batch dates, EMI eligibility and campus availability are confirmed during counselling. Information
          on this website is educational and may change.
        </p>
        <p>
          Snailtechs Academy does not guarantee placement, salary or hiring outcomes. Career support means portfolio,
          resume, interview and presentation guidance.
        </p>
        <p>Certificates are issued on completion of required coursework and projects as defined by the academy.</p>
      </div>
    </article>
  )
}
