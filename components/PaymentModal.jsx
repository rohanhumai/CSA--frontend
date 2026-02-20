"use client";

import { useState } from "react";
import { X, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils.api";

export default function PaymentModal({ course, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false);

  const handleRazorpay = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/payments/razorpay/create-order", {
        courseId: course._id,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "CourseChain",
        description: course.title,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
            });
            toast.success("Payment successful!");
            onSuccess();
          } catch {
            toast.error("Payment verification failed.");
            setProcessing(false);
          }
        },
        prefill: {},
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-dark-800 border border-dark-700 rounded-2xl max-w-md w-full p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-1">Purchase Course</h2>
        <p className="text-dark-300 text-sm mb-6">{course.title}</p>

        <div className="space-y-4">
          <div className="p-4 bg-dark-900/50 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-dark-300">Course</span>
              <span className="font-medium">{course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Amount</span>
              <span className="text-xl font-bold">Rs. {course.price}</span>
            </div>
          </div>

          <button
            onClick={handleRazorpay}
            disabled={processing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CreditCard className="w-5 h-5" />
            )}
            {processing ? "Processing..." : "Pay Rs. " + course.price}
          </button>

          <button
            onClick={onClose}
            className="btn-secondary w-full text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
