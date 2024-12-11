import type { ReactClientValue } from "@double-observer/react-server/src/ReactFlightServer"

export type ServerReference<T extends Function> = T & {
  $$typeof: symbol
  $$id: string
  $$bound: null | Array<ReactClientValue>
  $$location?: Error
}

// eslint-disable-next-line no-unused-vars
export type ClientReference<T> = {
  $$typeof: symbol
  $$id: string
}

export function isClientReference(reference: Object): boolean
export function isServerReference(reference: Object): boolean
export function registerClientReference<T>(proxyImplementation: any, id: string, exportName: string): ClientReference<T>
export function registerServerReference<T extends Function>(
  reference: T,
  id: string,
  exportName: string,
): ServerReference<T>
