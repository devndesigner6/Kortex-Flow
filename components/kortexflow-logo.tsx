"use client"

import { useEffect, useRef, useState } from "react"

interface KortexFlowLogoProps {
  size?: number
  className?: string
  showAnimation?: boolean
}

export function KortexFlowLogo({ size = 120, className = "", showAnimation = true }: KortexFlowLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!showAnimation) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const targetFPS = isMobile ? 30 : 60 // Lower FPS on mobile
    const frameInterval = 1000 / targetFPS
    let lastFrameTime = 0

    // Animation state
    let animationFrame: number
    let progress = 0 // 0 to 1, represents position along the path

    // Define the infinity loop path
    const centerX = size / 2
    const centerY = size / 2
    const loopWidth = size * 0.7
    const loopHeight = size * 0.35

    // Number of blockchain segments
    const segmentCount = 8

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    const draw = (currentTime: number) => {
      if (currentTime - lastFrameTime < frameInterval) {
        animationFrame = requestAnimationFrame(draw)
        return
      }
      lastFrameTime = currentTime

      if (!isVisible) {
        animationFrame = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, size, size)

      // Draw smooth side (left loop)
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      const step = isMobile ? 0.02 : 0.01
      // Left smooth loop
      for (let t = 0; t <= Math.PI; t += step) {
        const x = centerX - (loopWidth / 4) * Math.cos(t)
        const y = centerY + (loopHeight / 2) * Math.sin(2 * t)
        if (t === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw segmented side (right loop) with individual segments
      const segmentAngle = Math.PI / segmentCount
      for (let i = 0; i < segmentCount; i++) {
        const t1 = i * segmentAngle
        const t2 = (i + 1) * segmentAngle

        // Determine if this segment should be lit up
        const segmentProgress = (progress - 0.5) * segmentCount
        const isActive = progress > 0.5 && segmentProgress >= i && segmentProgress < i + 1

        ctx.strokeStyle = isActive ? "#00ff41" : "#22c55e"
        ctx.lineWidth = isActive ? 4 : 3

        ctx.beginPath()
        for (let t = t1; t <= t2; t += step) {
          const x = centerX + (loopWidth / 4) * Math.cos(t)
          const y = centerY + (loopHeight / 2) * Math.sin(2 * t)
          if (t === t1) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Draw segment dividers
        if (i < segmentCount - 1) {
          const t = t2
          const x = centerX + (loopWidth / 4) * Math.cos(t)
          const y = centerY + (loopHeight / 2) * Math.sin(2 * t)
          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw the particle
      let particleX: number, particleY: number
      const t = progress * Math.PI

      if (progress < 0.5) {
        // Particle on smooth side (left loop)
        particleX = centerX - (loopWidth / 4) * Math.cos(t)
        particleY = centerY + (loopHeight / 2) * Math.sin(2 * t)
      } else {
        // Particle on segmented side (right loop)
        particleX = centerX + (loopWidth / 4) * Math.cos(t)
        particleY = centerY + (loopHeight / 2) * Math.sin(2 * t)
      }

      if (!isMobile) {
        const gradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 8)
        gradient.addColorStop(0, "#00ff41")
        gradient.addColorStop(0.5, "#22c55e")
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particleX, particleY, 8, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bright center particle
      ctx.fillStyle = "#00ff41"
      ctx.beginPath()
      ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
      ctx.fill()

      // Update progress
      progress += 0.008
      if (progress > 1) progress = 0

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [size, showAnimation, isVisible])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="block"
        aria-label="KortexFlow Processing Loop Animation"
      />
    </div>
  )
}
