import type { ReactNode } from "react"
import "server-only"
import { PassThrough } from "stream"
export const name = "@subtlegradient/reframe/server"

// import * as ReactServerDOMServer from "react-server-dom-webpack/server"
// import { registerClientReference } from "react-server-dom-webpack/server"
// import type { ReactReference$$id } from "react-server-dom-webpack/server"
// import ReactServerDOMServer, { type BundlerConfig } from "react-server-dom-webpack/server"

import ReactServerDOMServer, {
  registerClientReference,
  registerServerReference,
} from "@double-observer/react-server-dom-esm/server"
import type { ServerReference } from "@double-observer/react-server/shared"
export { registerClientReference, registerServerReference }
// import type { ReactClientValue } from "@double-observer/react-server/src/ReactFlightServer"

export interface CustomServerTags {
  // flarm: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}

// export { ReactFlightDOMServer, ReactFlightDOMServer as ReactServerDOMServer }

export const html = new Proxy<Record<keyof JSX.IntrinsicElements, () => ReactNode>>({} as any, {
  get: (): ReactNode => {
    return null
  },
})

export class ClientBundle {}

type renderToPipeableStreamArgs = Parameters<typeof ReactServerDOMServer.renderToPipeableStream>

// function renderToPipeableStream(renderable: any, clientManifest: BundlerConfig) {
//   debugger
//   return ReactServerDOMServer.renderToPipeableStream(renderable, clientManifest, {
//     onError: (err: unknown) => console.error("ReactServerDOMServer.renderToPipeableStream onError", err),
//     onPostpone: (reason: unknown) => console.warn("ReactServerDOMServer.renderToPipeableStream onPostpone", reason),
//   })
// }

// export async function* renderToAsyncIterable(renderable: any, clientManifest: BundlerConfig): AsyncIterable<string> {
//   invariant(clientManifest, "clientManifest is required")
//   invariant(typeof clientManifest === "object", "clientManifest must be an object")

//   const pipeableStream = renderToPipeableStream(renderable, clientManifest)

//   const passThrough = new PassThrough()
//   pipeableStream.pipe(passThrough)

//   const textDecoder = new TextDecoder("utf-8")

//   try {
//     for await (const chunk of passThrough) {
//       yield textDecoder.decode(chunk, { stream: true })
//     }
//   } finally {
//     yield textDecoder.decode(undefined, { stream: false })
//   }
// }

export class ReFrameServer {
  // static renderToAsyncIterable = renderToAsyncIterable
  static async renderToPipeableStream(...args: renderToPipeableStreamArgs) {
    return ReactServerDOMServer.renderToPipeableStream(...args)
  }

  static async *renderToAsyncIterable(...args: renderToPipeableStreamArgs): AsyncIterable<string> {
    const pipeableStream = await ReFrameServer.renderToPipeableStream(...args)

    const passThrough = new PassThrough()
    pipeableStream.pipe(passThrough)

    const textDecoder = new TextDecoder("utf-8")

    try {
      for await (const chunk of passThrough) {
        yield textDecoder.decode(chunk, { stream: true })
      }
    } finally {
      yield ""
    }
  }

  constructor() {
    throw new Error("FIXME: not sure what calling new ReFrameServer() should do yet")
  }
}

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

// define the client components available on the server
// this is usually handled in a react-server compatible bundler based on the "use client" directive
export const clientComponents = {
  Text: registerClientReference(genClientProxy("Text"), "RN", "Text"),
  View: registerClientReference(genClientProxy("View"), "RN", "View"),
}

/**
 * dependency injection the {@link ReactFlightDOMServer} implementation
 */
// export const clientManifest: ReactFlightDOMServer.IReactClientManifest = {}
// {
//   // generate the manifest for the client components
//   // this is usually handled in a react-server compatible bundler
//   for (const [key, Component] of Object.entries(
//     clientComponents as unknown as Record<
//       "RNBundleComponentName",
//       ReturnType<typeof ReactFlightDOMServer.registerClientReference>
//     >,
//   )) {
//     const [id, name] = Component.$$id.split("#")
//     if (key !== name)
//       throw new Error(`Component key "${key}" must match export "${name}". Check clientComponents object`)
//     clientManifest[Component.$$id] = { id, chunks: [], name }
//   }
// }

export async function Await({ children: promise }: { children: React.ReactNode | Promise<React.ReactNode> }) {
  "server only"
  return await promise
}
