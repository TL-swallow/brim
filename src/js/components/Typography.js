/* @flow */
import * as React from "react"
import classNames from "classnames"

type Props = {
  children?: React.Node,
  bold?: boolean,
  underline?: boolean,
  className?: string
}

export const Header = ({children, ...props}: Props) => (
  <h2 {...props} className="header">
    {children}
  </h2>
)

export const Paragraph = ({children, bold, underline, ...props}: Props) => (
  <h2 {...props} className={classNames("paragraph", {bold, underline})}>
    {children}
  </h2>
)

type CodeProps = {
  children?: React.Node,
  light?: boolean,
  full?: boolean
}

export const Code = ({children, full, light, ...props}: CodeProps) => (
  <pre {...props} className={classNames("code", {full, light})}>
    {children}
  </pre>
)

export const Fieldset = ({children, className, ...props}: Props) => (
  <p className={classNames("fieldset", className)} {...props}>
    {children}
  </p>
)

export const Subscript = ({children, className, ...props}: Props) => (
  <sup className={classNames("subscript", className)} {...props}>
    {children}
  </sup>
)

export const Label = ({children, ...props}: Props) => (
  <label className="label" {...props}>
    {children}
  </label>
)

export const Title = ({children, className, ...props}: Props) => (
  <h1 className={classNames("title", className)} {...props}>
    {children}
  </h1>
)

export const Link = ({children, className, ...props}: Props) => (
  <a className={classNames("link", className)} {...props}>
    {children}
  </a>
)