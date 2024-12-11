export * from "react/jsx-dev-runtime"

import type { JSX } from "react/jsx-dev-runtime"
export type { JSX }

import { Fragment, jsxDEV as jsxReal } from "react/jsx-dev-runtime"
export { Fragment }

export function jsxDEV(...args: any[]) {
  return jsxReal(...args)
}
