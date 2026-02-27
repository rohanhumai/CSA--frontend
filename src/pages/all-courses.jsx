import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../api";
import AppLayout from "../components/AppLayout";
import CourseCard from "../components/CourseCard";
import { session } from "../lib/session";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function AllCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [processingCourseId, setProcessingCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");

  const isLoggedIn = Boolean(token);

  const loadCourses = async (activeToken) => {
    const data = await api.getCourses({ token: activeToken });
    setCourses(data);
  };

  useEffect(() => {
    const userToken = session.getUserToken();
    setToken(userToken);

    const bootstrap = async () => {
      try {
        await loadCourses(userToken);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const handleEnroll = async (course) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      setProcessingCourseId(course._id);
      setError("");

      const order = await api.createRazorpayOrder(course._id, token);
      if (order.alreadyPurchased) {
        await loadCourses(token);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      await new Promise((resolve, reject) => {
        const paymentObject = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Course Selling App",
          description: `Purchase ${course.title}`,
          order_id: order.orderId,
          handler: async (response) => {
            try {
              await api.verifyRazorpayPayment(
                {
                  courseId: course._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                token
              );
              await loadCourses(token);
              resolve();
            } catch (verificationError) {
              reject(verificationError);
            }
          },
          prefill: {},
          notes: { courseId: course._id },
          theme: { color: "#0d9488" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });

        paymentObject.open();
      });
    } catch (paymentError) {
      setError(paymentError.message || "Payment failed");
    } finally {
      setProcessingCourseId("");
    }
  };

  const hasAnyPurchased = useMemo(() => courses.some((course) => course.hasPurchased), [courses]);
  const categories = useMemo(() => {
    const values = Array.from(new Set(courses.map((course) => course.category).filter(Boolean)));
    return ["All", ...values];
  }, [courses]);
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    const prepared = courses.filter((course) => {
      const byCategory = category === "All" || course.category === category;
      if (!byCategory) return false;
      if (!query) return true;
      const haystack = `${course.title || ""} ${course.description || ""} ${course.category || ""}`.toLowerCase();
      return haystack.includes(query);
    });

    const sorted = [...prepared];
    if (sort === "price-low") sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price-high") sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sort === "name") sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (sort === "popular") sorted.sort((a, b) => Number(b.pyqs?.length || 0) - Number(a.pyqs?.length || 0));
    return sorted;
  }, [category, courses, search, sort]);
  const totalCourses = courses.length;
  const totalPyqs = useMemo(
    () => courses.reduce((sum, course) => sum + Number(course.pyqs?.length || 0), 0),
    [courses]
  );

  return (
    <AppLayout variant="student">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">Course Catalog</h2>
        <p className="mt-2 text-slate-600">Discover, compare, and unlock exam-focused PYQ courses.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Published Courses</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalCourses}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">PYQs in Library</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalPyqs}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Purchased</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{courses.filter((item) => item.hasPurchased).length}</p>
          </article>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            placeholder="Search by title, category, or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Sort: Most PYQs</option>
            <option value="price-low">Sort: Price Low to High</option>
            <option value="price-high">Sort: Price High to Low</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>
      </section>

      {loading ? <p className="mt-4 text-slate-500">Loading courses...</p> : null}
      {!loading && error ? <p className="mt-4 text-rose-700">{error}</p> : null}
      {!loading && !error && isLoggedIn && hasAnyPurchased ? (
        <p className="mt-4 text-sm text-teal-700">Purchased courses are unlocked in My Courses.</p>
      ) : null}

      {!loading && !error ? (
        filteredCourses.length === 0 ? (
          <p className="mt-4 text-slate-500">No published courses yet.</p>
        ) : (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const enrolled = Boolean(course.hasPurchased);
              const processing = processingCourseId === course._id;
              return (
                <CourseCard
                  key={course._id}
                  course={course}
                  actionLabel={enrolled ? "Purchased" : processing ? "Processing..." : "Buy Now"}
                  actionDisabled={enrolled || processing}
                  onAction={() => handleEnroll(course)}
                />
              );
            })}
          </section>
        )
      ) : null}
    </AppLayout>
  );
}

