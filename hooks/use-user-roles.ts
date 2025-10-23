"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UserRole {
  role_id: string
  role_name: string
  display_name: string
  color: string
}

export function useUserRoles() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)

  useEffect(() => {
    async function fetchUserRoles() {
      if (!user) {
        setRoles([])
        setHasAdminAccess(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/user-roles?userId=${user.id}`)
        
        if (response.ok) {
          const data = await response.json()
          const userRoles = data.roles || []
          setRoles(userRoles)
          
          // Verificar si tiene acceso al dashboard (cualquier rol excepto 'usuario')
          const hasAccess = userRoles.length > 0 && 
            userRoles.some((role: UserRole) => role.role_name !== 'usuario')
          
          setHasAdminAccess(hasAccess)
        } else {
          setRoles([])
          setHasAdminAccess(false)
        }
      } catch (error) {
        console.error('Error fetching user roles:', error)
        setRoles([])
        setHasAdminAccess(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRoles()
  }, [user])

  return {
    roles,
    loading,
    hasAdminAccess,
    isAdmin: roles.some(role => role.role_name === 'admin'),
    isPastor: roles.some(role => role.role_name === 'pastor'),
    isLider: roles.some(role => role.role_name === 'lider'),
  }
}

