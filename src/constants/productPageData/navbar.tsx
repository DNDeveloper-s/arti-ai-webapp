import { isProduction } from "@/helpers";
import { CaseStudy } from "@/constants/landingPageData";
import NavDropdownItem from "@/components/shared/renderers/NavDropdownItem";

export const navbarData = {
  navItems: [
    {
      id: "1",
      href: "/#home",
      label: "Home",
    },
    {
      id: "2",
      href: "/#why-us",
      label: "Why Us",
    },
    {
      id: "3",
      href: "/#services",
      label: "Services",
    },
    {
      id: "4",
      href: "/#case-studies",
      label: "Case Studies",
      children: [
        {
          id: "31",
          href: `/case-study/${CaseStudy.MIDTOWN_EAST}`,
          label: (
            <NavDropdownItem label={"Midtown East"} info="Physical Therapy" />
          ),
        },
        {
          id: "32",
          href: `/case-study/${CaseStudy.AMPLIFIED_EMS}`,
          label: <NavDropdownItem label={"Amplified EMS"} info="Gym" />,
        },
        {
          id: "33",
          href: `/case-study/${CaseStudy.ANT_STREET_WEAR}`,
          label: <NavDropdownItem label={"AnT Street Wear"} info="Fashion" />,
        },
      ],
    },
  ],
  cta: {
    href: isProduction ? "/#contact" : "/auth",
    label: isProduction ? "Join Waitlist" : "Sign In",
  },
};
