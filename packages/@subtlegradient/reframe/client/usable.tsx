import invariant from "invariant"
import React, { ReactNode } from "react"

const __DEV__ = (global as any).__DEV__ as undefined | boolean

interface ThenableImpl<T> {
  then(onFulfill: (value: T) => unknown, onReject: (error: unknown) => unknown): void | PromiseLike<unknown>
}

interface MutableThenable<T> extends ThenableImpl<T> {
  status?: void | "pending" | "fulfilled" | "rejected"
  value?: T
  reason?: unknown
}

interface UntrackedThenable<T> extends ThenableImpl<T> {
  status?: void
}

interface PendingThenable<T> extends ThenableImpl<T> {
  status: "pending"
}

interface FulfilledThenable<T> extends ThenableImpl<T> {
  readonly status: "fulfilled"
  readonly value: T
}

interface RejectedThenable<T> extends ThenableImpl<T> {
  readonly status: "rejected"
  readonly reason: unknown
}

type Thenable<T> = Promise<T> | UntrackedThenable<T> | PendingThenable<T> | FulfilledThenable<T> | RejectedThenable<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoThenable<T> = T extends Thenable<any> ? never : T

const maxUseCallCount_warn = 150
const maxUseCallCount_error = 1000
/**
 * Temporary implementation of {@link React.use} for React 18.2.
 * It will be deprecated when React 19 is released.
 *
 * @example
 * ```tsx
 * function SomeDataView({ someData: someDataPromise }: { someData: SomeData | Promise<SomeData> }) {
 *   const someData = isPromiseLike(someDataPromise) ? React.use(someDataPromise) : someDataPromise
 *   return <div>{someData.name}</div>
 * }
 *
 * function SomeRandomComponent2() {
 *   return <>
 *     <ErrorBoundary>
 *       <SomeDataView someData={{ name:"fred" }} />
 *
 *       <React.Suspense fallback={<div>Loading...</div>}>
 *         <SomeDataView someData={React.useMemo(() => fetch(url).then(r => r.json()), [url])} />
 *       </React.Suspense>
 *     </ErrorBoundary>
 *   </>
 * }
 * ```
 */
export function use<T>(promise: MutableThenable<T>): T {
  if (!isPromiseLike(promise)) throw new Error("use() called with a non-promise. That is not supported.")

  if ("use" in React && typeof React.use === "function" && React.use !== use) {
    if (__DEV__) console.warn("Our `use` polyfill is deprecated in React 19. Use `React.use` instead.")
    invariant("use" in React && typeof React.use === "function" && React.use !== use, "React.use is missing")
    try {
      return React.use(promise as PromiseLike<T>) as unknown as T
    } catch (error) {
      if (__DEV__) console.error("React.use failed", error)
    }
  }

  if (promise.status == null) {
    promise.status = "pending"
    promise.then(
      (result) => {
        promise.status = "fulfilled"
        promise.value = result
      },
      (reason) => {
        promise.status = "rejected"
        promise.reason = reason
      },
    )
    return use(promise)
  }

  if (promise.status === "fulfilled") return promise.value!
  if (promise.status === "rejected") throw promise.reason!
  if (promise.status === "pending") throw promise

  // ReactPromise
  if (promise.status === "resolved_model" || promise.status === "resolved_module") {
    console.warn("use() called with a ReactPromise. This may not work")
    throw promise
  }

  throw new Error(`Invalid promise status: ${promise.status}`)
}

export function isPromiseLike<T = unknown, P extends ThenableImpl<T> = ThenableImpl<T>>(thing: unknown): thing is P {
  return typeof thing === "object" && thing !== null && "then" in thing && typeof thing.then === "function"
}

type MaybeThenable<T> = T | Thenable<T>

/**
 * Returns the resolved value of a promise or the original value if it's not a promise.
 *
 * @template T - The type of the value.
 * @param {T | Thenable<T>} value - The value or promise-like object.
 * @returns {T} - The resolved value.
 */
export function useMaybePromise<T>(value: T | Thenable<T>): T {
  if (isPromiseLike(value)) return use(value)
  else return value
}
//  function getUsableValue<T>(value: T | Thenable<T>): T | undefined {
//   if (isPromiseLike(value)) return undefined
//   else return value
// }
//  function getUsablePromise<T>(value: T | Promise<T>): Promise<T> {
//   if (isPromiseLike(value)) return value
//   else return Promise.resolve(value)
// }

/**
 * Use is a react component that renders a promised ReactNode
 *
 * @example
 * ```tsx
 * <Suspense fallback={<Text>Loading...</Text>}>
 *   <Use>{promisedValue
 *     .then(resolvedValue => <Text>{resolvedValue}</Text>)
 *     .catch(error => <Text>{error.toString()}</Text>)
 *   }</Use>
 * </Suspense>
 * ```
 */
export function Use({ children }: { children: MaybePromise<ReactNode> }): any {
  console.warn(React.version)
  return useMaybePromise(children)
}

type MaybePromise<T> = T | Promise<T> | Thenable<T>
