import React, { useEffect, useRef } from "react";

export interface UseInViewOptions {
  /**
   * The time in milliseconds the element has to be in view to trigger the callback.
   * Default is 0.
   * */
  timeInView?: number;
}

export default function useInView(
  ref: React.RefObject<HTMLElement>,
  options?: UseInViewOptions
) {
  const [isInView, setIsInView] = React.useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  console.log("Testing in | ref - ", ref);

  useEffect(() => {
    const refEl = ref.current;
    if (!refEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (options?.timeInView) {
            timerRef.current = setTimeout(() => {
              setIsInView(true);
            }, options.timeInView);
          } else {
            setIsInView(true);
          }
        } else {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          setIsInView(false);
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (refEl) {
        observer.unobserve(refEl);
      }
    };
  }, [options?.timeInView, ref.current]);

  return isInView;
}
