import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const servers = await db.server.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(servers)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, version, memory, cpu } = body

    // Validate input
    if (!name || !version || !memory || !cpu) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create server in database
    const server = await db.server.create({
      data: {
        name,
        version,
        memory,
        cpu,
        status: "offline",
        port: await getAvailablePort(),
      },
    })

    // In a real implementation, you would create the Docker container here
    // await createDockerContainer(server)

    return NextResponse.json(server, { status: 201 })
  } catch (error) {
    console.error("Error creating server:", error)
    return NextResponse.json({ error: "Failed to create server" }, { status: 500 })
  }
}

async function getAvailablePort(): Promise<number> {
  // In a real implementation, you would find an available port
  // This is a simplified version that returns a random port
  return 25565 + Math.floor(Math.random() * 100)
}

