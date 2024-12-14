
export type ServerReference<T> = T & {
  $$typeof: Symbol | number
  $$id: string
  $$bound: null | Thenable<Array<any>>
  /** For functions, its name. Optional */
  name?: string
  /** DEV-only for stack traces */
  location?: string
  /** DEV-only for environment name */
  env?: string
}
// export type ServerReference<T extends Function> = T & {
//   $$typeof: symbol
//   $$id: string
//   $$bound: null | Array<ReactClientValue>
//   $$location?: Error
// }

export type ClientReference<T> = T & {
  $$typeof: symbol
  $$id: string
}

export function isClientReference(reference: Object): boolean
export function isServerReference(reference: Object): boolean
export function registerClientReference<T>(proxyImplementation: T, id: string, exportName: string): ClientReference<T>
export function registerServerReference<in out T extends Function>(
  reference: T,
  id: string,
  exportName: string,
): ServerReference<T>
