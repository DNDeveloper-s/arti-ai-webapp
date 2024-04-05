import { useCallback, useState } from "react";

export default function useKeepInView() {
  const [keepInView, setKeepInView] = useState(false);
  const ref = useCallback(
    (node: any) => {
      if (node) {
        keepInView && node.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    },
    [keepInView]
  );
  return { ref, setKeepInView };
}
