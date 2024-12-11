import { ReactCustomFormAction } from "../shared/ReactTypes"

type AnyFunction = (...args: any[]) => any

export type ServerReferenceId = number
export type ServerCallbackMap = { [id: ServerReferenceId]: (...args: any[]) => Promise<any> }

export type CallServerCallback = (
  id: ServerReferenceId,
  args: any[],
) => Promise<unknown> & ReturnType<F>

export type EncodeFormActionCallback = (id: ServerReferenceId, args: any[]) => ReactCustomFormAction

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
