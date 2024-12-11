/**
 * NOTE: Put this line above imports to enable JSX extensions in this file
 * @jsxImportSource @double-observer/reframe/client
 */
import type { CustomClientTags } from "@double-observer/reframe/client"

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
