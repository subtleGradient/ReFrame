export type ReactNode = ReactElement | ReactPortal | ReactText | ReactFragment | ReactProvider<any> | ReactConsumer<any>

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
  /** @private */ _context: ReactContext<T>
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
  /** @private */ _currentValue: T
  /** @private */ _currentValue2: T
  /** @private */ _threadCount: number
  // DEV only
  /** @private */ _currentRenderer?: { [key: string]: any } | null
  /** @private */ _currentRenderer2?: { [key: string]: any } | null
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

export type ReactScopeQuery = (type: string, props: { [key: string]: unknown }, instance: unknown) => boolean

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
  /** @private */ _debugInfo?: null | ReactDebugInfo
}

export interface PendingThenable<T> extends ThenableImpl<T> {
  status: "pending"
  /** @private */ _debugInfo?: null | ReactDebugInfo
}

export interface FulfilledThenable<T> extends ThenableImpl<T> {
  status: "fulfilled"
  value: T
  /** @private */ _debugInfo?: null | ReactDebugInfo
}

export interface RejectedThenable<T> extends ThenableImpl<T> {
  status: "rejected"
  reason: unknown
  /** @private */ _debugInfo?: null | ReactDebugInfo
}

export type Thenable<T> = UntrackedThenable<T> | PendingThenable<T> | FulfilledThenable<T> | RejectedThenable<T>

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

/**
 * This is an opaque type returned by decodeFormState on the server, but it's
 * defined in this shared file because the same type is used by React on
 * the client.
 * @returns {[S, string, ReferenceId, number]} A tuple containing:
 *          - state - The actual state value
 *          - keyPath - The key path string
 *          - serverRefId - The Server Reference ID
 *          - boundArgCount - The number of bound arguments
 */
export type ReactFormState<S, ReferenceId> = [
  state: S,
  keyPath: string,
  serverRefId: ReferenceId,
  boundArgCount: number,
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
  /** ReactFiber
   * @private
   */
  _owner: any

  /**
   * __DEV__
   * @private
   * @description validated: 0 = not validated, 1 = validated, 2 = force fail
   */
  _store: { validated: 0 | 1 | 2 } & { [key: string]: unknown }

  /** @private */ _debugInfo?: null | ReactDebugInfo
  /** @private */ _debugStack?: Error
  /** @private */ _debugTask?: null | ConsoleTask
}

interface ConsoleTask {
  run<T>(callback: () => T): T
}
