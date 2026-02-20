"use client";
import { useState } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import toast from "react-hot-toast";
import api from "@/utils/api";

export default function PaymentModal({ course, onClose, onSuccess }) {
  const [method, setMethod] = useState(null); // 'razorpay' | 'solana'
  const [processing, setProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  // Handle Razorpay
  const handleRazorpay = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/payments/razorpay/create-order", {
        courseId: course._id,
      });

      // We need 'window' here, so this function runs client-side
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
            toast.success("Payment successful! 🎉");
            onSuccess();
          } catch (err) {
            toast.error("Payment verification failed.");
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
      toast.error(err.response?.data?.message || "Something went wrong.");
      setProcessing(false);
    }
  };

  // Handle Solana
  const handleSolana = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your Solana wallet first.");
      return;
    }

    setProcessing(true);
    try {
      // Get merchant wallet
      const { data: config } = await api.get("/payments/solana/config");
      const merchantPubkey = new PublicKey(config.merchantWallet);
      const amountLamports = Math.round(course.priceInSol * LAMPORTS_PER_SOL);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: merchantPubkey,
          lamports: amountLamports,
        }),
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      toast.loading("Confirming transaction on Solana...", {
        id: "sol-confirm",
      });

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      toast.dismiss("sol-confirm");

      // Verify on backend
      const { data: verification } = await api.post("/payments/solana/verify", {
        signature,
        courseId: course._id,
        walletAddress: publicKey.toBase58(),
      });

      setTxSignature(signature);
      toast.success("Solana payment verified! 🎉");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Transaction failed.",
      );
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

        {/* If completed */}
        {txSignature ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Payment Confirmed!</h3>
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm flex items-center justify-center gap-1 hover:underline"
            >
              View on Solana Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : !method ? (
          /* Payment method selection */
          <div className="space-y-3">
            <button
              onClick={() => setMethod("razorpay")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-dark-600 hover:border-blue-500/50 hover:bg-dark-700/50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold group-hover:text-blue-400 transition">
                  Pay with Razorpay
                </h3>
                <p className="text-sm text-dark-400">UPI, Cards, Net Banking</p>
              </div>
              <span className="text-lg font-bold">₹{course.price}</span>
            </button>

            <button
              onClick={() => setMethod("solana")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-dark-600 hover:border-purple-500/50 hover:bg-dark-700/50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold group-hover:text-purple-400 transition">
                  Pay with Solana
                </h3>
                <p className="text-sm text-dark-400">Phantom, Solflare</p>
              </div>
              <span className="text-lg font-bold">{course.priceInSol} SOL</span>
            </button>

            <div className="mt-4 p-3 bg-dark-900/50 rounded-xl">
              <p className="text-xs text-dark-400 text-center">
                🔒 Payments are secure and encrypted. Blockchain payments are
                verified on-chain.
              </p>
            </div>
          </div>
        ) : method === "razorpay" ? (
          /* Razorpay confirmation */
          <div className="space-y-4">
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Course</span>
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-300">Amount</span>
                <span className="text-xl font-bold">₹{course.price}</span>
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
              {processing ? "Processing..." : "Pay ₹" + course.price}
            </button>
            <button
              onClick={() => setMethod(null)}
              className="btn-secondary w-full text-sm"
            >
              ← Choose different method
            </button>
          </div>
        ) : (
          /* Solana confirmation */
          <div className="space-y-4">
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Course</span>
                <span className="font-medium text-sm">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-300">Amount</span>
                <span className="text-xl font-bold">
                  {course.priceInSol} SOL
                </span>
              </div>
            </div>

            {!connected ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-dark-300 text-sm">
                  Connect your wallet to proceed
                </p>
                <WalletMultiButton />
              </div>
            ) : (
              <>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400">
                  ✓ Wallet connected: {publicKey?.toBase58().slice(0, 6)}...
                  {publicKey?.toBase58().slice(-4)}
                </div>
                <button
                  onClick={handleSolana}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wallet className="w-5 h-5" />
                  )}
                  {processing
                    ? "Processing..."
                    : `Pay ${course.priceInSol} SOL`}
                </button>
              </>
            )}

            <button
              onClick={() => setMethod(null)}
              className="btn-secondary w-full text-sm"
            >
              ← Choose different method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
