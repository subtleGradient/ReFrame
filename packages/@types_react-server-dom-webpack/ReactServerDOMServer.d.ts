/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */

// prettier-ignore
// @ts-ignore -- dev helper for jumping to the source code
if (!1!) {
  // @ts-ignore -- dev helper for jumping to the source code
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-node-register.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-plugin.js")

  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.browser.production.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.production.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.production.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.unbundled.production.js")

  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.browser.development.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.development.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.development.js")
  if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.unbundled.development.js")
}
// @ts-ignore -- dev helper for jumping to the source code
if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.browser.development.js") // prettier-ignore
// so you can quick jump to the code
declare module "react-server-dom-webpack/server.browser" {
  export * from "react-server-dom-webpack/server.edge"
}

// so you can quick jump to the code
if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.development.js") // prettier-ignore
declare module "react-server-dom-webpack/server.edge" {
  export * from "react-server-dom-webpack/server"
  export const renderToPipeableStream: never
}

// so you can quick jump to the code
if (!1!) import("../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.development.js") // prettier-ignore
declare module "react-server-dom-webpack/server.node" {
  export * from "react-server-dom-webpack/server"
  export const renderToReadableStream: never
}

declare module "react-server-dom-webpack/server" {
  // import type { Readable } from "stream"
  type Readable = unknown

  type Pathname = `/${string}`

  /** unique id for a loadable module like a {@link ChunkId} */
  type ModuleID = (number | string) & { __moduleId__?: void }

  /** unique id for a loadable dependency */
  type ChunkId = (string | number) & { __chunkId__?: void }

  /** loadable URL or partial URL for a chunk */
  type ChunkFilename = string & { __chunkFilename__?: void }

  /** name of something exported from a client module */
  type ClientModuleExportName = string & { __ClientModuleExportName__?: void }

  /** $$id attribute of a Client Reference or Server Reference */
  type ReactReference$$id = `${ModuleID}#${ClientModuleExportName}`

  type ReactClientManifestRecord = {
    id: ModuleID
    chunks: DependencyChunks
    name: ClientModuleExportName
  }
  type ReactClientManifestTuple = [
    id: ModuleID,
    chunks: DependencyChunks,
    name: ClientModuleExportName,
  ]

  type IReactClientManifest = Record<ReactReference$$id, ReactClientManifestRecord>

  type ChunkPair = [ChunkId, ChunkFilename]
  type ChunkPair2 = [...ChunkPair, ...ChunkPair]

  type DependencyChunks =
    | []
    | ChunkPair
    | ChunkPair2
    | [...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2]
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair] // prettier-ignore
    | [...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2, ...ChunkPair2] // prettier-ignore

  /**
   * A ClientReferenceManifestEntry is a map of client module IDs to their corresponding exports.
   */
  type ClientReferenceManifestEntry = {
    id: number | string
    // chunks is a double indexed array of chunkId / chunkFilename pairs
    chunks:
      | []
      | [chunkId: number | string, chunkFilename: string]
      | [chunkId: number | string, chunkFilename: string,
         chunkId: number | string, chunkFilename: string] // prettier-ignore
      | [chunkId: number | string, chunkFilename: string, ...Array<number | string>]
    name: string
  }

  type ModulePath = number | string
  type BundlerConfig = IReactClientManifest | Record<ModulePath, ClientReferenceManifestEntry> // Placeholder type for Bundler Config
  type ServerComponentResponse = any // Placeholder type for Server Component Response
  type ErrorHandler = (error: Error) => void
  type IdentifierPrefix = string
  type EnvironmentName = string
  type OnPostponeHandler = (reason?: any) => void
  type Model = any // Placeholder for model data type

  /**
   * Represents an action result.
   */
  type ActionResult = any // Placeholder for action result type

  /**
   * Represents a form data body.
   */
  type FormDataBody = any // Placeholder for form data body type

  /**
   * Decode action from a form data body.
   * @param body Form data body.
   * @param serverManifest Server manifest for module resolution.
   */
  export function decodeAction(
    body: FormDataBody,
    serverManifest: BundlerConfig,
  ): Promise<((...args: any[]) => any) | null>

  /**
   * Decodes form state and returns relevant information.
   * @param actionResult The result of the action.
   * @param body The body of the form.
   * @param serverManifest The server manifest.
   */
  export function decodeFormState(
    actionResult: ActionResult,
    body: FormDataBody,
    serverManifest: BundlerConfig,
  ): Promise<[ActionResult, string, string, number] | null>

  /**
   * Decodes a reply from a busboy stream.
   * @param busboyStream The busboy stream containing the form data.
   * @param webpackMap The webpack map for module resolution.
   */
  export function decodeReplyFromBusboy(
    busboyStream: Readable,
    webpackMap: BundlerConfig,
  ): Promise<ServerComponentResponse>

  /**
   * Decodes a reply from a form submission.
   * @param body The body of the form.
   * @param webpackMap The webpack map for module resolution.
   */
  export function decodeReply(
    body: FormDataBody,
    webpackMap: BundlerConfig,
  ): Promise<ServerComponentResponse>

  /**
   * Creates a proxy for a client module.
   * @param moduleId The module ID.
   */
  export function createClientModuleProxy(moduleId: string): any

  /**
   * Registers a client-side reference.
   * @param proxyImplementation The proxy implementation.
   * @param clientBundleId The ID of the module.
   * @param exportName The name of the export.
   */
  export function registerClientReference<T extends object>(
    proxyImplementation: T,
    clientBundleId: number | string,
    exportName: string,
  ): T & { $$typeof: symbol; $$id: ReactReference$$id; $$async: boolean }

  /**
   * Registers a server-side reference.
   * @param reference The reference.
   * @param id The ID of the module.
   * @param exportName The name of the export.
   */
  export function registerServerReference<T extends object>(
    reference: T,
    id: string,
    exportName: string | null,
  ): T & { $$typeof: symbol; $$id: ReactReference$$id; $$bound: null }

  /**
   * Options for rendering to a pipeable stream.
   */
  interface RenderToPipeableStreamOptions {
    onError?: ErrorHandler
    identifierPrefix?: IdentifierPrefix
    onPostpone?: OnPostponeHandler
    environmentName?: EnvironmentName
  }

  import type { PipeableStream } from "react-dom/server"

  /**
   * Renders a React component to a readable stream.
   * @param model The model to render.
   * @param webpackMap The webpack map for module resolution.
   * @param options Options for rendering.
   */
  export function renderToReadableStream(
    model: Model,
    webpackMap: BundlerConfig,
    options?: RenderToPipeableStreamOptions & { signal?: AbortSignal },
  ): ReadableStream

  /**
   * Renders a React component to a pipeable stream.
   * @param model The model to render.
   * @param webpackMap The webpack map for module resolution.
   * @param options Options for rendering.
   */
  export function renderToPipeableStream(
    model: Model,
    webpackMap: BundlerConfig,
    options?: RenderToPipeableStreamOptions,
  ): PipeableStream
}
