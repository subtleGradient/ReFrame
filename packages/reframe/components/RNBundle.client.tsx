import React, { ComponentProps, ReactNode } from "react"
import {
  Alert,
  AlertButton,
  AlertOptions,
  Button,
  ButtonProps,
  Pressable,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  Switch,
  SwitchProps,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import {
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native-gesture-handler"

type AnyFunction = (...args: any[]) => any
type AnyOptionalFunction = null | undefined | AnyFunction
type Prettify<T> = { [K in keyof T]: T[K] } & {}
type ReplaceValues<T, V> = { [K in keyof T]: V }
type ReplaceType<T, Old, New> = { [K in keyof T]: T[K] extends Old ? New : T[K] }
type OmitType<T, U> = ReplaceType<T, U, never>
type PickType<T, K> = { [P in keyof T as T[P] extends K ? P : never]: T[P] }
/** `Suffix<{abc:123},'SUFFIX'>` => `{abcSUFFIX:123}` */
type Suffix<T, Suffix extends string> = { [K in keyof T as `${K & string}${Suffix}`]: T[K] }
type MethodNames<T> = keyof PickType<Required<T>, AnyFunction>
type MethodsOf<T> = Pick<T, MethodNames<T>>

type AnyClientAction = { isClientAction: true }
type ClientActionPayload =
  | { action: "log"; args: any[] }
  | {
      action: "Alert"
      title: string
      message?: string
      buttons?: AlertButton[]
      options?: AlertOptions
    }

export type ClientAction =
  | (AnyClientAction & ClientActionPayload)
  | (AnyClientAction & {
      promise: Promise<
        (Partial<AnyClientAction> & ClientActionPayload) | Array<Partial<AnyClientAction> & ClientActionPayload>
      >
    })
  | (AnyClientAction & { actions: Array<Partial<AnyClientAction> & ClientActionPayload> })

function isClientAction(value: unknown): value is ClientAction {
  return (
    typeof value === "object" && value !== null && "isClientAction" in value && (value as ClientAction).isClientAction
  )
}

const ClientActionPropSuffix = "ClientAction" as const

type ServerActionRef<T> = T | "never" // TODO: replace with actual server action reference type

/** @deprecated there's a better way */
type ClientAct<T> = Prettify<
  ReplaceValues<Suffix<MethodsOf<T>, typeof ClientActionPropSuffix>, ClientAction> & {
    [K in keyof T]: ServerActionRef<T[K]>
  }
>

function handleServerIntent(propName: string, props: ClientActionPayload, ...clientArgs: any[]) {
  const { action } = props
  switch (action) {
    case "log": {
      console.log("FROM SERVER:", propName, ...props.args, ...clientArgs)
      break
    }

    case "Alert": {
      Alert.alert(props.title, props.message, props.buttons, props.options)
      break
    }

    default: {
      action satisfies never // all cases should be handled
      console.warn("Unknown client action", { propName, props, clientArgs })
      break
    }
  }
}

function useClientActionHandlers<T extends object>(serverProps: ClientAct<T>): T {
  const clientProps = {} as T

  for (const propName in serverProps as T) {
    const serverPropValue = serverProps[propName]
    const clientPropName = propName.replace(RegExp(ClientActionPropSuffix + "$"), "") as keyof T
    if (isClientAction(serverPropValue)) {
      clientProps[clientPropName] = ((...args: any[]) => {
        if ("promise" in serverPropValue)
          return serverPropValue.promise.then((clientAction) =>
            Array.isArray(clientAction) ?
              clientAction.forEach((ca) => handleServerIntent(propName, ca, ...args))
            : handleServerIntent(propName, clientAction, ...args),
          )

        if ("actions" in serverPropValue)
          return serverPropValue.actions.forEach((clientAction) => handleServerIntent(propName, clientAction, ...args))

        return handleServerIntent(propName, serverPropValue, ...args)
      }) as T[typeof clientPropName]
    } else {
      clientProps[clientPropName] = serverPropValue as T[typeof propName]
    }
  }

  return clientProps
}

// prettier-ignore
export default {
  Button                   : (props: ClientAct<ButtonProps>                   ) => <Button                   {...useClientActionHandlers<ButtonProps>(props)} />,
  MissingView              : (props: ClientAct<ViewProps>                     ) => <View                     {...useClientActionHandlers<ViewProps>(props)} data-isMissingView />,
  Pressable                : (props: ClientAct<PressableProps>                ) => <Pressable                {...useClientActionHandlers<PressableProps>(props)} />,
  ScrollView               : (props: ClientAct<ScrollViewProps>               ) => <ScrollView               {...useClientActionHandlers<ScrollViewProps>(props)} />,
  Switch                   : (props: ClientAct<SwitchProps>                   ) => <Switch                   {...useClientActionHandlers<SwitchProps>(props)} />,
  Text                     : (props: ClientAct<TextProps>                     ) => <Text                     {...useClientActionHandlers<TextProps>(props)} />,
  TextInput                : (props: ClientAct<TextInputProps>                ) => <TextInput                {...useClientActionHandlers<TextInputProps>(props)} />,
  TouchableHighlight       : (props: ClientAct<TouchableHighlightProps>       ) => <TouchableHighlight       {...useClientActionHandlers<TouchableHighlightProps>(props)} />,
  TouchableOpacity         : (props: ClientAct<TouchableOpacityProps>         ) => <TouchableOpacity         {...useClientActionHandlers<TouchableOpacityProps>(props)} />,
  TouchableWithoutFeedback : (props: ClientAct<TouchableWithoutFeedbackProps> ) => <TouchableWithoutFeedback {...useClientActionHandlers<TouchableWithoutFeedbackProps>(props)} />,
  View                     : (props: ClientAct<ViewProps>                     ) => <View                     {...useClientActionHandlers<ViewProps>(props)} />,
}
