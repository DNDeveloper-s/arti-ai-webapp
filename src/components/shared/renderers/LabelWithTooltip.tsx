import { Tooltip } from "antd";
import Element from "./Element";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import React from "react";
import { TooltipPlacement } from "antd/es/tooltip";
import { LiteralUnion } from "antd/es/_util/type";
import { PresetColorType } from "antd/es/_util/colors";
import { colors } from "@/config/theme";

interface LableWithTooltipProps {
  content?: string;
  label: string;
  placement?: TooltipPlacement;
  color?: LiteralUnion<PresetColorType>;
}
export default function LableWithTooltip(props: LableWithTooltipProps) {
  return (
    <div className="flex items-center gap-3">
      <span>{props.label}</span>
      <Element content={props.content}>
        <Tooltip
          placement={props.placement}
          title={props.content}
          color={props.color ?? colors.primary}
        >
          <AiOutlineQuestionCircle className="cursor-pointer" />
        </Tooltip>
      </Element>
    </div>
  );
}
