type MaybePromise<T> = T | Promise<T>

function Await({ children: promisedNode }: { children: MaybePromise<ReactNode> }) {
  return isPromiseLike(promisedNode) ? use(promisedNode) : promisedNode
}

type KnownPaths = unknown

interface ReFrameProps {
  src: KnownPaths

  /** the server will use Cache-Control to define when to show stale values and stuff */
  refresh: "on every render"
}

export function ReFrameSafe({ fallback, ...props }: ReFrameProps & { fallback: ReactNode }) {
  return (
    <RootUnexpectedErrorBoundary>
      <Suspense fallback={fallback}>
        <ReFrame {...props} />
      </Suspense>
    </RootUnexpectedErrorBoundary>
  )
}

export function ReFrame(props: ReFrameProps) {
  if (__DEV__) {
    try {
      // restarts the server every time the server is started
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { startedAt } = (require("#server-status-dev.json").default ?? { startedAt: Date.now() }) as {
        startedAt: EpochTimeStamp
      }
      console.info("Server started at", new Date(startedAt).toISOString())
    } catch (error) {
      console.warn("Server is not running?", error)
    }
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  if (timeoutRef.current) clearTimeout(timeoutRef.current)
  useEffect(() => () => void (timeoutRef.current && clearTimeout(timeoutRef.current)), [])

  const [isStreaming, setStreaming] = useState(false)
  const [renderId, forceRerender] = useState(0)
  const lastRenderAtRef = useRef(-1)
  lastRenderAtRef.current = Date.now()
  return (
    <ReFrameContext.Provider
      value={useMemo(
        () => ({
          lastRenderAtRef,
          refreshAt(timestamp) {
            if (lastRenderAtRef.current >= timestamp) return
            const delay = Math.max(0, timestamp - Date.now())
            const timeout = setTimeout(() => {
              if (lastRenderAtRef.current >= timestamp) return
              forceRerender((lastRenderId) => {
                if (lastRenderAtRef.current >= timestamp) return lastRenderId
                return lastRenderId + 1
              })
            }, delay)
            return () => void clearTimeout(timeout)
          },
        }),
        [isStreaming],
      )}
    >
      <ReFrameStreamingContext.Provider value={{ isStreaming }}>
        <ReFrame_fetch key={renderId} setStreaming={setStreaming} {...props} />
      </ReFrameStreamingContext.Provider>
    </ReFrameContext.Provider>
  )
}

const ReFrameStreamingContext = createContext({ isStreaming: false })

const ReFrameContext = createContext({
  lastRenderAtRef: { current: -1 },
  refreshAt(timestamp: EpochTimeStamp): void | (() => void) {
    throw new Error("Need to provide the ReFrameContext")
  },
})

function ReFrame_fetch({
  src,
  setStreaming,
}: ReFrameProps & {
  setStreaming: (isStreaming: boolean) => void
}) {
  const [rscPromise, streamControl] = useMemo(() => {
    const url = `${getApiUrl()}${src}`
    const streamControl = new AbortController()
    const rscFetchPromise = fetchRSC(url, { signal: streamControl.signal })

    rscFetchPromise.then(([response]) => {
      if (response.ok) setStreaming(true)
      response.addListener("didComplete", () => {
        setStreaming(false)
      })
    })

    if (__DEV__)
      rscFetchPromise.then(
        (it) => {}, //console.log(ReFrame_fetch.name, src, it),
        (error) => console.warn(ReFrame_fetch.name, src, error),
      )
    return [rscFetchPromise.then(([, rsc]) => rsc), streamControl] as const
  }, [src])

  useEffect(() => () => void streamControl.abort(), [])

  return <Await>{rscPromise}</Await>
}

export function ReFrame_refreshAt({ timestamp }: { timestamp: EpochTimeStamp }) {
  const { refreshAt } = useContext(ReFrameContext)
  useEffect(() => refreshAt(timestamp), [refreshAt, timestamp])
  return <TimeDiff time={new Date(timestamp)}>Will refresh </TimeDiff>
}

/**
 * Render children only while the ReFrame stream is active
 * When the stream is closed, the children will be unmounted and the fallback will be rendered instead
 */
export function ReFrameStreaming({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { isStreaming } = useContext(ReFrameStreamingContext)
  return isStreaming ? children : fallback
}

function getAuthHeaders() {
  const session = userSessionStore.get()
  return {
    Authorization: session.authToken ? `Bearer ${session.authToken}` : "",
    ...(__DEV__ ?
      {
        "ngrok-skip-browser-warning": "true",
        "x-frens-session": JSON.stringify(session),
      }
    : null),
  }
}

type expoFetchResponse = Awaited<ReturnType<typeof expoFetch.fetch>>

async function fetchRSC(
  src: string | URL,
  init?: expoFetch.FetchRequestInit,
): Promise<[expoFetchResponse, Promise<ReactNode>]> {
  const isLegit = String(src).startsWith(getApiUrl())
  const response = await expoFetch.fetch(src.toString(), {
    method: "GET",
    ...init,
    headers: {
      ...init?.headers,
      Accept: "text/x-component, text/event-stream",
      "Frens-ReFrame-ReactServerDOMClient": JSON.stringify([ReactServerDOMClient.name, ReactServerDOMClient.version]),
      ...(isLegit ? getAuthHeaders() : null),
    },
  })
  invariantChaos(response.ok, response.ok ? "ok" : `fetch failed with status ${response.status} ${response.statusText}`)
  const { body } = response
  invariantChaos(body, `fetch response body is null`)

  response.addListener("didComplete", () => {
    console.error(src, "didComplete", response.status, response.statusText)
  })

  const ui = ReactServerDOMClient.from<ReactNode>(body, {
    onClose() {
      console.error(src, "ReactServerDOMClient.from", "onClose", response.status, response.statusText)
    },
  })

  return [response, ui] as const
}

interface Invariant {
  (testValue: false, errorMessage: string): never
  (testValue: any, errorMessage: string): asserts testValue
}

const invariantChaos: Invariant = ((testValue: any, errorMessage: string) => {
  if (!testValue) throw new Error(errorMessage) // throw real errors first
  if (__DEV__)
    if (Math.random() < 1 / 1000) throw Object.assign(new Error(`[Chaos] ${errorMessage}`), { name: "ChaosError" })
}) as any
