/**
 * NOTE: Put this line above imports to enable JSX extensions in this file
 * @jsxImportSource @double-observer/reframe/server
 */
import type { CustomServerTags } from "@double-observer/reframe/server"

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

export * from "react/jsx-runtime"
