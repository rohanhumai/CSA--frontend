"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  Users,
  Star,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils.api";
import { useAuth } from "@/context/AuthContext";
import PaymentModal from "@/components/PaymentModal";

export default function CourseDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [expandedSyllabus, setExpandedSyllabus] = useState({});

  useEffect(() => {
    if (id) {
      void fetchCourse();
      if (user) void checkPurchase();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.course);
    } catch {
      toast.error("Course not found.");
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async () => {
    try {
      const { data } = await api.get(`/user/check-purchase/${id}`);
      setPurchased(Boolean(data.purchased));
    } catch {
      setPurchased(false);
    }
  };

  const handleBuy = () => {
    if (!user) {
      toast.error("Please sign in to purchase.");
      router.push("/login");
      return;
    }
    setShowPayment(true);
  };

  const toggleSyllabus = (index) => {
    setExpandedSyllabus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div>
      <div className="relative bg-dark-900/50 border-b border-dark-700/50">
        <div className="absolute inset-0">
          <img src={course.imageUrl} alt="" className="w-full h-full object-cover opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 to-dark-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-dark-700 text-dark-200 text-sm rounded-full">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-dark-300 text-lg mb-6 leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-dark-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  {course.totalStudents} students
                </span>
                {course.rating > 0 && (
                  <span className="flex items-center gap-2 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    {course.rating}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  By {course.instructor}
                </span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black">Rs. {course.price}</span>
                  <span className="text-purple-400 font-semibold">/ {course.priceInSol} SOL</span>
                </div>

                {purchased ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold">Course Purchased!</p>
                    <p className="text-sm text-dark-300 mt-1">You have full access</p>
                  </div>
                ) : (
                  <button onClick={handleBuy} className="btn-primary w-full text-lg !py-4 mb-4">
                    Buy Now
                  </button>
                )}

                <ul className="space-y-3">
                  {(course.features || []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-dark-200">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {course.syllabus && course.syllabus.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8">
            Course <span className="gradient-text">Syllabus</span>
          </h2>

          <div className="space-y-3">
            {course.syllabus.map((module, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() => toggleSyllabus(index)}
                  className="w-full flex items-center justify-between p-5 hover:bg-dark-700/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-dark-400">{module.lessons?.length || 0} lessons</p>
                    </div>
                  </div>
                  {expandedSyllabus[index] ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </button>

                {expandedSyllabus[index] && module.lessons && (
                  <div className="border-t border-dark-700/50 px-5 pb-5">
                    <ul className="space-y-2 pt-4">
                      {module.lessons.map((lesson, li) => (
                        <li key={li} className="flex items-center gap-3 text-sm text-dark-300 py-2">
                          <PlayCircle className="w-4 h-4 text-dark-500 flex-shrink-0" />
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          course={course}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            setPurchased(true);
          }}
        />
      )}
    </div>
  );
}
