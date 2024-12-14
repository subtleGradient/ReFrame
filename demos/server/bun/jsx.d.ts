import type { ReactNode } from "react"

interface DemoTags {
  blockquote: { children: never }
  flarm: { children?: ReactNode }
  glarm: { children?: ReactNode }
}

declare module "@subtlegradient/reframe/server" {
  interface CustomServerTags extends DemoTags {}
}
