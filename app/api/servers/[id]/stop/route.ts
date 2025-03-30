import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if server exists
    const server = await db.server.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Check if server is already stopped
    if (server.status === "offline" || server.status === "stopping") {
      return NextResponse.json({ error: "Server is already stopped or stopping" }, { status: 400 })
    }

    // Update server status to stopping
    await db.server.update({
      where: {
        id: params.id,
      },
      data: {
        status: "stopping",
      },
    })

    // In a real implementation, you would stop the Docker container here
    // await stopContainer(server.id)

    // Simulate server stopping
    setTimeout(async () => {
      await db.server.update({
        where: {
          id: params.id,
        },
        data: {
          status: "offline",
        },
      })
    }, 3000)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error stopping server ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to stop server" }, { status: 500 })
  }
}

