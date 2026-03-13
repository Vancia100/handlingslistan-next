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
      type: "ChangeName"
      id: number
      name: string
    }
  | {
      type: "ChangeAmount"
      id: number
      amount: number
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
    case "ChangeName":
      return state.map((val) => {
        if (val.id == action.id) {
          return {
            ...val,
            name: action.name,
          }
        } else {
          return val
        }
      })
    case "ChangeAmount":
      return state.map((val) => {
        if (val.id == action.id) {
          return {
            ...val,
            amount: action.amount,
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
