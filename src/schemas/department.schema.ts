import { z } from 'zod'
import { discriminateFilterService } from './service.schema'

const departmentSchema = z.object({
    descripcion: z.string().min(4).max(30),
    siglas: z.string().min(4).max(5)
                .regex(/^[A-Z]+$/,
                    "Must contain only UPPERCASE character."),
})

export const createDepartment = z.object({
    query: z.object({
        sucursal_id: z.coerce.number().gte(1).optional()
    }),
    
    body: departmentSchema
})

export const updateDepartment = z.object({
    params: z.object({
        id: z.coerce.number().gte(1)
    }),
    
    query: z.object({
        sucursal_id: z.coerce.number().gte(1).optional()
    }),

    body: departmentSchema.partial()
})

export const createDepartmentWithRelatedServices = z.object({
    query: z.object({
        sucursal_id: z.coerce.number().gte(1).optional()
    }),
    
    body: z.object({
        departamento: departmentSchema,
        servicios: discriminateFilterService,
    }),
})

export const addRelatedServicesToDepartment = z.object({
    params: z.object({
        id: z.coerce.number().gte(1)
    }),
    
    body: z.object({
        sucursal_id: z.coerce.number().gte(1),
        servicios: discriminateFilterService,
    }),
})

export type createDepartmentType = z.infer<typeof createDepartment>
export type updateDepartmentType = z.infer<typeof updateDepartment>
export type createDepartmentWithRelatedServicesType = z.infer<typeof createDepartmentWithRelatedServices>
export type addRelatedServicesToDepartmentType = z.infer<typeof addRelatedServicesToDepartment>