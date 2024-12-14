import "@double-observer/react-client/flight"
import {
  ClientModuleExportName,
  ClientReferenceMetadata,
  DependencyChunks,
  ModuleID,
  ReactClientManifestRecord,
} from "@double-observer/react-client/src/ReactFlightClientConfig"
import invariant from "invariant"

export function* renderDynamicClientModule(
  element: React.ReactElement & { type: string | { name: string; displayName?: string } },
  { id: moduleId = "ReFrameDynamic", dependencies, name } = {} as ReactClientManifestRecord,
) {
  invariant(
    !element.props?.children || typeof element.props?.children === "string",
    "children not supported in renderDynamicClientModule yet",
  )

  const isIntrinsic = typeof element.type === "string"
  const displayName: ClientModuleExportName =
    typeof element.type === "string" ?
      element.type
    : (element.type?.displayName ?? element.type?.name ?? element.type ?? name)

  invariant(displayName, "renderDynamicClientModule: element must have a name")

  if (isIntrinsic) {
    yield stringified`0:${["$", element.type, element.key, element.props, null]}\n`
  }

  const id: number = 1
  yield stringified`${id}:I${[moduleId, dependencies, displayName] satisfies ClientReferenceMetadata}\n`
  yield stringified`0:${["$", `$L${id}`, element.key, element.props, null]}\n`
}

function replacer(key: string, value: any) {
  if (value instanceof Promise) throw new Error(`Promise values are not supported yet. Got promise for ${key}`)
  if (typeof value === "function") throw new Error(`function values are not supported yet. Got function for ${key}`)
  return value
}

function stringified(strings: TemplateStringsArray, ...valueSubstitutions: any[]) {
  return strings.reduce(
    (output, stringPart, index) =>
      output + stringPart + (index in valueSubstitutions ? JSON.stringify(valueSubstitutions[index], replacer) : ""),
    "",
  )
}
