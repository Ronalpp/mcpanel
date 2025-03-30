"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface ServerStatsProps {
  memory: string
  cpu: string
}

export function ServerStats({ memory, cpu }: ServerStatsProps) {
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [cpuUsage, setCpuUsage] = useState(0)

  // Simulate changing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryUsage(Math.floor(Math.random() * 100))
      setCpuUsage(Math.floor(Math.random() * 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Memory</span>
          <span>
            {memoryUsage}% of {memory}
          </span>
        </div>
        <Progress value={memoryUsage} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>CPU</span>
          <span>
            {cpuUsage}% of {cpu}
          </span>
        </div>
        <Progress value={cpuUsage} />
      </div>
    </div>
  )
}

