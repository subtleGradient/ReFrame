import ReactFlightServerConfig from "./src/ReactFlightServerConfig"
import { ReactFormState, ReactNode } from "./shared/ReactTypes"
import { ClientManifest, Options } from "./shared"

export default class ReactFlightServer<
  Destination,
  Chunk,
  PrecomputedChunk,
  C extends ReactFlightServerConfig<Destination, Chunk, PrecomputedChunk>,
> {
  constructor(config: C)

  abort(request: Request, reason: any): void

  createPrerenderRequest(
    model: ReactNode,
    clientManifest: ClientManifest,
    options?: Options,
  ): Request

  createRequest(model: ReactNode, clientManifest: ClientManifest, options?: Options): Request

  flushResources(request: Request): void

  getFormState<S, T>(request: Request): ReactFormState<S, T> | null

  getPostponedState(request: Request): null | PostponedState

  getRenderState(request: Request): any // Should be defined as RenderState

  getResumableState(request: Request): any // Should be defined as ResumableState

  performWork(request: Request): void

  prepareForStartFlowingIfBeforeAllReady(request: Request): void

  resolveClassComponentProps(Component: any, baseProps: Object): Object

  resolveRequest(): Request | null

  resumeAndPrerenderRequest(
    children: ReactNode,
    postponedState: PostponedState,
    renderState: any, // Should be defined as RenderState
    onError: (error: unknown) => string | undefined | null,
    onAllReady: () => void,
    onShellReady: () => void,
    onShellError: (error: unknown) => void,
    onFatalError: (error: unknown) => void,
    onPostpone: (reason: string) => void,
  ): Request

  resumeRequest(
    children: ReactNode,
    postponedState: PostponedState,
    renderState: RenderState,
    onError: (error: unknown) => string | undefined | null,
    onAllReady: () => void,
    onShellReady: () => void,
    onShellError: (error: unknown) => void,
    onFatalError: (error: unknown) => void,
    onPostpone: (reason: string) => void,
  ): Request

  startFlowing(request: Request, destination: Destination): void

  startWork(request: Request): void

  stopFlowing(request: Request): void
}

type RenderState = unknown
type PostponedState = unknown
