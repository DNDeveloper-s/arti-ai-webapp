import { useEffect, useState } from "react";
import useMounted from "./useMounted";

export default function useOrigin() {
  const [origin, setOrigin] = useState<string | null>(null);

  const isMounted = useMounted();

  useEffect(() => {
    if (!isMounted) return;

    setOrigin(window.location.origin);
  }, [isMounted]);

  return origin;
}
