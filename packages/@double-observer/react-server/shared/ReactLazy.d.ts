import { ReactDebugInfo } from "./ReactTypes"

export type LazyComponent<T, P> = {
  $$typeof: symbol | number
  _payload: P
  _init: (payload: P) => T
  _debugInfo?: null | ReactDebugInfo
}
