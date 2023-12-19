type ExcludeType<T> = {
    data: T | T[]
    keys: Array<keyof T>
}

export const excludeFrom = <T>({data, keys}: ExcludeType<T>): T | T[] => {
    const {response, isArray} = convertToArray<T>(data)

    if (isArray) {
        const newObject = response.flatMap(object => excludeFrom<T>({ data: object, keys }))
        return newObject
    }

    const newObject = Object.entries(response as object)
                        .filter(([key]) => !keys.includes(key as keyof T))

    return Object.fromEntries(newObject) as T
}

export const convertToArray = <T>(object: unknown) => {
    const protopStr = Object.prototype.toString.call(object)
    if (protopStr === '[object Array]') {
        return {
            response: object as Array<T>,
            isArray: true
        }
    }

    return {
        response: object as T,
    }
}