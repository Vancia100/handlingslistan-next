type Action =
  | { type: "Check"; id: number }
  | {
      type: "New"
      name: string
      amount: number
      id: number
    }
  | {
      type: "Remove"
      id: number
    }
  | {
      type: "Update"
      id: number
      data: Partial<{ amount: number; name: string; check: boolean }>
    }

interface StartListFormated {
  name: string | undefined
  amount: number
  id: number
  done: boolean
}
export function listReducer<T extends StartListFormated[]>(
  state: T,
  action: Action,
) {
  switch (action.type) {
    case "Check":
      return state.map((val) => {
        if (val.id == action.id) {
          return {
            ...val,
            done: !val.done,
          }
        } else {
          return val
        }
      })
    case "Update":
      return state.map((val) => {
        if (val.id == action.id) {
          return {
            ...val,
            ...action.data,
          }
        } else {
          return val
        }
      })
    case "New":
      return [
        {
          name: action.name,
          amount: action.amount,
          id: action.id,
          done: false,
        },
        ...state,
      ]
    case "Remove":
      return state.filter((val) => val.id != action.id)
  }
}
