export type TemporaryReferenceSet = Map<string, unknown | symbol>

export function createTemporaryReferenceSet(): TemporaryReferenceSet

export function writeTemporaryReference(set: TemporaryReferenceSet, reference: string, object: unknown | symbol): void

export function readTemporaryReference<T>(set: TemporaryReferenceSet, reference: string): T
