import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerStatusBadge } from "@/components/server-status-badge"
import { ServerControls } from "@/components/server-controls"
import { ServerStats } from "@/components/server-stats"
import { CreateServerButton } from "@/components/create-server-button"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Minecraft Server Manager</h1>
        <CreateServerButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* This would be mapped from actual server data */}
        <ServerCard name="Survival Server" status="online" memory="2GB" cpu="2 cores" port="25565" />
        <ServerCard name="Creative Server" status="offline" memory="4GB" cpu="4 cores" port="25566" />
        <ServerCard name="Modded Server" status="starting" memory="8GB" cpu="6 cores" port="25567" />
      </div>
    </div>
  )
}

function ServerCard({
  name,
  status,
  memory,
  cpu,
  port,
}: {
  name: string
  status: "online" | "offline" | "starting" | "stopping"
  memory: string
  cpu: string
  port: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          <ServerStatusBadge status={status} />
        </div>
        <CardDescription>Port: {port}</CardDescription>
      </CardHeader>
      <CardContent>
        <ServerStats memory={memory} cpu={cpu} />
      </CardContent>
      <CardFooter>
        <ServerControls serverId={name.toLowerCase().replace(/\s+/g, "-")} status={status} />
      </CardFooter>
    </Card>
  )
}

