"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ToolCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
}

export function ToolCard({
  title,
  description,
  children,
  className,
  ...props
}: ToolCardProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-5xl shadow-sm", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-6">
        {children}
      </CardContent>
    </Card>
  )
}
