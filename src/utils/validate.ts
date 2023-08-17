type composeType = 'UCASE' | 'LCASE' | 'SPACE' | 'NUMBER' | 'SPECIAL' | 'DASH' | 'UNDERSCOT'

type Rules = {
    max?: number
    min?: number
    maxLen?: number
    minLen?: number
    equalTo?: string
    contains?: string

    isNumber?: boolean
    isString?: boolean
    isBoolean?: boolean
    isEmail?: boolean
    isArray?: boolean
    custom?: boolean

    include?: composeType[]
    exclude?: composeType[]
}

type inputOption = Array <{
    value: any
    rules: Rules
} | undefined>

type ruleValidate = {
    rule: string
    pass: boolean
    message: string
}

interface ValidateResponse {
    hasErrors: boolean
    results: Array <{
        value: string
        result: Array <ruleValidate>
    }>
}

const RULE_MESSAGE = {
    max: {
        "true": "El valor # es menor al maximo requerido",
        "false": "El valor # es mayor al maximo requerido"
    },
    min: {
        "true": "El valor # es mayor al minimo requerido",
        "false": "El valor # es menor al minimo requerido"
    },
    maxLen: {
        "true": "La cadena # tiene una longitud menor a la maxima requerida",
        "false": "La cadena # tiene una longitud mayor a la maxima requerida"
    },
    minLen: {
        "true": "La cadena # tiene una longitud mayor a la minima requerida",
        "false": "La cadena # tiene una longitud menor a la minima requerida"
    },
    isEmail: {
        "true": "El valor # es un email valido",
        "false": "El valor # no es un email valido"
    },
    equalTo: {
        "true": "El valor # es igual al parametro requerido @",
        "false": "El valor # es diferente al parametro requerido @"
    },
    contains: {
        "true": "El valor # contiene la cadena @",
        "false": "El valor # no contiene la cadena @"
    },

    isNumber: {
        "true": "El valor # es un numero entero valido",
        "false": "El valor # no es un numero entero valido"
    },
    isString: {
        "true": "El valor # es una cadena de texto valida",
        "false": "El valor # no es una cadena de texto valida"
    },
    isBoolean: {
        "true": "El valor # es de tipo boleano",
        "false": "El valor # no es de tipo boleano"
    },
    isArray: {
        "true": "El valor # es del tipo arreglo",
        "false": "El valor # no es del tipo arreglo"
    },
    custom: {
        "true": "La funcion # arroja una comprobacion verdadera en @",
        "false": "La funcion # arroja una comprobacion falsa en @"
    },
    include: {
        "true": "El valor # contiene todos los tipos de datos en @",
        "false": "El valor # no contiene todos los tipos de datos en @"
    },
    exclude: {
        "true": "El valor # excluye todos los tipos de datos en @",
        "false": "El valor # no excluye todos los tipos de datos en @"
    }
}

const RULE_FUNCTION = {
    max: (val: number, max: number) => val <= max,
    min: (val: number, min: number) => val >= min,
    maxLen: (val: string, max: number) => val.length <= max,
    minLen: (val: string, min: number) => val.length >= min,
    isEmail: (val: string) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(val).toLowerCase()); 
    },
    equalTo: (val: any, compare: any) => val === compare,
    contains: (val: string, segment: string) => val.includes(segment),

    isNumber: (val: any) => typeof val === 'number',
    isString: (val: any) => typeof val === 'string',

    isBoolean: (val: any) => typeof val === 'boolean',
    isArray: (val: any) => val instanceof Array,
    custom: (func: any) => func(),
    include: (value: string, types: composeType[]) => {
        return types.map(type => {
            if (type === 'LCASE') return /[a-z]/g.test(value)
            if (type === 'UCASE') return /[A-Z]/g.test(value)
            if (type === 'NUMBER') return /\d/.test(value)
            if (type === 'DASH') return /-/.test(value)
            if (type === 'SPACE') return /^\S*$/.test(value)
            if (type === 'UNDERSCOT') return /_/g.test(value)
            if (type === 'SPECIAL') return /[!@#$%^&*(),.?":{}|<>]/g.test(value)
            return false
        }).reduce((prev, sum) => sum || !prev) // Valuate if any regex validation is false 
    },
    exclude: (value: string, types: composeType[]) => {
        return types.map(type => {
            if (type === 'LCASE') return !/[a-z]/g.test(value)
            if (type === 'UCASE') return !/[A-Z]/g.test(value)
            if (type === 'NUMBER') return !/\d/.test(value)
            if (type === 'DASH') return !/-/.test(value)
            if (type === 'SPACE') return !/^\S*$/.test(value)
            if (type === 'UNDERSCOT') return !/_/g.test(value)
            if (type === 'SPECIAL') return !/[!@#$%^&*(),.?":{}|<>]/g.test(value)
            return false
        }).reduce((prev, sum) => sum || !prev) // Valuate if any regex validation is false 
    }
}

export default function validate(data: inputOption): ValidateResponse {
    let hasErrors = false
    const results = data.map(input => {
        if (input === undefined) return null
        const result = Object.entries(input.rules).map(([key, value]) => {
            const pass = RULE_FUNCTION[key as keyof typeof RULE_FUNCTION](input.value as never, value)
            const ruleMsg = RULE_MESSAGE[key as keyof typeof RULE_FUNCTION]
            const pureMsg = ruleMsg[String(pass) as keyof typeof ruleMsg]
            const message = pureMsg.replace("#", String(input.value)).replace("@", String(value))

            hasErrors = hasErrors || !pass
            return {
                rule: key,
                pass,
                message
            } as ruleValidate
        })

        return {
            value: input.value,
            result
        }
    }).filter(entry => entry !== null) as { value: string, result: ruleValidate[] }[]

    return {
        hasErrors,
        results
    }
    
}