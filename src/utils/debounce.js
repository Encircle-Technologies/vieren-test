export const debounce = (fn, time) => {
  let timer = null
  return () => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, time)
  }
}
