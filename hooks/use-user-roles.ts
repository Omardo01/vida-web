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
  const [hasDashboardAccess, setHasDashboardAccess] = useState(false)

  useEffect(() => {
    async function fetchUserRoles() {
      if (!user) {
        setRoles([])
        setHasAdminAccess(false)
        setHasDashboardAccess(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/user-roles?userId=${user.id}`)
        
        if (response.ok) {
          const data = await response.json()
          const userRoles = data.roles || []
          setRoles(userRoles)
          
          // Verificar si tiene acceso al panel de admin (cualquier rol excepto 'usuario')
          const hasAccess = userRoles.length > 0 && 
            userRoles.some((role: UserRole) => role.role_name !== 'usuario')
          
          setHasAdminAccess(hasAccess)
          
          // Verificar si tiene acceso al dashboard de usuario (cualquier rol asignado)
          setHasDashboardAccess(userRoles.length > 0)
        } else {
          setRoles([])
          setHasAdminAccess(false)
          setHasDashboardAccess(false)
        }
      } catch (error) {
        console.error('Error fetching user roles:', error)
        setRoles([])
        setHasAdminAccess(false)
        setHasDashboardAccess(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRoles()
  }, [user])

  // Helper para verificar roles de gestión (lider, pastor, admin)
  const hasManagementRole = roles.some(role => 
    ['admin', 'pastor', 'lider'].includes(role.role_name)
  )

  // Helper para obtener el rol principal (el de mayor jerarquía)
  const getPrimaryRole = (): UserRole | null => {
    const hierarchy = ['admin', 'pastor', 'lider', 'celula', 'curso', 'usuario']
    for (const roleName of hierarchy) {
      const found = roles.find(role => role.role_name === roleName)
      if (found) return found
    }
    return roles[0] || null
  }

  return {
    roles,
    loading,
    hasAdminAccess,
    hasDashboardAccess,
    hasManagementRole,
    primaryRole: getPrimaryRole(),
    isAdmin: roles.some(role => role.role_name === 'admin'),
    isPastor: roles.some(role => role.role_name === 'pastor'),
    isLider: roles.some(role => role.role_name === 'lider'),
    isCelula: roles.some(role => role.role_name === 'celula'),
    isCurso: roles.some(role => role.role_name === 'curso'),
    isUsuario: roles.some(role => role.role_name === 'usuario'),
  }
}

