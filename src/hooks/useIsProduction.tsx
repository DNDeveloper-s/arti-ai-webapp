import useOrigin from "./useOrigin";

const productionOrigins = ["https://artiai.org/"];

export default function useIsProduction() {
  const origin = useOrigin();

  return origin ? productionOrigins.includes(origin) : false;
}
