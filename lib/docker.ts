import Docker from "dockerode"

// Initialize Docker client
const docker = new Docker()

// Define Minecraft server image
const MINECRAFT_IMAGE = "itzg/minecraft-server:latest"

export async function createDockerContainer(server: {
  id: string
  name: string
  version: string
  memory: string
  cpu: string
  port: number
}) {
  try {
    // Pull the Minecraft server image
    await pullImage(MINECRAFT_IMAGE)

    // Parse memory limit (e.g., "2GB" -> 2 * 1024 * 1024 * 1024)
    const memoryLimit = parseMemoryString(server.memory)

    // Create container
    const container = await docker.createContainer({
      name: `minecraft-${server.id}`,
      Image: MINECRAFT_IMAGE,
      Env: [
        `EULA=TRUE`,
        `VERSION=${server.version}`,
        `MEMORY=${server.memory}`,
        `TYPE=VANILLA`,
        `DIFFICULTY=normal`,
        `ALLOW_NETHER=true`,
        `ENABLE_COMMAND_BLOCK=true`,
        `MOTD=${server.name}`,
      ],
      HostConfig: {
        PortBindings: {
          "25565/tcp": [
            {
              HostPort: server.port.toString(),
            },
          ],
        },
        Memory: memoryLimit,
        MemorySwap: memoryLimit, // Disable swap
        CpusetCpus: getCpuSet(server.cpu),
        RestartPolicy: {
          Name: "unless-stopped",
        },
        Binds: [`minecraft-data-${server.id}:/data`],
      },
    })

    return container
  } catch (error) {
    console.error(`Error creating Docker container for server ${server.id}:`, error)
    throw error
  }
}

export async function startContainer(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    await container.start()
  } catch (error) {
    console.error(`Error starting Docker container for server ${serverId}:`, error)
    throw error
  }
}

export async function stopContainer(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    await container.stop()
  } catch (error) {
    console.error(`Error stopping Docker container for server ${serverId}:`, error)
    throw error
  }
}

export async function restartContainer(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    await container.restart()
  } catch (error) {
    console.error(`Error restarting Docker container for server ${serverId}:`, error)
    throw error
  }
}

export async function removeContainer(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    await container.remove({ force: true })
  } catch (error) {
    console.error(`Error removing Docker container for server ${serverId}:`, error)
    throw error
  }
}

export async function getContainerLogs(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
    })

    // Convert Buffer to string and split by newline
    return logs.toString().split("\n")
  } catch (error) {
    console.error(`Error getting logs for server ${serverId}:`, error)
    throw error
  }
}

export async function getContainerStats(serverId: string) {
  try {
    const container = docker.getContainer(`minecraft-${serverId}`)
    const stats = await container.stats({ stream: false })

    // Calculate CPU usage percentage
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
    const systemCpuDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
    const cpuUsage = (cpuDelta / systemCpuDelta) * 100

    // Calculate memory usage percentage
    const memoryUsage = (stats.memory_stats.usage / stats.memory_stats.limit) * 100

    return {
      cpuUsage: Math.round(cpuUsage),
      memoryUsage: Math.round(memoryUsage),
      memoryUsedMB: Math.round(stats.memory_stats.usage / (1024 * 1024)),
      memoryLimitMB: Math.round(stats.memory_stats.limit / (1024 * 1024)),
    }
  } catch (error) {
    console.error(`Error getting stats for server ${serverId}:`, error)
    throw error
  }
}

async function pullImage(image: string) {
  try {
    await docker.pull(image)
  } catch (error) {
    console.error(`Error pulling Docker image ${image}:`, error)
    throw error
  }
}

function parseMemoryString(memory: string): number {
  const value = Number.parseInt(memory.replace(/[^0-9]/g, ""))
  const unit = memory.replace(/[0-9]/g, "").toLowerCase()

  switch (unit) {
    case "gb":
      return value * 1024 * 1024 * 1024
    case "mb":
      return value * 1024 * 1024
    default:
      return value * 1024 * 1024 * 1024 // Default to GB
  }
}

function getCpuSet(cpu: string): string {
  // Parse CPU cores (e.g., "2 cores" -> "0,1")
  const cores = Number.parseInt(cpu.replace(/[^0-9]/g, ""))
  return Array.from({ length: cores }, (_, i) => i).join(",")
}

