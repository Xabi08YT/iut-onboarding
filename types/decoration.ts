export interface DecorationItem {
  svg: string
  posStyle: string
  transition: string
  show: boolean
  class: string
}

export type DecorationsMap = Record<string, DecorationItem[]>;
