import { mobileServicesData } from "@/constants/productPageData/services";
import UseMousePos from "@/hooks/useMousePos";
import { useRef } from "react";

const ServiceIntroductionCard = ({
  card,
}: {
  card: (typeof mobileServicesData.cards)[0];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = UseMousePos(containerRef);

  return (
    <div
      ref={containerRef}
      className="arti-card"
      style={{ "--mouse-x": `${mousePos.x}px`, "--mouse-y": `${mousePos.y}px` }}
    >
      <div className="p-6 relative h-full bg-gray-950 rounded-[inherit] z-20 overflow-hidden  font-diatype">
        {/* <div className="px-2 md:px-4 flex justify-center items-center">
          <div className="w-7 md:w-12 h-7 md:h-12">
            <card.icon
              className={
                "w-full h-full text-gray-400 fill-gray-400 stroke-gray-400"
              }
            />
          </div>
        </div> */}
        <div
          className={
            "flex-1 flex flex-col items-start justify-start md:justify-start h-full py-2 md:py-6"
          }
        >
          <h4 className="font-bold z-10 text-lg mb-2">{card.title}</h4>
          <p className="relative text-sm leading-5 z-10 text-gray-400">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ServiceIntroduction() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10">
        {mobileServicesData.cards.map((card) => (
          <ServiceIntroductionCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
