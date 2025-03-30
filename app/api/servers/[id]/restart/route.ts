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

    // Check if server is offline
    if (server.status === "offline") {
      return NextResponse.json({ error: "Server is offline and cannot be restarted" }, { status: 400 })
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

    // In a real implementation, you would restart the Docker container here
    // await restartContainer(server.id)

    // Simulate server restarting
    setTimeout(async () => {
      await db.server.update({
        where: {
          id: params.id,
        },
        data: {
          status: "starting",
        },
      })

      setTimeout(async () => {
        await db.server.update({
          where: {
            id: params.id,
          },
          data: {
            status: "online",
          },
        })
      }, 3000)
    }, 2000)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error restarting server ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to restart server" }, { status: 500 })
  }
}

