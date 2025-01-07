/** unique id for a loadable module like a {@link ChunkId} */
type ModuleID = number | string //& { __moduleId__?: void }

/** unique id for a loadable dependency */
type ChunkId = string | number //& { __chunkId__?: void }

/** loadable URL or partial URL for a chunk */
type ChunkFilename = string //& { __chunkFilename__?: void }

/** name of something exported from a client module */
type ClientModuleExportName = string //& { __ClientModuleExportName__?: void }

/** $$id attribute of a Client Reference or Server Reference */
type ReactReference$$id = `${ModuleID}#${ClientModuleExportName}`
type ServerReferenceId = number

export type ReactClientManifestRecord = {
  id: ModuleID
  dependencies: DependencyChunks
  name: ClientModuleExportName
}
type ReactClientManifestTuple = [id: ModuleID, dependencies: DependencyChunks, name: ClientModuleExportName]

type IReactClientManifest = Record<ReactReference$$id, ReactClientManifestRecord>

type ChunkPair = [ChunkId, ChunkFilename]
type ChunkPair2 = [...ChunkPair, ...ChunkPair]

type DependencyChunks = [] | ChunkPair | ChunkPair2 | [...ChunkPair2, ...ChunkPair]

/**
 * Represents the loading status of a module and provides a method to load the module.
 */
export type ModuleLoading = {
  /**
   * The current status of the module loading process.
   * - "idle": The module is not currently being loaded.
   * - "loading": The module is in the process of being loaded.
   * - "loaded": The module has been successfully loaded.
   * - "error": An error occurred while loading the module.
   */
  status: "idle" | "loading" | "loaded" | "error"

  /**
   * Loads a module in some environment-specific way.
   *
   * @param url - The URL of the module to load.
   * @param nonce - An optional nonce value for the script tag.
   * @param onload - A callback function to be called when the module is successfully loaded.
   * @param onerror - A callback function to be called if an error occurs while loading the module.
   *
   * @example
   * ```ts
   * const moduleLoading: ModuleLoading = {
   *   status: "idle",
   *   load: (url, nonce, onload, onerror) => {
   *     const script = document.createElement('script');
   *     script.src = url;
   *     if (nonce) {
   *       script.nonce = nonce;
   *     }
   *     script.onload = () => {
   *       moduleLoading.status = "loaded";
   *       onload();
   *     };
   *     script.onerror = () => {
   *       moduleLoading.status = "error";
   *       onerror();
   *     };
   *     document.head.appendChild(script);
   *   }
   * };
   * ```
   */
  load: (url: string, nonce: string | undefined, onload: () => void, onerror: () => void) => void
}
export type ServerManifest = { [key: string]: Array<string> }

export type SSRModuleMap = Record<ServerReferenceId | ReactReference$$id, ReactClientManifestTuple>

export interface ReactFlightClientConfig<
  in BundlerConfig extends SSRModuleMap = SSRModuleMap,
  in Metadata extends ReactClientManifestTuple = ReactClientManifestTuple,
  in ServerRefId extends keyof BundlerConfig & ServerReferenceId = keyof BundlerConfig & ServerReferenceId,
  in out ClientRefKey extends keyof BundlerConfig & ReactReference$$id = keyof BundlerConfig & ReactReference$$id,
> {
  rendererPackageName: string
  rendererVersion: string

  resolveClientReference(bundlerConfig: BundlerConfig, metadata: Metadata): ClientRefKey
  resolveServerReference(bundlerConfig: BundlerConfig, id: ServerRefId): ClientRefKey

  preloadModule(clientReference: ClientRefKey): Promise<void> | null
  requireModule<T>(clientReference: ClientRefKey): T
  dispatchHint(code: string, model: unknown): void

  prepareDestinationForModule(moduleLoading: ModuleLoading, nonce: string | undefined, metadata: Metadata): void

  createStringDecoder(): TextDecoder
  readPartialStringChunk(decoder: TextDecoder, buffer: Uint8Array): string
  readFinalStringChunk(decoder: TextDecoder, buffer: Uint8Array): string

  bindToConsole(
    methodName: keyof typeof console | string,
    args: Array<any>,
    env: "Server" | "Client" | string,
  ): () => void
}
