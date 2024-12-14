/**
 * NOTE: Put this line above imports to enable JSX extensions in this file
 * @jsxImportSource @subtlegradient/reframe/client
 */
import type { CustomClientTags } from "@subtlegradient/reframe/client"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends CustomClientTags {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends CustomClientTags {}
  }
}

export * from "react/jsx-runtime"
