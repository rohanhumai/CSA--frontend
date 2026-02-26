import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../api";
import AppLayout from "../components/AppLayout";
import CourseCard from "../components/CourseCard";

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

  const isLoggedIn = Boolean(token);

  const loadCourses = async (activeToken) => {
    const data = await api.getCourses({ token: activeToken });
    setCourses(data);
  };

  useEffect(() => {
    const userToken = window.localStorage.getItem("userToken") || "";
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

  return (
    <AppLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-['Sora'] text-2xl font-semibold text-slate-900">All Courses</h2>
        <p className="mt-2 text-slate-600">Sign in to purchase, then access PDFs only after successful payment.</p>
      </section>

      {loading ? <p className="mt-4 text-slate-500">Loading courses...</p> : null}
      {!loading && error ? <p className="mt-4 text-rose-700">{error}</p> : null}
      {!loading && !error && isLoggedIn && hasAnyPurchased ? (
        <p className="mt-4 text-sm text-teal-700">Purchased courses are unlocked in My Courses.</p>
      ) : null}

      {!loading && !error ? (
        courses.length === 0 ? (
          <p className="mt-4 text-slate-500">No published courses yet.</p>
        ) : (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
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
