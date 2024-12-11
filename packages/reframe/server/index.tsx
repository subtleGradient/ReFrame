import "server-only"
export const name = "@double-observer/reframe/server"
import type { ReactNode } from "react"
// import * as ReactServerDOMServer from "react-server-dom-webpack/server"
import { registerClientReference } from "react-server-dom-webpack/server"
import type { ReactReference$$id } from "react-server-dom-webpack/server"
import ReactServerDOMServer, { type BundlerConfig } from "react-server-dom-webpack/server"

export interface CustomServerTags {
  // flarm: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}

export { ReactServerDOMServer }

export const html = new Proxy<Record<keyof JSX.IntrinsicElements, () => ReactNode>>({} as any, {
  get: (): ReactNode => {
    return null
  },
})

export class ClientBundle {}

export class ReFrameServer {
  static async *renderFromServer() {
    throw new Error("Function not implemented.")
  }

  constructor() {
    throw new Error("FIXME: not sure what calling new ReFrameServer() should do yet")
  }
}

/**
 * Creates a fake client component that represents a client component that is not available on the server.
 * This lets us compose client components in a way that is compatible with the server.
 */
export function genClientProxy<N extends string, P extends object, R extends ReactNode>(name: N) {
  return Object.assign(ClientComponentProxy, { displayName: name })
  function ClientComponentProxy(props: P): R {
    throw new TypeError(`server proxy to client component "${name}" unexpectedly called on the server.
      Missing --conditions=react-server?`)
  }
}

// define the client components available on the server
// this is usually handled in a react-server compatible bundler based on the "use client" directive
export const clientComponents = {
  Text: registerClientReference(genClientProxy("Text"), "RN", "Text"),
  View: registerClientReference(genClientProxy("View"), "RN", "View"),
}

/**
 * dependency injection the {@link ReactServerDOMServer} implementation
 */
export const clientManifest: ReactServerDOMServer.IReactClientManifest = {}
{
  // generate the manifest for the client components
  // this is usually handled in a react-server compatible bundler
  for (const [key, Component] of Object.entries(
    clientComponents as unknown as Record<
      "RNBundleComponentName",
      ReturnType<typeof ReactServerDOMServer.registerClientReference>
    >,
  )) {
    const [id, name] = Component.$$id.split("#")
    if (key !== name)
      throw new Error(
        `Component key "${key}" must match export "${name}". Check clientComponents object`,
      )
    clientManifest[Component.$$id] = { id, chunks: [], name }
  }
}

export async function Await({
  children: promise,
}: {
  children: React.ReactNode | Promise<React.ReactNode>
}) {
  "server only"
  return await promise
}
