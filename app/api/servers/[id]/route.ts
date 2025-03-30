import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const server = await db.server.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    return NextResponse.json(server)
  } catch (error) {
    console.error(`Error fetching server ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch server" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    // In a real implementation, you would stop and remove the Docker container here
    // await stopAndRemoveContainer(server.id)

    // Delete server from database
    await db.server.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting server ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete server" }, { status: 500 })
  }
}

