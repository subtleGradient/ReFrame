export type MaybePromise<T> = T | Promise<T>
export type YieldValue<T> = T extends AsyncIterable<infer U> ? U : never
