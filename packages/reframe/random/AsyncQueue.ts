export class AsyncQueue<T> {
  private controller!: ReadableStreamDefaultController<T>
  private stream: ReadableStream<T>
  private reader: ReadableStreamDefaultReader<T>
  private isClosed = false

  constructor(signal?: AbortSignal) {
    this.stream = new ReadableStream<T>({
      start: (controller) => {
        this.controller = controller

        if (signal?.aborted) {
          this.close()
        } else if (signal) {
          signal.addEventListener("abort", () => this.close(), { once: true })
        }
      },
      cancel: () => {
        this.isClosed = true
      },
    })

    this.reader = this.stream.getReader()
  }

  push(value: T | Promise<T>): void {
    if (this.isClosed) {
      throw new Error("Cannot push to closed queue")
    }

    if (isPromiseLike(value)) {
      value
        .then((resolved) => {
          this.controller.enqueue(resolved)
        })
        .catch((err) => {
          this.controller.error(err)
        })
    } else {
      this.controller.enqueue(value)
    }
  }

  close(): void {
    if (this.isClosed) return
    this.isClosed = true
    this.controller.close()
  }

  async next(): Promise<IteratorResult<T>> {
    return (await this.reader.read()) as IteratorResult<T>
  }

  return(): Promise<IteratorResult<T>> {
    this.close()
    return Promise.resolve({ value: undefined, done: true })
  }

  throw(error?: any): Promise<IteratorResult<T>> {
    this.controller.error(error)
    return Promise.reject(error)
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this
  }
}

type PromiseLike<T> = {
  then(onfulfilled?: ((value: T) => unknown) | null, onrejected?: ((reason: any) => unknown) | null): unknown
}

export function isPromiseLike<T = unknown, P extends PromiseLike<T> = PromiseLike<T>>(thing: unknown): thing is P {
  return typeof thing === "object" && thing !== null && "then" in thing && typeof thing.then === "function"
}
