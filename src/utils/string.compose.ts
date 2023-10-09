import { paramsType } from "../services/audio.manager";

export const prepareCallAudioInfo = (secuencia_ticket: string, siglas_departamento: string, prefijo_servicio?: string | undefined) => {
    
    const [letters, numbers] = secuencia_ticket.match(/([a-zA-Z]+)|(\d+)/g) ?? []

    const initDing: paramsType = {
        pos: 0,
        type: 'utils',
        name: 'ding'
    }
    
    const lettersMap: paramsType[] = letters?.toUpperCase().split('').map((letter, i) => ({
        pos: i + 1,
        type: 'letters',
        name: letter
    })) ?? [];

    const numbersMap: paramsType[] = []

    const deptMap: paramsType = {
        pos: 6,
        type: 'department',
        name: siglas_departamento.toUpperCase()
    }

    const servMap: paramsType | null = prefijo_servicio ? {
        pos: 8,
        type: 'services',
        name: prefijo_servicio.toUpperCase()
    }: null

    const value: number = Number(numbers)
    const decimalsAfterTen = [2,3,4,5,6,7,8,9].map(num => num * 10)
    

    if (value <= 9) {
        numbersMap.push({ pos: 4, type: 'numbers', name: '0' })
        numbersMap.push({ pos: 5, type: 'numbers', name: value.toString() })
    }
    if (value >= 10 && value <= 20 || decimalsAfterTen.includes(value)) {
        numbersMap.push({ pos: 4, type: 'numbers', name: value.toString() })
    }
    
    const [decimal, unit] = value.toString().split("")

    if (value >=21 && value <= 29) {
        numbersMap.push({ pos: 4, type: 'numbers', name: decimal + "X" })
        numbersMap.push({ pos: 5, type: 'numbers', name: unit })
    }

    if (value > 30 && decimalsAfterTen.includes(value) === false) {
        numbersMap.push({ pos: 4, type: 'numbers', name: decimal + "0" })
        numbersMap.push({ pos: 5, type: 'numbers', name: "X" + unit })
    }

    const joinObjects = [...lettersMap, ...numbersMap, deptMap, initDing]

    if (servMap) { joinObjects.push({pos: 7, type: 'utils', name: 'PARA'}, servMap) }

    return joinObjects
}