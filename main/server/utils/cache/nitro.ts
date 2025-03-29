export async function invalidateNitroFunctionCache(functionName: string, key: string) {
    await useStorage('cache').removeItem(`nitro:functions:${functionName}:${key}.json`);
} 