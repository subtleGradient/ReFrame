import { MaybePromise, YieldValue } from "./types"

interface AsyncForEach<I extends AsyncIterable<any>> {
  (item: YieldValue<I>, index: number, items: I): MaybePromise<unknown>
}

export async function AsyncIterable$forEach<I extends AsyncIterable<any>>(
  them: I,
  forEach: AsyncForEach<I>,
  signal?: AbortSignal,
) {
  let index = -1
  try {
    signal?.throwIfAborted()
    for await (const item of them) {
      signal?.throwIfAborted()
      await forEach(item, index++, them)
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return
    throw error
  }
}
