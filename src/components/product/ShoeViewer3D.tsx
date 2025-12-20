import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html,
  useProgress,
  PresentationControls
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Maximize2, Minimize2, Info, ZoomIn, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoeModel } from "./ShoeModel";

interface ShoeViewer3DProps {
  modelUrl: string;
  productName: string;
  onClose?: () => void;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted opacity-20"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              className="text-primary transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

function Scene({ 
  modelUrl, 
  autoRotate 
}: { 
  modelUrl: string; 
  autoRotate: boolean;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={2048}
      />
      <spotLight
        position={[-10, 10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
      />
      <directionalLight position={[0, 5, 5]} intensity={0.5} />

      {/* Environment for realistic reflections */}
      <Environment preset="city" />

      {/* The shoe model */}
<Suspense fallback={<Loader />}>
  <PresentationControls
    global
    snap
    rotation={[0, -Math.PI / 4, 0]}
    polar={[-Math.PI / 4, Math.PI / 4]}
    azimuth={[-Math.PI / 4, Math.PI / 4]}
    springConfig={{
      mass: 1.2,
      tension: 280,
      friction: 26,
    }}
   >
        <ShoeModel url={modelUrl} autoRotate={autoRotate} />
        </PresentationControls>
      </Suspense>


      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Orbit controls for user interaction */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function ShoeViewer3D({ modelUrl, productName, onClose }: ShoeViewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-background"
    : "relative aspect-square rounded-3xl bg-gradient-to-br from-muted to-muted/50 overflow-hidden";

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="touch-none"
      >
        <Scene modelUrl={modelUrl} autoRotate={autoRotate} />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {/* Left controls */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-10 rounded-xl backdrop-blur-md bg-background/80"
            onClick={() => setAutoRotate((prev) => !prev)}
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${autoRotate ? "animate-spin" : ""}`} />
            {autoRotate ? "Stop" : "Rotate"}
          </Button>
        </div>

        {/* Right controls */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-xl backdrop-blur-md bg-background/80"
            onClick={() => setShowTips((prev) => !prev)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-xl backdrop-blur-md bg-background/80"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Tips overlay */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-md px-3 py-2 text-xs">
              <Move className="h-3 w-3" />
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-md px-3 py-2 text-xs">
              <ZoomIn className="h-3 w-3" />
              <span>Scroll to zoom</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product name badge */}
      <div className="absolute top-4 right-4">
        <div className="rounded-xl bg-background/80 backdrop-blur-md px-4 py-2">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-xs text-muted-foreground">3D View</p>
        </div>
      </div>

      {/* Close button in fullscreen */}
      {isFullscreen && onClose && (
        <Button
          variant="secondary"
          className="absolute top-4 left-4 rounded-xl"
          onClick={() => {
            setIsFullscreen(false);
            onClose();
          }}
        >
          Exit Fullscreen
        </Button>
      )}
    </motion.div>
  );
}
