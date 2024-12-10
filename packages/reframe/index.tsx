"use client"
import ReFrameClient from "./client/ReFrameClient"
export { StreamingFragment } from "./components/StreamingFragment.client"
import ui from "./components/RNBundle.client"

export { ReFrameClient }
export { ui }
export * from "./components/RNBundle.client"

import { ReactNode } from "react"

export const ReactServerDOMServer = {
  render(render: () => ReactNode): AsyncIterable<string> {
    throw new Error("Not implemented")
  },
}

export { Use } from "./client/usable"
export { renderDynamicClientModule } from "./client/renderDynamicClientModule"
