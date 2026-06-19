"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  fallbackClassName?: string
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-xl",
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, name = "User", size = "md", className, fallbackClassName }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  const shouldShowFallback = !src || imageError || imageLoading

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      {/* Profile Image */}
      {src && !imageError && (
        <img
          src={src || "/placeholder.svg"}
          alt={alt || name}
          className={cn(
            "w-full h-full rounded-full object-cover",
            imageLoading ? "opacity-0" : "opacity-100",
            "transition-opacity duration-200",
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Fallback Avatar */}
      {shouldShowFallback && (
        <div
          className={cn(
            "absolute inset-0 rounded-full flex items-center justify-center text-white font-semibold",
            getAvatarColor(name),
            fallbackClassName,
          )}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Loading State */}
      {imageLoading && src && !imageError && (
        <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  )
}

export { Avatar }
