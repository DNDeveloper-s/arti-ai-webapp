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
  classNames?: {
    base?: string;
    label?: string;
    tooltip?: string;
    icon?: string;
  };
}
export default function LableWithTooltip(props: LableWithTooltipProps) {
  return (
    <div
      className={"flex items-center gap-3 " + (props.classNames?.base ?? "")}
    >
      <span className={props.classNames?.label ?? ""}>{props.label}</span>
      <Element content={props.content}>
        <Tooltip
          placement={props.placement}
          title={props.content}
          color={props.color ?? colors.primary}
          className={props.classNames?.tooltip ?? ""}
        >
          <AiOutlineQuestionCircle
            className={"cursor-pointer " + (props.classNames?.icon ?? "")}
          />
        </Tooltip>
      </Element>
    </div>
  );
}
