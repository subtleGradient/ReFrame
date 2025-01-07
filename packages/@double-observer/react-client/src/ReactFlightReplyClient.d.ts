import { ServerReference } from "react-server-dom-webpack/server"
import { ReactCustomFormAction } from "../shared/ReactTypes"

type AnyFunction = (...args: any[]) => any

export type ServerReferenceId = number
export type ServerCallbackMap = { [id: ServerReferenceId]: (...args: any[]) => Promise<any> }

export type CallServerCallback = (id: ServerReferenceId, args: any[]) => Promise<unknown> | void

export type EncodeFormActionCallback = (id: ServerReferenceId, args: any[]) => ReactCustomFormAction | void

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

// Serializable values
export type ReactServerValue =
  // References are passed by their value
  | ServerReference<any>
  // The rest are passed as is. Sub-types can be passed in but lose their
  // subtype, so the receiver can only accept once of these.
  | string
  | boolean
  | number
  | null
  | void
  | bigint
  | AsyncIterable<ReactServerValue, ReactServerValue, void>
  | AsyncIterator<ReactServerValue, ReactServerValue, void>
  | Iterable<ReactServerValue>
  | Iterator<ReactServerValue>
  | Array<ReactServerValue>
  | Map<ReactServerValue, ReactServerValue>
  | Set<ReactServerValue>
  | FormData
  | Date
  | ReactServerObject
  | Promise<ReactServerValue> // Thenable<ReactServerValue>

type ReactServerObject = { [key: string]: ReactServerValue }
