import { Permisos } from "@prisma/client"

export type payloadType = {
  id: number
  type: 'USER' | 'SUPER'
  username: string
  correo: string
}

export interface UserPermissions extends Pick<Permisos, 'id' | 'slug'> {
  can: {
      create?: boolean
      read?: boolean
      update?: boolean
      delete?: boolean
  }
}