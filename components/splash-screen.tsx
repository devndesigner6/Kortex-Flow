"use client"

import { useEffect, useState, useRef } from "react"

export function SplashScreen() {
  const [isComplete, setIsComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)

    let animationFrame: number
    let progress = 0
    let morphProgress = 0
    const morphStartTime = 2000

    let startTime = Date.now()

    const finalSize = window.innerWidth < 640 ? 120 : 150
    const finalCenterX = window.innerWidth / 2
    const finalCenterY = Math.min(window.innerHeight * 0.25, 200)

    const draw = () => {
      const elapsed = Date.now() - startTime

      if (elapsed > morphStartTime) {
        morphProgress = Math.min((elapsed - morphStartTime) / 1000, 1)
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const initialSize = Math.min(window.innerWidth, window.innerHeight) * 0.35
      const currentSize = initialSize + (finalSize - initialSize) * morphProgress

      const initialCenterX = window.innerWidth / 2
      const initialCenterY = window.innerHeight / 2
      const centerX = initialCenterX + (finalCenterX - initialCenterX) * morphProgress
      const centerY = initialCenterY + (finalCenterY - initialCenterY) * morphProgress

      const loopWidth = currentSize * 0.7
      const loopHeight = currentSize * 0.35

      const getInfinityPoint = (t: number) => {
        const x = centerX - (loopWidth / 4) * Math.cos(t)
        const y = centerY + (loopHeight / 2) * Math.sin(2 * t)
        return { x, y }
      }

      // Draw infinity loop
      ctx.strokeStyle = "rgb(34, 197, 94)"
      ctx.lineWidth = 3 * (currentSize / finalSize)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.shadowBlur = 15 * (currentSize / finalSize)
      ctx.shadowColor = "rgba(34, 197, 94, 0.5)"

      ctx.beginPath()
      for (let t = 0; t <= Math.PI * 2; t += 0.02) {
        const point = getInfinityPoint(t)
        if (t === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()

      // Draw particle
      const t = progress * Math.PI * 2
      const particlePos = getInfinityPoint(t)

      // Outer glow
      const glowSize = 25 * (currentSize / finalSize)
      for (let i = 3; i > 0; i--) {
        const gradient = ctx.createRadialGradient(
          particlePos.x,
          particlePos.y,
          0,
          particlePos.x,
          particlePos.y,
          glowSize * i
        )
        gradient.addColorStop(0, `rgba(0, 255, 65, ${0.3 / i})`)
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${0.2 / i})`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particlePos.x, particlePos.y, glowSize * i, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bright center
      const particleSize = 8 * (currentSize / finalSize)
      const innerGradient = ctx.createRadialGradient(
        particlePos.x,
        particlePos.y,
        0,
        particlePos.x,
        particlePos.y,
        particleSize
      )
      innerGradient.addColorStop(0, "rgb(255, 255, 255)")
      innerGradient.addColorStop(0.5, "rgb(0, 255, 65)")
      innerGradient.addColorStop(1, "rgba(34, 197, 94, 0.5)")
      ctx.fillStyle = innerGradient
      ctx.shadowBlur = 20
      ctx.shadowColor = "#00ff41"
      ctx.beginPath()
      ctx.arc(particlePos.x, particlePos.y, particleSize, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(particlePos.x, particlePos.y, particleSize * 0.4, 0, Math.PI * 2)
      ctx.fill()

      progress += 0.01
      if (progress > 1) progress = 0

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isMounted])

  if (isComplete || !isMounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ 
          opacity: 1,
          animation: 'fadeBackground 3000ms ease-out forwards'
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
