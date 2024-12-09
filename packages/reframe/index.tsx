"use client"
export { StreamingFragment } from "./components/StreamingFragment.client"
import ui from "./components/RNBundle.client"

export { ui }
export * from "./components/RNBundle.client"

import { ReactNode } from "react"

export const ReactServerDOMServer = {
  render(render: () => ReactNode): AsyncIterable<string> {
    throw new Error("Not implemented")
  },
}
