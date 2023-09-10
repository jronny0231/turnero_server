import { z } from 'zod'
import { createAgent } from './agent.schema'

export const userSchema = z.object({
    nombres: z.string().min(1).max(50),
    correo: z.string().email().max(60),
    username: z.string().min(3).max(15)
                .regex(/^[A-Z][a-zA-Z0-9_]+$/,
                    "Must start with uppercase and only include letters, numbers and one underscore"),
    password: z.string().min(8).max(80)
                .regex(/^(?=.*[a-z]).+$/,
                    "Must contain at least one LOWERCASE letter")

                .regex(/^(?=.*[A-Z]).+$/,
                    "Must contain at least one UPPERCASE letter")

                .regex(/^(?=.*[-+_!@#$%^&*., ?]).+$/,
                    "Must contain at least one SPECIAL character")
                
                .regex(/^(?=.*\d).+$/,
                    "Must contain at least one NUMBER"),
    rol_id: z.number().min(1),
    agente_id: z.coerce.number().gte(1),
    agente: createAgent
})

export const createUser = z.object({
    body: userSchema.partial({
        agente: true,
        agente_id: true,
    })
})

export const updateUser = z.object({
    params: z.object({
        id: z.number().gte(1)
    }),

    body: userSchema.pick({
        username: true,
        correo: true,
        rol_id: true,
        agente: true
    }).partial()    
})

export const userCredential = z.object({
    body: userSchema.pick({
        username: true,
        password: true
    })
})

export const passwordChange = z.object({
    params: z.object({
        id: z.number().gte(1)
    }),
    
    body: userSchema.pick({
        password: true
    }) 
})

export type createUserType = z.infer<typeof createUser>
export type updateUserType = z.infer<typeof updateUser>
export type userCredentialType = z.infer<typeof userCredential>
export type passwordChangeType = z.infer<typeof passwordChange>