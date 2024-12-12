/**
 * NOTE: Put this line above imports to enable JSX extensions in this file
 * @jsxImportSource @double-observer/reframe/server
 */
import { genClientProxy, type CustomServerTags } from "@double-observer/reframe/server"
import type { ElementType } from "react"
import { registerClientReference } from "react-server-dom-webpack/server"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends CustomServerTags {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends CustomServerTags {}
  }
}

import type { JSX } from "react/jsx-runtime"
export type { JSX }

import { Fragment, jsx as jsxReal, jsxs as jsxsReal } from "react/jsx-runtime"
export { Fragment }

export function jsx(...args: Parameters<typeof jsxReal>): ReturnType<typeof jsxReal> {
  return jsxReal(...args)
}

export function jsxs(...args: Parameters<typeof jsxsReal>): ReturnType<typeof jsxsReal> {
  return jsxsReal(...args)
}

function convertIntrinsicToProxy<T>(type: ElementType): Exclude<typeof type, string> {
  if (typeof type !== "string") return type
  return registerClientReference<React.FunctionComponent>(genClientProxy(type), "clientBundleId", "exportName")
}
