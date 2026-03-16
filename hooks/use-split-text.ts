import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";

type SplitOptions = {
  types?: string;
  tagName?: string;
  absolute?: boolean;
};

export function useSplitText(options: SplitOptions = { types: "lines, words, chars" }) {
  const ref = useRef<HTMLElement | null>(null);
  const [splitInstance, setSplitInstance] = useState<SplitType | null>(null);
  const [isSplit, setIsSplit] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // We use a small timeout to ensure fonts are loaded and DOM is painted
    // before we do the calculation for line breaks.
    const timer = setTimeout(() => {
      if (!ref.current) return;
      const instance = new SplitType(ref.current, options);
      setSplitInstance(instance);
      setIsSplit(true);
    }, 100);

    const handleResize = () => {
      if (splitInstance) {
        splitInstance.split(options);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (splitInstance) {
        splitInstance.revert();
      }
    };
  }, [options]); // Intentionally omitting splitInstance to avoid loops, it's handled in resize

  return { ref, splitInstance, isSplit };
}
