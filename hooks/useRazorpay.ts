"use client";

import { useState, useCallback, useRef } from "react";
import { loadRazorpayScript } from "@/lib/utils";
import { RazorpayOptions } from "@/types";

interface UseRazorpayReturn {
  ready: boolean;
  loading: boolean;
  openCheckout: (options: RazorpayOptions) => Promise<void>;
}

export function useRazorpay(): UseRazorpayReturn {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const scriptLoaded = useRef(false);

  const openCheckout = useCallback(async (options: RazorpayOptions) => {
    setLoading(true);
    try {
      if (!scriptLoaded.current) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error(
            "Failed to load Razorpay script. Please check your internet connection."
          );
        }
        scriptLoaded.current = true;
        setReady(true);
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay is not available.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        // The handler in options will manage redirect; this is a fallback listener
      });
      rzp.open();
    } finally {
      setLoading(false);
    }
  }, []);

  return { ready, loading, openCheckout };
}
