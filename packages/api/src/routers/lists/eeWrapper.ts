/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter, { on } from "node:events"
import type {
  newListValidator,
  updateListValidator,
} from "@hndl/types/validators"
import { z } from "zod"

type NewData = {
  type: "new"
  list: z.infer<typeof newListValidator> & { id: number }
}
type UpdData = {
  type: "update"
  list: z.infer<typeof updateListValidator> & { id: number }
  listIngredientId: number
}
type ListPayload<T extends "new" | "update"> = T extends "new"
  ? [sentUserSessionId: string, data: NewData]
  : T extends "update"
    ? [sentUserSessionId: string, data: UpdData]
    : never
interface ListEventMap {
  [K: `onList-${number}`]: ListPayload<"new"> | ListPayload<"update">
}

type EventMap<T> = Record<keyof T, any[]>

class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as any, eventName, opts) as any
  }
  eimtForId<IdNumber extends number, K extends "new" | "update">(
    id: IdNumber,
    ...args: ListPayload<K>
  ) {
    this.emit(`onList-${id}`, ...(args as any))
  }
}
export const ee = new IterableEventEmitter<ListEventMap>()
ee.emit("test", "wadwa")
