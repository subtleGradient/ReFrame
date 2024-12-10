declare module "*/react-client-flight.production.js" {
  export * from "@double-observer/react-client/flight"
  export { default } from "@double-observer/react-client/flight"
}

declare module "*/react-client-flight.development.js" {
  export * from "@double-observer/react-client/flight"
  export { default } from "@double-observer/react-client/flight"
}

declare module "@double-observer/react-client/src/ReactFlightClientConfig" {
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

  type DependencyChunks = [] | ChunkPair | ChunkPair2 | [...ChunkPair2, ...ChunkPair]

  /**
   * Represents the loading status of a module and provides a method to load the module.
   */
  export type ModuleLoading = {
    /**
     * The current status of the module loading process.
     * - "idle": The module is not currently being loaded.
     * - "loading": The module is in the process of being loaded.
     * - "loaded": The module has been successfully loaded.
     * - "error": An error occurred while loading the module.
     */
    status: "idle" | "loading" | "loaded" | "error"

    /**
     * Loads a module in some environment-specific way.
     *
     * @param url - The URL of the module to load.
     * @param nonce - An optional nonce value for the script tag.
     * @param onload - A callback function to be called when the module is successfully loaded.
     * @param onerror - A callback function to be called if an error occurs while loading the module.
     *
     * @example
     * ```ts
     * const moduleLoading: ModuleLoading = {
     *   status: "idle",
     *   load: (url, nonce, onload, onerror) => {
     *     const script = document.createElement('script');
     *     script.src = url;
     *     if (nonce) {
     *       script.nonce = nonce;
     *     }
     *     script.onload = () => {
     *       moduleLoading.status = "loaded";
     *       onload();
     *     };
     *     script.onerror = () => {
     *       moduleLoading.status = "error";
     *       onerror();
     *     };
     *     document.head.appendChild(script);
     *   }
     * };
     * ```
     */
    load: (url: string, nonce: string | undefined, onload: () => void, onerror: () => void) => void
  }
  export type SSRModuleMap = { [key: string]: ClientReferenceMetadata }
  export type ServerManifest = { [key: string]: Array<string> }
  export type ServerReferenceId = number
  export type ClientReferenceMetadata = ReactClientManifestTuple
  export type ClientReference<T> = string & { __T?: T }

  export interface ReactFlightClientConfig {
    resolveClientReference: <T>(
      bundlerConfig: SSRModuleMap,
      metadata: ClientReferenceMetadata,
    ) => ClientReference<T>

    resolveServerReference: (
      bundlerConfig: SSRModuleMap,
      id: ServerReferenceId,
    ) => ClientReference<unknown>

    preloadModule: <T>(clientReference: ClientReference<T>) => Promise<void> | null
    requireModule: <T>(clientReference: ClientReference<T>) => T
    dispatchHint: (code: string, model: unknown) => void

    prepareDestinationForModule: (
      moduleLoading: ModuleLoading,
      nonce: string | undefined,
      metadata: ClientReferenceMetadata,
    ) => void

    createStringDecoder: () => TextDecoder
    readPartialStringChunk: (decoder: TextDecoder, buffer: Uint8Array) => string
    readFinalStringChunk: (decoder: TextDecoder, buffer: Uint8Array) => string

    bindToConsole: (
      methodName: keyof typeof console | string,
      args: Array<any>,
      env: "Server" | "Client" | string,
    ) => () => void

    rendererPackageName: string
    rendererVersion: string
  }
}

declare module "@double-observer/react-client/src/ReactFlightReplyClient" {
  import type { ReactCustomFormAction } from "shared/ReactTypes"

  export type CallServerCallback = <A, T>(id: ServerReferenceId, args: A) => Promise<T>

  export type EncodeFormActionCallback = <A>(
    id: ServerReferenceId,
    args: Promise<A>,
  ) => ReactCustomFormAction

  export type ServerReferenceId = number

  export function registerServerReference(
    proxy: any,
    reference: { id: ServerReferenceId; bound: null | Promise<Array<any>> },
    encodeFormAction: EncodeFormActionCallback | void,
  ): void

  export function createServerReference<A extends Iterable<any>, T>(
    id: ServerReferenceId,
    callServer: CallServerCallback,
    encodeFormAction?: EncodeFormActionCallback,
  ): (...args: A & Partial<Array<T>>) => Promise<T>
}

declare module "@double-observer/react-client/src/ReactFlightTemporaryReferences" {
  export type TemporaryReferenceSet = Map<string, unknown | symbol>

  export function createTemporaryReferenceSet(): TemporaryReferenceSet

  export function writeTemporaryReference(
    set: TemporaryReferenceSet,
    reference: string,
    object: unknown | symbol,
  ): void

  export function readTemporaryReference<T>(set: TemporaryReferenceSet, reference: string): T
}

declare module "shared/ReactTypes" {
  export type ReactNode =
    | ReactElement
    | ReactPortal
    | ReactText
    | ReactFragment
    | ReactProvider<any>
    | ReactConsumer<any>

