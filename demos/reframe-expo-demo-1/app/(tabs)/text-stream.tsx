import { ScrollView, Text, View } from "react-native"
import { fetch } from "expo/fetch"
import React from "react"
import { StreamingFragment } from "@sublegradient/reframe-bridge/StreamingFragment"

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24 }}>Streaming text demo (replace)</Text>
      <Text style={{ fontSize: 14 }}>real streaming and chunked rendering</Text>
      <Text>
        <StreamingFragment
          initialChildren={<Text>loading...</Text>}
          children={renderChunkedTimestamps}
        />
      </Text>

      <Text style={{ fontSize: 24 }}>Streaming text demo (append)</Text>
      <Text style={{ fontSize: 14 }}>fake streaming, but real chunked rendering</Text>
      <Text>
        <StreamingFragment initialChildren={<Text>loading...</Text>} children={renderChunked} />
      </Text>
    </ScrollView>
  )
}

const renderChunked = {
  async *[Symbol.asyncIterator]() {
    yield { replace: <Text>loading...</Text> }

    const response = await fetch("https://baconipsum.com/api/?type=meat-and-filler")
    yield { replace: <Text>response: {response.status}</Text> }

    await new Promise((resolve) => setTimeout(resolve, 333))
    const text = await response.text()

    const chunks = text.split(/\b|\["|"]|(",")/)

    let index = -1
    for (const chunk of chunks) {
      index++
      if (chunk === `","`) {
        yield <Text>{"\n\n"}</Text>
        continue
      }
      if (index === 0) yield { replace: null }
      yield <Text>{chunk}</Text>
      await new Promise((resolve) => setTimeout(resolve, 111 * Math.random()))
    }

    yield <Text>{"\n\n"}Done</Text>
  },
}

const renderChunkedTimestamps = {
  async *[Symbol.asyncIterator]() {
    yield { replace: <Text>loading...</Text> }

    const response = await fetch("http://localhost:8000")
    yield { replace: <Text>response: {response.status}</Text> }

    await new Promise((resolve) => setTimeout(resolve, 333))

    const { body } = response

    if (!body) {
      yield <Text>ERROR: no body</Text>
      return
    }
    for await (const chunk of body) {
      const random = Math.random()
      yield {
        replace: (
          <Text
            style={{
              // random background color so it's easier to see that something changed
              backgroundColor: `hsl(${random * 360}, 50%, 50%)`,
              color: "white",
              fontVariant: ["tabular-nums"],
            }}
          >
            {new TextDecoder().decode(chunk)}
          </Text>
        ),
      }
    }

    yield <Text>{"\n\n"}Done</Text>
  },
}
