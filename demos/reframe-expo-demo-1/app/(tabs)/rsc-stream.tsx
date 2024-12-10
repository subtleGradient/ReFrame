import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ReFrameClient, renderDynamicClientModule, Use } from "@double-observer/reframe"
import { RSCSource } from "@double-observer/reframe/random/types"
import { ErrorBoundaryProps } from "expo-router"
import { Try } from "expo-router/build/views/Try"
import React, { ReactNode, Suspense } from "react"
import { Button, ScrollView } from "react-native"
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

const reframe = ReFrameClient.create({
  config: {
    rendererPackageName: pkg.name,
    rendererVersion: pkg.version,
    requireModule(clientReference) {
      console.log("requireModule", { clientReference })
      return () => <ThemedText>{clientReference}</ThemedText>
    },
  },
  modules: {
    lulz: {
      Lulz: () => {
        return <ThemedText>lulz</ThemedText>
      },
    },
  },
})

function ReFrameDynamic({ fallback, rsc }: { fallback?: ReactNode; rsc: RSCSource }) {
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
  const fakeRSC = Array.from(renderDynamicClientModule(<ThemedText>loaded</ThemedText>)).join("")

  return (
    <ScrollView style={{ padding: 16, marginBottom: 32 }}>
      <ThemedText style={{ fontSize: 24, marginTop: 16 }}>Streaming text demo (replace)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>real streaming and chunked rendering</ThemedText>
      <ThemedText style={{ backgroundColor: "rebeccapurple" }}>{fakeRSC}</ThemedText>
      <Try catch={ErrorBoundary}>
        <Suspense fallback={<ThemedText>Loading...</ThemedText>}>
          <Use>{reframe.from(fakeRSC)}</Use>
        </Suspense>
        <ReFrameDynamic rsc={fakeRSC} fallback={<ThemedText>Loading...</ThemedText>} />
      </Try>
    </ScrollView>
  )
}
