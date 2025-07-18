"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifySignature } from "@/libs/creem";

// This component is used to handle the return URL from Creem payments
// It validates the signature and displays appropriate UI based on payment status
const CreemReturnHandler = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    // Check if this is a return from Creem payment
    const checkoutId = searchParams.get("checkout_id");
    const orderId = searchParams.get("order_id");
    const signature = searchParams.get("signature");

    if (checkoutId && orderId && signature) {
      try {
        // Collect all parameters except signature
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          if (key !== "signature") {
            params[key] = value;
          }
        });

        // Verify the signature
        const verified = verifySignature(params, signature);
        setIsVerified(verified);

        // Check the payment status
        const paymentStatus = searchParams.get("status");
        if (paymentStatus === "completed" && verified) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying Creem payment:", error);
        setStatus("error");
      }
    }
  }, [searchParams]);

  // If no Creem return URL parameters, don't render anything
  if (!searchParams.get("checkout_id")) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-xl p-8 max-w-md w-full shadow-xl">
        {status === "loading" && (
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4 font-medium">Verifying payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="bg-success/20 p-3 rounded-full inline-flex">
              <svg
                className="w-8 h-8 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mt-4">Payment Successful!</h3>
            <p className="mt-2 text-base-content/70">
              Your payment has been processed successfully. Thank you for your purchase!
            </p>
            <button
              className="btn btn-primary mt-6"
              onClick={() => window.location.href = window.location.pathname}
            >
              Continue
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="bg-error/20 p-3 rounded-full inline-flex">
              <svg
                className="w-8 h-8 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mt-4">Payment Error</h3>
            <p className="mt-2 text-base-content/70">
              {isVerified
                ? "Your payment could not be completed. Please try again."
                : "Invalid payment signature. Please contact support if you believe this is an error."}
            </p>
            <button
              className="btn btn-primary mt-6"
              onClick={() => window.location.href = window.location.pathname}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreemReturnHandler; 