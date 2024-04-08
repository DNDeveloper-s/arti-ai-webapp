import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function ImageTemp(props: any) {
  const { state } = useUser();

  return state.data?.email === "ramukakano211@gmail.com" ? (
    <img {...props} />
  ) : (
    <Image {...props} />
  );
}
