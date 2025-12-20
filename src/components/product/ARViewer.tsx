import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARViewerProps {
  modelUrl: string;
  productName: string;
  onClose: () => void;
}

export function ARViewer({ modelUrl, productName, onClose }: ARViewerProps) {
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check WebXR support
    const checkARSupport = async () => {
      if (!navigator.xr) {
        setArSupported(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported("immersive-ar");
        setArSupported(supported);
      } catch {
        setArSupported(false);
      }
    };

    checkARSupport();
  }, []);

  const launchAR = useCallback(async () => {
    if (!navigator.xr) {
      setError("WebXR is not supported on this device");
      return;
    }

    try {
      // For iOS devices, use Quick Look with USDZ format
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // iOS Quick Look requires USDZ format
        // Try to launch with the model URL directly
        const anchor = document.createElement("a");
        anchor.rel = "ar";
        anchor.href = modelUrl.replace(".glb", ".usdz").replace(".gltf", ".usdz");
        
        const img = document.createElement("img");
        anchor.appendChild(img);
        anchor.click();
        return;
      }

      // For Android/Chrome, use model-viewer or Scene Viewer
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        modelUrl
      )}&mode=ar_preferred&title=${encodeURIComponent(
        productName
      )}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
        window.location.href
      )};end;`;

      window.location.href = intentUrl;
    } catch (err) {
      setError("Failed to launch AR experience");
      console.error("AR launch error:", err);
    }
  }, [modelUrl, productName]);

  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative mx-4 max-w-md w-full rounded-3xl bg-card border border-border p-8 text-center"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-xl"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Content */}
          {arSupported === null ? (
            <div className="py-8">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground">Checking AR support...</p>
            </div>
          ) : !isMobile ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                <Smartphone className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-6 font-display text-2xl">View in AR</h2>
              <p className="mt-3 text-muted-foreground">
                AR viewing is available on mobile devices. Scan the QR code or open this page on your phone.
              </p>
              <div className="mt-6 rounded-2xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Open this product page on your mobile device to experience AR
                </p>
              </div>
            </>
          ) : !arSupported ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="mt-6 font-display text-2xl">AR Not Supported</h2>
              <p className="mt-3 text-muted-foreground">
                Unfortunately, your device or browser doesn't support AR experiences. Try using Chrome on Android or Safari on iOS.
              </p>
            </>
          ) : error ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="mt-6 font-display text-2xl">Something went wrong</h2>
              <p className="mt-3 text-muted-foreground">{error}</p>
              <Button className="mt-6 rounded-xl" onClick={() => setError(null)}>
                Try Again
              </Button>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-6 font-display text-2xl">View {productName} in AR</h2>
              <p className="mt-3 text-muted-foreground">
                Place this shoe in your space using augmented reality. Point your camera at a flat surface to begin.
              </p>
              <Button
                size="lg"
                className="mt-6 w-full h-14 rounded-xl font-semibold"
                onClick={launchAR}
              >
                <Camera className="mr-2 h-5 w-5" />
                Launch AR Experience
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Make sure you're in a well-lit area with a clear surface
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
