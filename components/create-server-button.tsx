"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateServerButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCreateServer = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you'd get form data and send it to the API
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Server",
          version: "1.19.2",
          memory: "2GB",
          cpu: "2 cores",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create server")
      }

      setOpen(false)
    } catch (error) {
      console.error("Error creating server:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Server</DialogTitle>
          <DialogDescription>Configure your new Minecraft server</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateServer}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="My Server" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Select defaultValue="1.19.2">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.20.1">1.20.1</SelectItem>
                  <SelectItem value="1.19.2">1.19.2</SelectItem>
                  <SelectItem value="1.18.2">1.18.2</SelectItem>
                  <SelectItem value="1.17.1">1.17.1</SelectItem>
                  <SelectItem value="1.16.5">1.16.5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memory" className="text-right">
                Memory
              </Label>
              <Select defaultValue="2GB">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select memory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1GB">1GB</SelectItem>
                  <SelectItem value="2GB">2GB</SelectItem>
                  <SelectItem value="4GB">4GB</SelectItem>
                  <SelectItem value="8GB">8GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpu" className="text-right">
                CPU
              </Label>
              <Select defaultValue="2 cores">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select CPU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 core">1 core</SelectItem>
                  <SelectItem value="2 cores">2 cores</SelectItem>
                  <SelectItem value="4 cores">4 cores</SelectItem>
                  <SelectItem value="6 cores">6 cores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Server"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

