import { mobileServicesData } from "@/constants/productPageData/services";
import UseMousePos from "@/hooks/useMousePos";
import { useMemo, useRef, useState } from "react";
import CardAnimation from "../shared/renderers/CardAnimation";
import MarkdownRenderer from "../ArtiBot/MarkdownRenderer";
import { PiCaretRightBold } from "react-icons/pi";

const ServiceIntroductionCard = ({
  card,
}: {
  card: (typeof mobileServicesData.cards)[0];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = UseMousePos(containerRef);
  const [expand, setExpand] = useState(false);

  return (
    <div
      ref={containerRef}
      className="arti-card"
      style={{ "--mouse-x": `${mousePos.x}px`, "--mouse-y": `${mousePos.y}px` }}
      onClick={() => {
        setExpand((prev) => !prev);
      }}
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
          <PiCaretRightBold
            style={{ transform: `rotate(${expand ? -90 : 0}deg)` }}
            className="md:hidden transition-all absolute top-5 right-5"
          />
          <h4 className="font-bold z-10 text-lg mb-2">{card.title}</h4>
          <p className="relative text-sm leading-5 z-10 text-gray-400">
            {card.description}
          </p>
          <ul
            className="list-disc font-diatype [&>*]:mb-2 mt-3 mx-3"
            style={{
              maxHeight: expand ? "800px" : 0,
              transition: ".3s ease-out",
              opacity: expand ? 1 : 0,
            }}
          >
            {card.list.map((item, ind) => (
              <li
                className="font-gilroyRegular [&_*]:text-sm [&_strong]:font-gilroyBold text-white !text-sm leading-3"
                key={ind}
              >
                <MarkdownRenderer
                  className="service-markdown"
                  markdownContent={item}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// const previews = mobileServicesData.cards.map((card) => ({
//   id: card.id,
//   el: <ServiceIntroductionCard key={card.id} card={card} />,
// }));

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
