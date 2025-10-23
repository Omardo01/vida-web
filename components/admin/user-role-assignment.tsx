"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface Role {
  role_id: string
  role_name: string
  display_name: string
  color: string
}

interface UserRoleAssignmentProps {
  userId: string
  userEmail: string
  currentRoles: Role[]
  availableRoles: any[]
  onRolesChanged: () => void
}

export function UserRoleAssignment({
  userId,
  userEmail,
  currentRoles,
  availableRoles,
  onRolesChanged,
}: UserRoleAssignmentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleAddRole = async () => {
    if (!selectedRoleId) {
      toast.error("Selecciona un rol")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          roleId: selectedRoleId,
        }),
      })

      if (response.ok) {
        toast.success("Rol asignado exitosamente")
        setDialogOpen(false)
        setSelectedRoleId("")
        onRolesChanged()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al asignar rol")
      }
    } catch (error) {
      console.error("Error assigning role:", error)
      toast.error("Error al asignar rol")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    try {
      const response = await fetch(
        `/api/admin/user-roles?userId=${userId}&roleId=${roleId}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        toast.success("Rol removido exitosamente")
        onRolesChanged()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al remover rol")
      }
    } catch (error) {
      console.error("Error removing role:", error)
      toast.error("Error al remover rol")
    }
  }

  // Filtrar roles disponibles que el usuario no tiene
  const rolesNotAssigned = availableRoles.filter(
    (role) => !currentRoles.some((cr) => cr.role_id === role.id)
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentRoles.length === 0 ? (
        <Badge variant="outline" className="bg-muted/50">
          Sin rol
        </Badge>
      ) : (
        currentRoles.map((role) => (
          <Badge
            key={role.role_id}
            variant="secondary"
            className="gap-1 pr-1"
            style={{
              backgroundColor: `${role.color}20`,
              color: role.color,
              borderColor: `${role.color}40`,
            }}
          >
            {role.display_name}
            <button
              onClick={() => handleRemoveRole(role.role_id)}
              className="ml-1 rounded-sm hover:bg-foreground/20 p-0.5"
              title="Remover rol"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))
      )}
      
      {rolesNotAssigned.length > 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Plus className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Rol</DialogTitle>
              <DialogDescription>
                Asignar un rol a {userEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesNotAssigned.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                        {role.display_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddRole} disabled={loading}>
                  {loading ? "Asignando..." : "Asignar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

