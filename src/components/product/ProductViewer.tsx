import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Camera, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Lazy load 3D components for better initial load
const ShoeViewer3D = lazy(() => 
  import("./ShoeViewer3D").then(module => ({ default: module.ShoeViewer3D }))
);
const ARViewer = lazy(() => 
  import("./ARViewer").then(module => ({ default: module.ARViewer }))
);

type ViewMode = "images" | "3d";

interface ProductViewerProps {
  images: string[];
  model3dUrl?: string | null;
  productName: string;
  isNew?: boolean;
  discount?: number;
}

export function ProductViewer({
  images,
  model3dUrl,
  productName,
  isNew,
  discount,
}: ProductViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("images");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showARViewer, setShowARViewer] = useState(false);

  // Check if mobile for AR button visibility
  const isMobile = typeof navigator !== "undefined" && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const has3DModel = Boolean(model3dUrl);

  return (
    <div className="space-y-5">
      {/* View Mode Toggle */}
      {has3DModel && (
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-muted p-1">
            <Button
              variant={viewMode === "images" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg gap-2"
              onClick={() => setViewMode("images")}
            >
              <Image className="h-4 w-4" />
              Photos
            </Button>
            <Button
              variant={viewMode === "3d" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg gap-2"
              onClick={() => setViewMode("3d")}
            >
              <Box className="h-4 w-4" />
              3D View
            </Button>
          </div>
          
          {isMobile && model3dUrl && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 ml-auto"
              onClick={() => setShowARViewer(true)}
            >
              <Camera className="h-4 w-4" />
              View in AR
            </Button>
          )}
        </div>
      )}

      {/* Main Viewer */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
        <AnimatePresence mode="wait">
          {viewMode === "images" ? (
            <motion.div
              key="images"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              {images[selectedImageIndex] ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImageIndex]}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                  <span className="text-9xl opacity-30">👟</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-5 top-5 flex flex-col gap-2">
                {isNew && (
                  <Badge className="bg-accent text-accent-foreground font-semibold px-3 py-1">
                    NEW
                  </Badge>
                )}
                {discount && discount > 0 && (
                  <Badge variant="destructive" className="font-semibold px-3 py-1">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl shadow-lg"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl shadow-lg"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading 3D viewer...</p>
                    </div>
                  </div>
                }
              >
                {model3dUrl && (
                  <ShoeViewer3D
                    modelUrl={model3dUrl}
                    productName={productName}
                    onClose={() => setViewMode("images")}
                  />
                )}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails (only in image mode) */}
      {viewMode === "images" && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted transition-all ${
                selectedImageIndex === index
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          
          {/* 3D thumbnail shortcut */}
          {has3DModel && (
            <button
              onClick={() => setViewMode("3d")}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-primary/10 transition-all hover:bg-primary/20 flex items-center justify-center"
            >
              <Box className="h-8 w-8 text-primary" />
              <span className="absolute bottom-1 text-[10px] font-semibold text-primary">3D</span>
            </button>
          )}
        </div>
      )}

      {/* AR Viewer Modal */}
      {showARViewer && model3dUrl && (
        <Suspense fallback={null}>
          <ARViewer
            modelUrl={model3dUrl}
            productName={productName}
            onClose={() => setShowARViewer(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
