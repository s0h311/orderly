import memoryDriver from 'unstorage/drivers/memory'

export default defineNitroPlugin(() => {
  const cache = useStorage()

  cache.mount('cache', memoryDriver())
})

export const useCache = () => useStorage('cache')