  export type ReactEmpty = null | void | boolean

  export type ReactFragment = ReactEmpty | Iterable<ReactNode>

  export type ReactNodeList = ReactEmpty | ReactNode

  export type ReactText = string | number

  export type ReactProvider<T> = {
    $$typeof: symbol | number
    type: ReactContext<T>
    key: null | string
    ref: null
    props: {
      value: T
      children?: ReactNodeList
    }
  }

  export type ReactConsumerType<T> = {
    $$typeof: symbol | number
    _context: ReactContext<T>
  }

  export type ReactConsumer<T> = {
    $$typeof: symbol | number
    type: ReactConsumerType<T>
    key: null | string
    ref: null
    props: {
      children: (value: T) => ReactNodeList
    }
  }

  export type ReactContext<T> = {
    $$typeof: symbol | number
    Consumer: ReactConsumerType<T>
    Provider: ReactContext<T>
    _currentValue: T
    _currentValue2: T
    _threadCount: number
    // DEV only
    _currentRenderer?: { [key: string]: any } | null
    _currentRenderer2?: { [key: string]: any } | null
    // This value may be added by application code
    // to improve DEV tooling display names
    displayName?: string
  }

  export type ReactPortal = {
    $$typeof: symbol | number
    key: null | string
    containerInfo: any
    children: ReactNodeList
    // TODO: figure out the API for cross-renderer implementation.
    implementation: any
  }

  export type RefObject = {
    current: any
  }

  export type ReactScope = {
    $$typeof: symbol | number
  }

  export type ReactScopeQuery = (
    type: string,
    props: { [key: string]: unknown },
    instance: unknown,
  ) => boolean

  export type ReactScopeInstance = {
    DO_NOT_USE_queryAllNodes(theReactScopeQuery: ReactScopeQuery): null | Array<object>
    DO_NOT_USE_queryFirstNode(theReactScopeQuery: ReactScopeQuery): null | object
    containsNode(theobject: object): boolean
    getChildContextValues: <T>(context: ReactContext<T>) => Array<T>
  }

  // The subset of a Thenable required by things thrown by Suspense.
  // This doesn't require a value to be passed to either handler.
  export interface Wakeable {
    then(onFulfill: () => unknown, onReject: () => unknown): void | Wakeable
  }

  // The subset of a Promise that React APIs rely on. This resolves a value.
  // This doesn't require a return value neither from the handler nor the
  // then function.
  interface ThenableImpl<T> {
    then(onFulfill: (value: T) => unknown, onReject: (error: unknown) => unknown): void | Wakeable
  }
  interface UntrackedThenable<T> extends ThenableImpl<T> {
    status?: void
    _debugInfo?: null | ReactDebugInfo
  }

  export interface PendingThenable<T> extends ThenableImpl<T> {
    status: "pending"
    _debugInfo?: null | ReactDebugInfo
  }

  export interface FulfilledThenable<T> extends ThenableImpl<T> {
    status: "fulfilled"
    value: T
    _debugInfo?: null | ReactDebugInfo
  }

  export interface RejectedThenable<T> extends ThenableImpl<T> {
    status: "rejected"
    reason: unknown
    _debugInfo?: null | ReactDebugInfo
  }

  export type Thenable<T> =
    | UntrackedThenable<T>
    | PendingThenable<T>
    | FulfilledThenable<T>
    | RejectedThenable<T>

  export type OffscreenMode = "hidden" | "unstable-defer-without-hiding" | "visible" | "manual"

  export type StartTransitionOptions = {
    name?: string
  }

  export type Usable<T> = Thenable<T> | ReactContext<T>

  export type ReactCustomFormAction = {
    name?: string
    action?: string
    encType?: string
    method?: string
    target?: string
    data?: null | FormData
  }

  // This is an opaque type returned by decodeFormState on the server, but it's
  // defined in this shared file because the same type is used by React on
  // the client.
  export type ReactFormState<S, ReferenceId> = [
    S /* actual state value */,
    string /* key path */,
    ReferenceId /* Server Reference ID */,
    number /* number of bound arguments */,
  ]

  export type ReactComponentInfo = {
    name?: string
    env?: string
    owner?: null | ReactComponentInfo
    stack?: null | string
    task?: null | ConsoleTask
  }

  export type ReactAsyncInfo = {
    started?: number
    completed?: number
    stack?: string
  }

  export type ReactDebugInfo = Array<ReactComponentInfo | ReactAsyncInfo>

  export type ReactElement = {
    $$typeof: symbol | number
    type: any
    key: any
    ref: any
    props: any
    // ReactFiber
    _owner: any
    // __DEV__
    _store: { validated: 0 | 1 | 2 } & { [key: string]: unknown } // 0: not validated, 1: validated, 2: force fail
    _debugInfo?: null | ReactDebugInfo
    _debugStack?: Error
    _debugTask?: null | ConsoleTask
  }

  interface ConsoleTask {
    run<T>(callback: () => T): T
  }
}
