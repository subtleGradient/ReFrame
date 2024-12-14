import {
  ClientManifest,
  ClientReference,
  ClientReferenceKey,
  ClientReferenceMetadata,
  ServerReference,
  ServerReferenceId,
} from "../shared"
import { ReactNode } from "../shared/ReactTypes"

/**
 * Configuration for React's server-side rendering (SSR) using the Flight protocol.
 * This interface defines methods and properties necessary for managing the rendering
 * process, handling client/server references, and managing resources.
 *
 * The React Flight protocol enables sending serialized values from the server to the client,
 * including function references (Client References and Server References) and data structures.
 * It also handles streaming, suspense, and error handling.
 *
 * Implementations of this interface should provide concrete logic for each method,
 * tailored to the specific bundler or runtime environment.
 */
export default interface ReactFlightServerConfig<Destination, Chunk, PrecomputedChunk> {
  /**
   * Schedules work to be performed. This might involve scheduling a task on an event loop,
   * pushing a task to a queue, or other similar mechanisms. The specific implementation
   * depends on the runtime environment.
   */
  scheduleWork: (callback: () => void) => void

  /**
   * Schedules a microtask to be performed. Microtasks are typically executed before the next
   * rendering frame, making them suitable for high-priority work.
   */
  scheduleMicrotask: (callback: () => void) => void

  /**
   * Initiates the writing process to the provided destination. This might involve setting up
   * buffers, establishing connections, or other preparatory steps.
   */
  beginWriting: (destination: Destination) => void

  /**
   * Writes a chunk of data to the destination. Implementations should handle chunk buffering
   * and encoding as needed.
   */
  writeChunk: (destination: Destination, chunk: Chunk) => void

  /**
   * Writes a chunk of data to the destination and returns a boolean indicating whether the
   * destination is still accepting data. This allows for backpressure handling.
   */
  writeChunkAndReturn: (destination: Destination, chunk: Chunk | PrecomputedChunk) => boolean

  /**
   * Completes the writing process to the destination. This might involve flushing buffers,
   * closing connections, or other finalization steps.
   */
  completeWriting: (destination: Destination) => void

  /**
   * Flushes any buffered data to the destination. This is typically used to ensure that
   * all data written so far is sent to the client.
   */
  flushBuffered: (destination: Destination) => void

  /**
   * Closes the destination, indicating that no more data will be written.
   */
  close: (destination: Destination) => void

  /**
   * Closes the destination and signals an error condition.
   */
  closeWithError: (destination: Destination, error: unknown) => void

  /**
   * Converts a string to a Chunk suitable for writing to a destination.
   */
  stringToChunk: (content: string) => Chunk

  /**
   * Converts a string to a PrecomputedChunk. Precomputed chunks might be used for
   * static content that can be pre-encoded.
   */
  stringToPrecomputedChunk: (content: string) => PrecomputedChunk

  /**
   * Converts a TypedArray to a BinaryChunk. Binary chunks are used for sending binary data.
   */
  typedArrayToBinaryChunk: (content: ArrayBufferView) => Chunk

  /**
   * Returns the byte length of a given Chunk.
   */
  byteLengthOfChunk: (chunk: Chunk) => number

  /**
   * Returns the byte length of a given BinaryChunk.
   */
  byteLengthOfBinaryChunk: (chunk: Chunk) => number

  /**
   * Creates a fast hash from a string input.
   */
  createFastHash: (input: string) => string | number

  /**
   * Determines whether a given value is a Client Reference. Client References are functions
   * that can be invoked on the client.
   */
  isClientReference: (reference: any) => reference is ClientReference<any>

  /**
   * Determines whether a given value is a Server Reference. Server References are functions
   * that can be invoked on the server from the client.
   */
  isServerReference: (reference: any) => reference is ServerReference<any>

  /**
   * Returns a unique key for a given Client Reference.
   */
  getClientReferenceKey: (reference: ClientReference<any>) => ClientReferenceKey

  /**
   * Resolves the metadata associated with a Client Reference. This metadata typically
   * describes how to load the corresponding module on the client.
   */
  resolveClientReferenceMetadata: <T>(
    config: ClientManifest,
    clientReference: ClientReference<T>,
  ) => ClientReferenceMetadata

  /**
   * Returns a unique identifier for a given Server Reference.
   */
  getServerReferenceId: <T>(config: ClientManifest, serverReference: ServerReference<T>) => ServerReferenceId

  /**
   * Returns the bound arguments for a Server Reference, if any. These arguments are
   * serialized and sent to the server along with the reference ID when the function
   * is invoked.
   */
  getServerReferenceBoundArguments: <T>(
    config: ClientManifest,
    serverReference: ServerReference<T>,
  ) => Promise<Array<ReactNode>> | null

  /**
   * Returns the location of a server function. This is used for error reporting.
   */
  getServerReferenceLocation: <T>(
    config: ClientManifest,
    serverReference: ServerReference<T>,
  ) => ServerReferenceLocation | null
}

export type ServerReferenceLocation = {
  location?: {
    url: string
    line: number
    column: number
  }
}
