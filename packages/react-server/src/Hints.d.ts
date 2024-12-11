// You can make this more specific if you have a fixed set of codes
export type HintCode = keyof Hints | string

// A union type for all possible HintModels
export type HintModel<T extends HintCode> =
  T extends keyof Hints ? Hints[T]
  : // Fallback for unknown hint codes or if no specific model is defined
    Hints["unknown"]

// Use a generic type parameter for Hints to track the specific HintModel
export interface Hints {
  preload: PreloadHintModel
  preconnect: PreconnectHintModel
  unknown: { [key: string]: any }
}

export type PreloadHintModel = {
  href: string
  as: "script" | "style" | "font" | "fetch" | "image"
  crossOrigin?: "anonymous" | "use-credentials"
  integrity?: string
}

export type PreconnectHintModel = {
  href: string
  crossOrigin?: "anonymous" | "use-credentials"
}
