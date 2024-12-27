import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { CallServerCallback, ServerCallbackMap } from "@double-observer/react-client/src/ReactFlightReplyClient"
import { ReFrameClient, renderDynamicClientModule, Use } from "@subtlegradient/reframe/client"
import { RSCSource } from "@subtlegradient/reframe/random/types"
import { ErrorBoundaryProps } from "expo-router"
import { Try } from "expo-router/build/views/Try"
import React, { ReactNode, Suspense } from "react"
import { Button, ScrollView, Text } from "react-native"
import pkg from "../../package.json"

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>Something went wrong: {error?.message ?? "unknown error"}</ThemedText>
      <Button title="Try Again" onPress={retry} />
      <ThemedText>{new Date().toLocaleString()}</ThemedText>
    </ThemedView>
  )
}

const allServerFunctions: ServerCallbackMap = {
  // [0x02312312]: async (abc: 123) => "Hello, World!",
}

const reframe = ReFrameClient.create({
  modules: {
    ReFrameDynamic: {
      MissingView: (props: object) => <ThemedText>MissingView {JSON.stringify(props)}</ThemedText>,
    },
  },

  remoteConfig: {
    environmentName: "Fake Server",
    replayConsole: true,

    callServer: ((id, args) => {
      const callServerFunction = allServerFunctions[id]
      return callServerFunction(...args)
    }) satisfies CallServerCallback,

    bundlerConfig: {
      [`${"ReFrameDynamic"}#${"MissingView"}`]: [
        "ReFrameDynamic",
        [...([0, "file:///missing"] as const)],
        "MissingView",
      ],
    },
  },

  config: {
    rendererPackageName: pkg.name,
    rendererVersion: pkg.version,

    // prepareDestinationForModule(moduleLoading, nonce, metadata) {},
    // resolveServerReference(bundlerConfig, id) {
    //   const [mod, deps, name] =
    //     bundlerConfig[id] ?? (["unknown", [], "unknown"] satisfies ClientReferenceMetadata)
    //   return `${mod}#${name}`
    // },
    // resolveClientReference(bundlerConfig, [mod, deps, name]) {
    //   return `${mod}#${name}`
    // },
    // async preloadModule(clientReference) {},

    requireModule(clientReference) {
      console.log("ReFrameClient", "requireModule", { clientReference })
      const [modId, name] = clientReference.split("#")

      // modId in reframe.props.modules
      // const mod = reframe.props.modules[modId]
      // return mod[name] || mod.MissingView

      return (props: object) => (
        <ThemedText>
          {clientReference} {JSON.stringify(props)}
        </ThemedText>
      )
    },
  },

  debug: console.debug.bind(console, "ReFrameClient"),
})

/** render RSC without suspense (ideal for React 18) */
function ReFrameFrom({ fallback, rsc }: { fallback?: ReactNode; rsc: RSCSource }) {
  const [node, setNode] = React.useState<ReactNode>(null)
  React.useEffect(() => {
    setNode(null)
    const mounted = new AbortController()
    reframe
      .from<ReactNode>(rsc, {
        signal: mounted.signal,
        onError(error) {
          console.error("ReFrameDynamic error", error)
          // return "IGNORE_ERROR"
        },
      })
      .then(setNode)
    return () => mounted.abort()
  }, [rsc])
  return node ?? fallback
}

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 16, marginBottom: 32 }}>
      <ThemedText style={{ fontSize: 24, marginTop: 16 }}>Streaming text demo (replace)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>real streaming and chunked rendering</ThemedText>
      {/* <ThemedText style={{ backgroundColor: "rebeccapurple" }}>{fakeRSC}</ThemedText> */}
      <Try catch={ErrorBoundary}>
        {/* <Suspense fallback={<ThemedText>Loading...</ThemedText>}>
          <Use>{reframe.from(fakeRSC)}</Use>
        </Suspense> */}

        {/* <Suspense fallback={<ThemedText>Loading...</ThemedText>}>
          <Use>{reframe.from(fakeRSC)}</Use>
        </Suspense> */}

        {/* <ReFrameFrom rsc={fakeRSC} fallback={<ThemedText>Loading...</ThemedText>} /> */}

        <ReRenderTimestamp />
      </Try>
    </ScrollView>
  )
}

// fake RSC server
const fakeRSC = Array.from(
  renderDynamicClientModule(<Text>{new Date().toLocaleString()}</Text>, {
    id: "Bundle",
    dependencies: [0, "ThemedText"],
    name: "",
  }),
).join("")

interface ReRenderableProps {
  render: (onlyChild: ReactNode) => void
  signal: AbortSignal
}
interface ReRenderable {
  (props: ReRenderableProps): Promise<void>
}

function useReRenderable(reRenderable: ReRenderable): ReactNode {
  const [node, setNode] = React.useState<ReactNode>(null)
  React.useEffect(() => {
    setNode(null)
    const mounted = new AbortController()
    reRenderable({
      render(onlyChild) {
        mounted.signal.throwIfAborted()
        setNode(onlyChild)
      },
      signal: mounted.signal,
    }).catch((error) => {
      if (mounted.signal.aborted) return
      setNode(() => {
        // bubble up to the error boundary
        throw error
      })
    })
    return () => mounted.abort()
  }, [reRenderable])
  return node
}

function ReRender({ reRenderable }: { reRenderable: ReRenderable }) {
  return useReRenderable(reRenderable)
}

const ReRenderTimestamp = () => <ReRender reRenderable={renderTimestamp} />

const renderTimestamp: ReRenderable = async ({ render, signal }) => {
  render(<ThemedText>loading...</ThemedText>)

  const response = await fetch("http://localhost:3197/", { signal })
  render(<ThemedText>response: {response.status}</ThemedText>)

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 333)
    signal.addEventListener("abort", () => {
      clearTimeout(timeout)
      reject(new Error("Aborted"))
    })
  })
  if (signal.aborted) return

  const { body } = response

  if (!body) {
    render(<ThemedText>ERROR: no body</ThemedText>)
    return
  }
  const textDecoder = new TextDecoder()
  for await (const chunk of body) {
    if (signal.aborted) return
    const random = Math.random()
    const chunkText = textDecoder.decode(chunk)
    const latestChunkLine = chunkText.trim().split("\n").reverse()[0]
    render(
      <ThemedText
        key={random}
        style={{
          // random background color so it's easier to see that something changed
          backgroundColor: `hsl(${random * 360}, 50%, 50%)`,
          color: "white",
          fontVariant: ["tabular-nums"],
        }}
      >
        {latestChunkLine}
      </ThemedText>,
    )
  }

  render(<ThemedText>{"\n\n"}Done</ThemedText>)
}
