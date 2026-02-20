import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Admin</p>
        <h1>Manage your courses</h1>
        <p>Admins are provisioned by seed script and can only sign in.</p>
        <div className="row">
          <Link className="btn-primary" href="/admin/login">
            Admin login
          </Link>
        </div>
      </section>
    </main>
  );
}
