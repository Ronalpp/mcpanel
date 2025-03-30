"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Terminal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ServerControlsProps {
  serverId: string
  status: "online" | "offline" | "starting" | "stopping"
}

export function ServerControls({ serverId, status }: ServerControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Starting Minecraft server...",
    "[INFO] Loading properties...",
    "[INFO] Default game type: SURVIVAL",
    '[INFO] Preparing level "world"',
    '[INFO] Done! For help, type "help"',
  ])

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/servers/${serverId}/start`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start server")
      }

      // In a real app, you'd update the server status via WebSocket or polling
    } catch (error) {
      console.error("Error starting server:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/servers/${serverId}/stop`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to stop server")
      }

      // In a real app, you'd update the server status via WebSocket or polling
    } catch (error) {
      console.error("Error stopping server:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/servers/${serverId}/restart`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to restart server")
      }

      // In a real app, you'd update the server status via WebSocket or polling
    } catch (error) {
      console.error("Error restarting server:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      {status === "offline" && (
        <Button variant="default" size="sm" className="flex-1" onClick={handleStart} disabled={isLoading}>
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
      )}

      {(status === "online" || status === "starting") && (
        <Button variant="destructive" size="sm" className="flex-1" onClick={handleStop} disabled={isLoading}>
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleRestart}
        disabled={isLoading || status === "offline"}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Restart
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Terminal className="h-4 w-4 mr-2" />
            Logs
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Server Logs</DialogTitle>
            <DialogDescription>Live logs from your Minecraft server</DialogDescription>
          </DialogHeader>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-[300px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

