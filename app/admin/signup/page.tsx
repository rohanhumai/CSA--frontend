import Link from "next/link";

export default function AdminSignupDisabledPage() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Admin</p>
        <h1 className="title">Admin signup disabled</h1>
        <p className="muted">
          Admin accounts are created only through backend seeding. Web registration is blocked.
        </p>
        <div className="row">
          <Link className="btn-primary" href="/admin/login">
            Go to admin login
          </Link>
        </div>
      </section>
    </main>
  );
}
