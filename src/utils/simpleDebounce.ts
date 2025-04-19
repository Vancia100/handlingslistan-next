// thispastwinter on https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
export const functionalDebounce = <
  F extends (...args: Parameters<F>) => ReturnType<F>,
>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}
