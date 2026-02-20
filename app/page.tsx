import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">CourseVault</p>
        <h1>Professional course platform with protected watch-only delivery</h1>
        <p>
          Each workflow is on a dedicated page. Use login, signup, courses, and my courses to
          manage the full learner journey.
        </p>
        <div className="row">
          <Link className="btn-primary" href="/signup">
            Create account
          </Link>
          <Link className="btn-secondary" href="/login">
            Login
          </Link>
        </div>
      </section>

      <section className="split">
        <article className="card">
          <h2>Authentication</h2>
          <p>Separate pages for user onboarding and access.</p>
          <div className="row">
            <Link className="link-chip" href="/login">
              /login
            </Link>
            <Link className="link-chip" href="/signup">
              /signup
            </Link>
          </div>
        </article>

        <article className="card">
          <h2>Storefront</h2>
          <p>Browse and purchase from the course catalog.</p>
          <div className="row">
            <Link className="link-chip" href="/courses">
              /courses
            </Link>
          </div>
        </article>

        <article className="card">
          <h2>Purchased library</h2>
          <p>Watch only purchased content from your own library.</p>
          <div className="row">
            <Link className="link-chip" href="/my-courses">
              /my-courses
            </Link>
          </div>
        </article>

        <article className="card">
          <h2>Admin panel</h2>
          <p>Create, edit, and manage courses as an administrator.</p>
          <div className="row">
            <Link className="link-chip" href="/admin/login">
              /admin/login
            </Link>
            <Link className="link-chip" href="/admin/courses">
              /admin/courses
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
