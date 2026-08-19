import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0)");
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const within =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding;

      if (within) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (event.clientX - centerX) / strength;
        const y = (event.clientY - centerY) / strength;
        if (!activeRef.current) {
          activeRef.current = true;
          setIsActive(true);
        }
        setTransform(`translate3d(${x}px, ${y}px, 0)`);
        return;
      }

      if (activeRef.current) {
        activeRef.current = false;
        setIsActive(false);
        setTransform("translate3d(0px, 0px, 0)");
      }
    },
    [padding, strength],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
