import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import {
  CallServerCallback,
  ServerCallbackMap,
} from "@double-observer/react-client/src/ReactFlightReplyClient"
import { ReFrameClient, renderDynamicClientModule, Use } from "@double-observer/reframe/client"
import { RSCSource } from "@double-observer/reframe/random/types"
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
      <ThemedText style={{ backgroundColor: "rebeccapurple" }}>{fakeRSC}</ThemedText>
      <Try catch={ErrorBoundary}>
        <Suspense fallback={<ThemedText>Loading...</ThemedText>}>
          <Use>{reframe.from(fakeRSC)}</Use>
        </Suspense>

        <ReFrameFrom rsc={fakeRSC} fallback={<ThemedText>Loading...</ThemedText>} />
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
