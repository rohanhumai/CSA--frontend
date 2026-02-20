"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/utils.api";

const categories = [
  "All",
  "Web Development",
  "Blockchain",
  "DevOps",
  "Mobile Development",
  "Data Science",
  "System Design",
  "DSA",
];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    void fetchCourses();
  }, [category, level]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (level !== "All") params.level = level;
      if (search) params.search = search;

      const { data } = await api.get("/courses", { params });
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    void fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Explore <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-dark-300">
          Invest in yourself. Master in-demand skills.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-12"
          />
        </form>

        <div className="flex gap-3 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field !w-auto !py-2 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input-field !w-auto !py-2 cursor-pointer"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All Levels" : l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-dark-400 text-lg">No courses found.</p>
          <p className="text-dark-500 text-sm mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/courses/${course._id}`}
              className="card-hover group block"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-dark-300 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.totalStudents || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dark-700/50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">Rs. {course.price}</span>
                    <span className="text-sm text-purple-400 font-medium">
                      / {course.priceInSol} SOL
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition">
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
