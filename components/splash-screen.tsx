"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from 'next/navigation'

export function SplashScreen() {
  const [isComplete, setIsComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    const isHomePage = pathname === '/'
    
    if (isHomePage && !hasSeenSplash) {
      setShouldShow(true)
      sessionStorage.setItem('hasSeenSplash', 'true')
    }
  }, [pathname])

  useEffect(() => {
    if (!shouldShow) return

    const timer = setTimeout(() => {
      setIsComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [shouldShow])

  useEffect(() => {
    if (!isMounted || !shouldShow) return
    
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
    const morphStartTime = 1800

    let startTime = Date.now()

    const isSmallScreen = window.innerWidth < 640
    const finalSize = isSmallScreen ? 120 : 150
    const finalCenterX = window.innerWidth / 2
    const finalCenterY = isSmallScreen ? 90 : 105

    const elegantEase = (t: number) => {
      return t < 0.5 
        ? 2 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const draw = () => {
      const elapsed = Date.now() - startTime

      if (elapsed > morphStartTime) {
        morphProgress = Math.min((elapsed - morphStartTime) / 1200, 1)
      }

      const easedMorph = elegantEase(morphProgress)

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const initialSize = Math.min(window.innerWidth, window.innerHeight) * 0.35
      const currentSize = initialSize + (finalSize - initialSize) * easedMorph

      const initialCenterX = window.innerWidth / 2
      const initialCenterY = window.innerHeight / 2
      
      const centerX = initialCenterX + (finalCenterX - initialCenterX) * easedMorph
      const centerY = initialCenterY + (finalCenterY - initialCenterY) * easedMorph

      const loopWidth = currentSize * 0.7
      const loopHeight = currentSize * 0.35

      const getInfinityPoint = (t: number) => {
        const x = centerX - (loopWidth / 4) * Math.cos(t)
        const y = centerY + (loopHeight / 2) * Math.sin(2 * t)
        return { x, y }
      }

      const subtleGlow = 0.6 + Math.sin(progress * Math.PI * 2) * 0.2

      // Draw infinity loop with refined styling
      ctx.strokeStyle = "rgb(34, 197, 94)"
      ctx.lineWidth = 2.5 * (currentSize / finalSize)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.shadowBlur = 12 * (currentSize / finalSize)
      ctx.shadowColor = `rgba(34, 197, 94, ${0.4 * subtleGlow})`

      ctx.beginPath()
      for (let t = 0; t <= Math.PI * 2; t += 0.02) {
        const point = getInfinityPoint(t)
        if (t === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()

      const t = progress * Math.PI * 2
      const particlePos = getInfinityPoint(t)

      // Refined outer glow
      const glowSize = 20 * (currentSize / finalSize)
      for (let i = 2; i > 0; i--) {
        const gradient = ctx.createRadialGradient(
          particlePos.x,
          particlePos.y,
          0,
          particlePos.x,
          particlePos.y,
          glowSize * i
        )
        gradient.addColorStop(0, `rgba(34, 197, 94, ${0.3 / i})`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particlePos.x, particlePos.y, glowSize * i, 0, Math.PI * 2)
        ctx.fill()
      }

      // Elegant particle core
      const particleSize = 7 * (currentSize / finalSize)
      const innerGradient = ctx.createRadialGradient(
        particlePos.x,
        particlePos.y,
        0,
        particlePos.x,
        particlePos.y,
        particleSize
      )
      innerGradient.addColorStop(0, "rgb(255, 255, 255)")
      innerGradient.addColorStop(0.5, "rgb(34, 197, 94)")
      innerGradient.addColorStop(1, "rgba(34, 197, 94, 0.3)")
      ctx.fillStyle = innerGradient
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(34, 197, 94, 0.6)"
      ctx.beginPath()
      ctx.arc(particlePos.x, particlePos.y, particleSize, 0, Math.PI * 2)
      ctx.fill()

      // Bright center
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(particlePos.x, particlePos.y, particleSize * 0.35, 0, Math.PI * 2)
      ctx.fill()

      progress += 0.008
      if (progress > 1) progress = 0

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isMounted, shouldShow])

  if (isComplete || !isMounted || !shouldShow) return null

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
