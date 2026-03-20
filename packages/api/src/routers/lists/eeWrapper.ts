/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter, { on } from "node:events"
import type {
  newListValidator,
  updateListValidator,
} from "@hndl/types/validators"
import { z } from "zod"
type DifInputTypes = {
  [key: string]: [
    sentUserSessionId: string,
    list:
      | {
          type: "new"
          list: z.infer<typeof newListValidator> & { id: number }
        }
      | {
          type: "update"
          list: z.infer<typeof updateListValidator> & { id: number }
          listIngredientId: number
        },
  ]
}
interface Inputs {
  new: [
    listID: number,
    list: z.infer<typeof newListValidator> & { id: number },
    sentUserSessionId: string,
  ]
}
type EventMap<T> = Record<keyof T, any[]>
class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as any, eventName, opts) as any
  }
}
export const ee = new IterableEventEmitter<DifInputTypes>()
ee.emit("")
