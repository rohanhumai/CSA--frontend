"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { adminCreateCourse, adminUpdateCourse, getAdminCourses } from "@/lib/api";
import { getStoredAdminToken } from "@/lib/auth";
import type { Course } from "@/lib/types";

type CourseForm = {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
};

const emptyForm: CourseForm = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [createForm, setCreateForm] = useState<CourseForm>(emptyForm);
  const [editCourseId, setEditCourseId] = useState("");
  const [editForm, setEditForm] = useState<CourseForm>(emptyForm);

  useEffect(() => {
    const adminToken = getStoredAdminToken();
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
    setToken(adminToken);
    void loadCourses(adminToken);
  }, [router]);

  async function loadCourses(adminToken: string) {
    setLoading(true);
    try {
      const data = await getAdminCourses(adminToken);
      setCourses(data);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  function updateCreateForm(field: keyof CourseForm, value: string) {
    setCreateForm((previous) => ({ ...previous, [field]: value }));
  }

  function updateEditForm(field: keyof CourseForm, value: string) {
    setEditForm((previous) => ({ ...previous, [field]: value }));
  }

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!token) {
      setStatus("Please login again");
      return;
    }

    setCreating(true);
    setStatus("Creating course...");
    try {
      const message = await adminCreateCourse(token, {
        title: createForm.title,
        description: createForm.description,
        imageUrl: createForm.imageUrl,
        price: Number(createForm.price),
      });
      setStatus(message);
      setCreateForm(emptyForm);
      await loadCourses(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(course: Course) {
    setEditCourseId(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: String(course.price),
    });
  }

  async function onUpdate(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !editCourseId) {
      setStatus("Select a course to edit");
      return;
    }

    setUpdating(true);
    setStatus("Updating course...");
    try {
      const message = await adminUpdateCourse(token, {
        courseId: editCourseId,
        title: editForm.title,
        description: editForm.description,
        imageUrl: editForm.imageUrl,
        price: Number(editForm.price),
      });
      setStatus(message);
      setEditCourseId("");
      setEditForm(emptyForm);
      await loadCourses(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="shell">
      <AdminNav />

      <section className="card intro-card dashboard-head">
        <div>
          <h1 className="title">Admin course manager</h1>
          <p className="muted">Create and edit your course catalog.</p>
        </div>
        <div className="stat-chip">
          <span>{courses.length}</span>
          <p>Courses</p>
        </div>
      </section>
      {status && <p className="status page-status">{status}</p>}

      <section className="admin-grid">
        <article className="card">
          <h2>Create course</h2>
          <form className="form" onSubmit={onCreate}>
            <label>
              Title
              <input
                type="text"
                value={createForm.title}
                onChange={(event) => updateCreateForm("title", event.target.value)}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                value={createForm.description}
                onChange={(event) => updateCreateForm("description", event.target.value)}
                required
              />
            </label>
            <label>
              Image URL
              <input
                type="url"
                value={createForm.imageUrl}
                onChange={(event) => updateCreateForm("imageUrl", event.target.value)}
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                min="0"
                value={createForm.price}
                onChange={(event) => updateCreateForm("price", event.target.value)}
                required
              />
            </label>
            <button className="btn-primary" disabled={creating} type="submit">
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </article>

        <article className="card">
          <h2>Edit course</h2>
          {editCourseId ? (
            <form className="form" onSubmit={onUpdate}>
              <label>
                Title
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) => updateEditForm("title", event.target.value)}
                  required
                />
              </label>
              <label>
                Description
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(event) => updateEditForm("description", event.target.value)}
                  required
                />
              </label>
              <label>
                Image URL
                <input
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(event) => updateEditForm("imageUrl", event.target.value)}
                  required
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  min="0"
                  value={editForm.price}
                  onChange={(event) => updateEditForm("price", event.target.value)}
                  required
                />
              </label>
              <div className="row">
                <button className="btn-primary" disabled={updating} type="submit">
                  {updating ? "Updating..." : "Update"}
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditCourseId("");
                    setEditForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="muted">Pick a course from the list below to edit.</p>
          )}
        </article>
      </section>

      <section className="card">
        <h2>Existing courses</h2>
        {loading ? (
          <p className="muted">Loading courses...</p>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <article className="course-item" key={course._id}>
                <img src={course.imageUrl} alt={course.title} draggable={false} />
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p className="price">INR {course.price}</p>
                </div>
                <div className="actions">
                  <button className="btn-primary" type="button" onClick={() => startEdit(course)}>
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
