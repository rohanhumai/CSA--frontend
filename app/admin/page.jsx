"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/courses"),
      ]);
      setStats(statsRes.data.stats);
      setCourses(coursesRes.data.courses);
    } catch (err) {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      toast.success("Course deleted.");
    } catch (err) {
      toast.error("Failed to delete course.");
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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-dark-300 mt-1">
            Manage your courses and track revenue.
          </p>
        </div>
        <Link
          href="/admin/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Course
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
                <p className="text-sm text-dark-400">Courses</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-dark-400">Students</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{stats.revenueINR?.toLocaleString()}
                </p>
                <p className="text-sm text-dark-400">Revenue (INR)</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.revenueSOL?.toFixed(2)} SOL
                </p>
                <p className="text-sm text-dark-400">Revenue (SOL)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-700/50">
          <h2 className="font-semibold">All Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-700/30">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-dark-300">
                  Course
                </th>
                <th className="text-left px-5 py-3 font-medium text-dark-300">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-medium text-dark-300">
                  Price
                </th>
                <th className="text-left px-5 py-3 font-medium text-dark-300">
                  Students
                </th>
                <th className="text-left px-5 py-3 font-medium text-dark-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-dark-700/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-xs text-dark-400">{course.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-dark-700 rounded-full text-xs">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium">₹{course.price}</p>
                      <p className="text-xs text-purple-400">
                        {course.priceInSol} SOL
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">{course.totalStudents}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${course._id}`}
                        className="p-2 hover:bg-dark-700 rounded-lg transition"
                      >
                        <span className="sr-only">Edit</span>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
