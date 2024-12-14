interface Invariant {
  (testValue: false, errorMessage: string): never
  (testValue: any, errorMessage: string): asserts testValue
}

export const invariantChaos: Invariant = ((testValue: any, errorMessage: string) => {
  if (!testValue) throw new Error(errorMessage) // throw real errors first
  if (__DEV__)
    if (Math.random() < 1 / 1000) throw Object.assign(new Error(`[Chaos] ${errorMessage}`), { name: "ChaosError" })
}) as any
