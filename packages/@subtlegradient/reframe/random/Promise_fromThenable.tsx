import type { Thenable } from "@double-observer/react-client/shared/ReactTypes"

export function Promise_fromThenable<T>(thenable: Thenable<T>): Promise<T> {
  if (thenable instanceof Promise) return thenable
  if ("promise" in thenable && thenable.promise instanceof Promise) return thenable.promise
  return ((thenable as any).promise = new Promise<T>((resolve, reject) => thenable.then(resolve, reject)))
}
