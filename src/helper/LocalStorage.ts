interface TLocalStorage {
  user: {
    access_token: string
    refresh_token: string
  }
}
const LocalStorage = () => {
  const save = <T extends keyof TLocalStorage>(key: T, value: TLocalStorage[T]) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const clear = <T extends keyof TLocalStorage>(key: T) => {
    localStorage.removeItem(key)
  }

  const get = <T extends keyof TLocalStorage>(key: T) => {
    return JSON.parse(localStorage.getItem(key) as string)
  }

  return { save, clear, get }
}

export default LocalStorage()
