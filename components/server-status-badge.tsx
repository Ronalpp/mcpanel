import { Badge } from "@/components/ui/badge"

type ServerStatus = "online" | "offline" | "starting" | "stopping"

interface ServerStatusBadgeProps {
  status: ServerStatus
}

export function ServerStatusBadge({ status }: ServerStatusBadgeProps) {
  const statusConfig = {
    online: { label: "Online", variant: "success" as const },
    offline: { label: "Offline", variant: "secondary" as const },
    starting: { label: "Starting", variant: "warning" as const },
    stopping: { label: "Stopping", variant: "destructive" as const },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

