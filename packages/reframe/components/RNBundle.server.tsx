import React from "react"
import ReactServerDOMServer, {
  ReactReference$$id,
  registerClientReference,
} from "react-server-dom-webpack/server"

import type RN from "./RNBundle.client"
type RNBundle = typeof RN
type RNBundleComponentName = keyof RNBundle & string

/** This is a fake client render function for the server */
function genClientProxy<K extends keyof RNBundle & string>(componentName: K) {
  type Props = Parameters<RNBundle[K]>[0]
  type RType = ReturnType<RNBundle[K]>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return ((props: Props): RType => {
    throw new TypeError(`client component ${componentName} must not be called on the server`)
  }) as unknown as RNBundle[K]
}

type Readwrite<T> = { -readonly [P in keyof T]: T[P] }

// define the client components available on the server
export const Button                   = registerClientReference(genClientProxy("Button"),                   "RN", "Button") // prettier-ignore
export const Pressable                = registerClientReference(genClientProxy("Pressable"),                "RN", "Pressable") // prettier-ignore
export const ScrollView               = registerClientReference(genClientProxy("ScrollView"),               "RN", "ScrollView") // prettier-ignore
export const Switch                   = registerClientReference(genClientProxy("Switch"),                   "RN", "Switch") // prettier-ignore
export const Text                     = registerClientReference(genClientProxy("Text"),                     "RN", "Text") // prettier-ignore
export const TextInput                = registerClientReference(genClientProxy("TextInput"),                "RN", "TextInput") // prettier-ignore
export const TouchableHighlight       = registerClientReference(genClientProxy("TouchableHighlight"),       "RN", "TouchableHighlight") // prettier-ignore
export const TouchableOpacity         = registerClientReference(genClientProxy("TouchableOpacity"),         "RN", "TouchableOpacity") // prettier-ignore
export const TouchableWithoutFeedback = registerClientReference(genClientProxy("TouchableWithoutFeedback"), "RN", "TouchableWithoutFeedback") // prettier-ignore
export const View                     = registerClientReference(genClientProxy("View"),                     "RN", "View") // prettier-ignore

// this is usually handled in a react-server compatible bundler based on the "use client" directive
const clientComponents: Readwrite<Omit<RNBundle, "MissingView">> = {
  Button,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
}

export default clientComponents

export const missingClientComponents = new Proxy(
  {} as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ComponentName: string]: (props: any) => React.ReactNode
  },
  {
    get(_, ComponentName: keyof typeof clientComponents & string) {
      if (!ComponentName.startsWith("Dynamic")) {
        return (
          clientComponents[ComponentName] ||
          Object.assign(
            () => (
              <View key={ComponentName}>
                {__DEV__ && <Text>TODO: Add {String(ComponentName)}</Text>}
              </View>
            ),
            { displayName: `TODO.${ComponentName}` },
          )
        )
      }

      if (ComponentName in clientComponents && "$$id" in clientComponents[ComponentName])
        return clientComponents[ComponentName]
      console.warn(
        `Using a component that doesn't exist yet. TODO: Add ${String(ComponentName)} to ReFrameDynamic.clientComponents`,
      )
      const Component = ((clientComponents[ComponentName] as any) ||= registerClientReference(
        genClientProxy(ComponentName),
        "ReFrameDynamic",
        ComponentName,
      )) as unknown as { $$id: ReactReference$$id }

      clientManifest[Component.$$id] ||= { id: "ReFrameDynamic", chunks: [], name: ComponentName }
      return Component
    },
  },
)

/**
 * dependency injection the {@link ReactServerDOMServer} implementation
 */
export const clientManifest: ReactServerDOMServer.IReactClientManifest = {}
{
  // generate the manifest for the client components
  // this is usually handled in a react-server compatible bundler
  for (const [key, Component] of Object.entries(
    clientComponents as unknown as Record<
      RNBundleComponentName,
      ReturnType<typeof ReactServerDOMServer.registerClientReference>
    >,
  )) {
    const [id, name] = Component.$$id.split("#")
    if (key !== name)
      throw new Error(
        `Component key "${key}" must match export "${name}". Check clientComponents object`,
      )
    clientManifest[Component.$$id] = { id, chunks: [], name }
  }
}

export async function Await({
  children: promise,
}: {
  children: React.ReactNode | Promise<React.ReactNode>
}) {
  "server only"
  return await promise
}
