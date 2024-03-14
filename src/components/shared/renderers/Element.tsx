import React, { FC, ReactHTML, ReactNode } from "react";

interface ElementProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  content: any;
  children?: ReactNode;
  type?: keyof ReactHTML;
}

const Element: FC<ElementProps> = ({ type, content, ...props }) => {
  if (!content || (typeof content === "string" && content.trim().length === 0))
    return null;
  return type
    ? React.createElement(type, props, props.children ?? content)
    : React.createElement(React.Fragment, null, props.children ?? content);
};

export default Element;
