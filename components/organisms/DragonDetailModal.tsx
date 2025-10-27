/**
 * Organism: DragonDetailModal
 * Full-screen modal with liquid glass design for dragon details
 */

"use client";

import { useEffect, useMemo, lazy, Suspense, memo } from "react";
import { X } from "lucide-react";
import type { Dragon } from "@/components/molecules/ImageCache";

// Lazy load the heavy template component
const DragonDetailTemplate = lazy(() => 
  import("@/components/templates/DragonDetailTemplate").then(module => ({
    default: module.DragonDetailTemplate
  }))
);

interface DragonDetailModalProps {
  dragon: Dragon | null;
  relatedDragons: Dragon[];
  isOpen: boolean;
  onClose: () => void;
}

export const DragonDetailModal: React.FC<DragonDetailModalProps> = ({
  dragon,
  relatedDragons,
  isOpen,
  onClose,
}) => {
  // Transform Dragon type to dragon data expected by template
  const dragonData = useMemo(() => {
    if (!dragon) return null;
    return {
      _id: dragon._id,
      name: dragon.name,
      latinName: dragon.latinName || dragon.name,
      images: (dragon.images || [dragon.imageUrl]).filter(Boolean) as string[],
      element: dragon.element,
      dangerLevel: dragon.dangerLevel,
      shortDescription: dragon.description?.substring(0, 200),
      description: dragon.description,
      habitat: dragon.habitat,
      powerLevel: dragon.powerLevel,
      wingspan: dragon.wingspan,
      intelligence: dragon.intelligence,
      speed: dragon.speed,
      fireBreath: dragon.fireBreath,
      family: dragon.family,
      order: dragon.order,
      origin: dragon.origin,
      diet: dragon.diet,
      lifespan: dragon.lifespan,
      abilities: dragon.abilities,
    };
  }, [dragon]);

  // Related dragons already match the expected type
  const relatedDragonsData = useMemo(() => {
    return relatedDragons.map((d) => ({
      ...d,
      latinName: d.latinName || d.name,
    }));
  }, [relatedDragons]);
  // Freeze body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !dragon || !dragonData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - frozen background with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
        style={{
          backdropFilter: "blur(12px) saturate(150%)",
        }}
      />

      {/* Modal Container - Liquid Glass Design */}
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] m-4 flex flex-col">
        {/* Glass Card */}
        <div
          className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow:
              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all hover:scale-110"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto custom-scrollbar">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-dragon-primary"></div>
              </div>
            }>
              <DragonDetailTemplate
                dragon={dragonData}
                categories={[]}
                relatedDragons={relatedDragonsData as any}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

// Custom comparison function for React.memo
const customComparison = (prevProps: DragonDetailModalProps, nextProps: DragonDetailModalProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.dragon?._id === nextProps.dragon?._id &&
    prevProps.onClose === nextProps.onClose
  );
};

export default memo(DragonDetailModal, customComparison);
