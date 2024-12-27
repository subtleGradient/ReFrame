"use client"
export { StreamingFragment } from "../components/StreamingFragment.client"
export { renderDynamicClientModule } from "./renderDynamicClientModule"
export { Use } from "./usable"

export interface CustomClientTags {
  // flarm: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}

import ReFrameClient from "./ReFrameClient"
export default ReFrameClient
