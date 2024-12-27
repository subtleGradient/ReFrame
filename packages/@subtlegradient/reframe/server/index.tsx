import "server-only"

import type { ServerReference } from "@double-observer/react-server-dom-esm/server"
export type { ServerReference }

import { registerClientReference, registerServerReference } from "@double-observer/react-server-dom-esm/server"
export { registerClientReference, registerServerReference }

import type { ReactNode } from "react"

export interface CustomServerTags {
  // flarm: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}

export const html = new Proxy<Record<keyof JSX.IntrinsicElements, () => ReactNode>>({} as any, {
  get: (): ReactNode => {
    return null
  },
})

// wrap all function props with ServerReference<T>
type ClientProps<P> = { [K in keyof P]: P[K] extends (...args: any) => any ? ServerReference<P[K]> : P[K] }

/**
 * Creates a fake client component that represents a client component that is not available on the server.
 * This lets us compose client components in a way that is compatible with the server.
 */
export function genClientProxy<P extends object, R extends ReactNode = ReactNode>(displayName: string) {
  return Object.assign(ClientComponentProxy, { displayName })
  function ClientComponentProxy(props: ClientProps<P>): R {
    throw new TypeError(`server proxy to client component "${displayName}" unexpectedly called on the server.
      Missing --conditions=react-server?`)
  }
}

import ReFrameServer from "./ReFrameServer"
export default ReFrameServer
