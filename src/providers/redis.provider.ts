import { createClient } from 'redis';
import logger from '../utils/logger';
import { isValidJSON } from '../utils/filtering';

const client = () => {
    try {
        const client = createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379', 10)
            }
        });
    
        if (client === undefined) throw new Error("creating redis client returns undefined!");
    
        return client
    } catch (error) {
        logger.error(`Error initializing redis: ${error}`, console.error)
        return null
    }
}

const store = async <T>(key: string, value: T) => {
    let data: string = "";

    try {
        const instance = client()
        if (instance === null) return false

        if (typeof value === 'object') data = JSON.stringify(value)
        else data = String(value)

        const result = await instance.set(key, data)
        
        if (result === null) throw new Error(`Could not store value with key ${key} in redis`)

        return true
    } catch (error) {
        logger.error(`Error storing in redis: ${error}`, console.error)
        return false
    }
}

const obtain = async <T>(key: string): Promise<T | null> => {
    try {
        const instance = client()
        if (instance === null) return null

        const data = await instance.get(key)

        if (data === null) return null

        if (isValidJSON(data)) return JSON.parse(data) as T

        return data as T
    } catch (error) {
        logger.error(`Error obtaining data in redis: ${error}`, console.error)
        return null
    }
}

const destroy = async(key: string): Promise<number | null> => {
    try {
        const instance = client()
        if (instance === null) return null

        const count = await instance.del(key)

        if (count === 0) return null

        return count
    } catch (error) {
        logger.error(`Error deleting data in redis: ${error}`, console.error)
        return null
    }
}

export {
    client as init,
    store,
    obtain,
    destroy
}