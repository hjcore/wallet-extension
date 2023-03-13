export function shuffle(arr: Array<any>) {
  const _arr = [...arr]
  let i = _arr.length

  while (i) {
    const j = Math.floor(Math.random() * i--)

    ;[_arr[j], _arr[i]] = [_arr[i], _arr[j]]
  }

  return _arr
}
