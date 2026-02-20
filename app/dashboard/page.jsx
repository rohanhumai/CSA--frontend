import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Clock,
  Award,
  Wallet,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletMultiButton from "@solana/wallet-adapter-react-ui";
import api from "@/utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, purchasesRes] = await Promise.all([
        api.get("/user/courses"),
        api.get("/user/purchases"),
      ]);
      setCourses(coursesRes.data.courses);
      setPurchases(purchasesRes.data.purchases);
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
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-dark-300">Here's your learning dashboard.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-mono text-dark-200 truncate max-w-[120px]">
                {connected
                  ? publicKey?.toBase58().slice(0, 12) + "..."
                  : "Not connected"}
              </p>
              <p className="text-sm text-dark-400">Wallet</p>
            </div>
          </div>
        </div>
        <div className="card p-5 flex items-center justify-center">
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !rounded-xl !text-sm !h-10" />
        </div>
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
          <Link
            href="/courses"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Browse More →
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

      {/* Recent Purchases */}
      {purchases.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Purchase History</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-dark-700/50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-dark-300">
                    Course
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-dark-300">
                    Method
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-dark-300">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-dark-300">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-dark-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-dark-700/20">
                    <td className="px-5 py-4 font-medium">{p.course?.title}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.paymentMethod === "solana"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {p.paymentMethod === "solana"
                          ? "◎ Solana"
                          : "₹ Razorpay"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {p.paymentMethod === "solana"
                        ? `${p.amount} SOL`
                        : `₹${p.amount}`}
                    </td>
                    <td className="px-5 py-4 text-dark-300">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
