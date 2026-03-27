type Action =
  | { type: "check"; id: number }
  | {
      type: "new"
      name: string
      amount: number
      id: number
    }
  | {
      type: "remove"
      id: number
    }
  | {
      type: "update"
      id: number
      data: UpdateType
    }
export type UpdateType = Partial<{
  amount: number
  name: string
  check: boolean
}>
interface StartListFormated {
  name: string | undefined
  amount: number
  id: number
  checked: boolean
}
export function listReducer<T extends StartListFormated[]>(
  state: T,
  action: Action,
) {
  switch (action.type) {
    case "check":
      return state.map((val) => {
        if (val.id == action.id) {
          return {
            ...val,
            checked: !val.checked,
          }
        } else {
          return val
        }
      })
    case "update":
      return state.map((val) => {
        if (val.id == action.id) {
          const nonNull = Object.fromEntries(
            Object.entries(action.data).filter((val) => {
              return val[0] != undefined
            }),
          )
          return {
            ...val,
            ...nonNull,
          }
        } else {
          return val
        }
      })
    case "new":
      return [
        {
          name: action.name,
          amount: action.amount,
          id: action.id,
          checked: false,
        },
        ...state,
      ]
    case "remove":
      return state.filter((val) => val.id != action.id)
  }
}
