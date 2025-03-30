import type { Server as HttpServer } from "http"
import { Server as WebSocketServer } from "socket.io"
import { getContainerStats, getContainerLogs } from "./docker"
import { db } from "./db"

let io: WebSocketServer

export function initWebSocketServer(httpServer: HttpServer) {
  io = new WebSocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Handle client subscribing to server updates
    socket.on("subscribe", async (serverId) => {
      socket.join(`server:${serverId}`)
      console.log(`Client ${socket.id} subscribed to server ${serverId}`)

      // Send initial server data
      const server = await db.server.findUnique({
        where: { id: serverId },
      })

      if (server) {
        socket.emit("server:update", server)
      }
    })

    // Handle client unsubscribing from server updates
    socket.on("unsubscribe", (serverId) => {
      socket.leave(`server:${serverId}`)
      console.log(`Client ${socket.id} unsubscribed from server ${serverId}`)
    })

    // Handle client requesting logs
    socket.on("logs:request", async (serverId) => {
      try {
        if (serverId) {
          const logs = await getContainerLogs(serverId)
          socket.emit("logs:update", { serverId, logs })
        }
      } catch (error) {
        console.error(`Error fetching logs for ${serverId}:`, error)
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  // Start the stats polling for active servers
  startStatsPolling()

  return io
}

// Function to emit server updates to all subscribed clients
export function emitServerUpdate(serverId: string, data: any) {
  if (io) {
    io.to(`server:${serverId}`).emit("server:update", data)
  }
}

// Function to emit log updates to all subscribed clients
export function emitLogUpdate(serverId: string, logs: string[]) {
  if (io) {
    io.to(`server:${serverId}`).emit("logs:update", { serverId, logs })
  }
}

// Poll for server stats and emit updates
function startStatsPolling() {
  setInterval(async () => {
    try {
      // Get all online servers
      const servers = await db.server.findMany({
        where: { status: "online" },
      })

      // Update stats for each server
      for (const server of servers) {
        try {
          const stats = await getContainerStats(server.id)
          emitServerUpdate(server.id, { ...server, stats })
        } catch (error) {
          console.error(`Error updating stats for server ${server.id}:`, error)
        }
      }
    } catch (error) {
      console.error("Error polling server stats:", error)
    }
  }, 5000) // Poll every 5 seconds
}

