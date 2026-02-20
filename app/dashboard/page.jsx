"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Clock, Award, Loader2 } from "lucide-react";
import api from "@/utils.api";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, purchasesRes] = await Promise.all([
        api.get("/user/courses"),
        api.get("/user/purchases"),
      ]);
      setCourses(coursesRes.data.courses || []);
      setPurchases(purchasesRes.data.purchases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-dark-300">Here is your learning dashboard.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-sm text-dark-400">Courses</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{purchases.length}</p>
              <p className="text-sm text-dark-400">Purchases</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm text-dark-400">Account</p>
          <p className="font-medium mt-1">{user?.email || "Not signed in"}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
          <Link
            href="/courses"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Browse More
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-dark-400 mb-6">
              Start your learning journey by purchasing a course.
            </p>
            <Link href="/courses" className="btn-primary inline-flex">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="card-hover group block"
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <span className="text-xs text-blue-400 font-medium">
                    {course.category}
                  </span>
                  <h3 className="font-semibold mt-1 line-clamp-2 group-hover:text-blue-400 transition">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-xs text-dark-400">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
