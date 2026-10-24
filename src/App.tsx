import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, CameraControls, Line, RoundedBox, Text, useTexture } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Copy,
  Crosshair,
  GraduationCap,
  Mail,
  MapPin,
  Radio,
  RotateCcw,
  X,
} from 'lucide-react'
import * as THREE from 'three'

type PanelName = 'projects' | 'experience' | 'skills' | 'profile' | 'contact'
type FocusName = 'overview' | PanelName
type ShotStatus = 'ready' | 'shooting' | 'made'
const BALL_RADIUS = 0.13
const CONTACT_EMAIL = 'matifandy@gmail.com'
const contactLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/matiasfandino/?isSelfProfile=true' },
  { label: 'GitHub', href: 'https://github.com/matifandy8' },
]

const cameraViews: Record<
  FocusName,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  overview: { position: [0, 16, 28], target: [0, 0.3, 0] },
  experience: { position: [5, 8, 9], target: [0, 0.4, -2.8] },
  projects: { position: [3.8, 7.8, 3.8], target: [0, 0.7, -3.2] },
  skills: { position: [5.4, 4.7, 6.2], target: [0, 0.16, 0] },
  profile: { position: [8.65, 4.8, 8], target: [5, 1, 0.45] },
  contact: { position: [0, 8, 15], target: [0, 2.7, 0] },
}

const courtLines = [
  [[-8, 0.105, -4.5], [8, 0.105, -4.5]],
  [[-8, 0.105, 4.5], [8, 0.105, 4.5]],
  [[-8, 0.105, -4.5], [-8, 0.105, 4.5]],
  [[8, 0.105, -4.5], [8, 0.105, 4.5]],
  [[0, 0.105, -4.5], [0, 0.105, 4.5]],
  [[-1.45, 0.105, -4.5], [-1.45, 0.105, -1.8]],
  [[1.45, 0.105, -4.5], [1.45, 0.105, -1.8]],
  [[-1.45, 0.105, -1.8], [1.45, 0.105, -1.8]],
  [[-1.45, 0.105, 4.5], [-1.45, 0.105, 1.8]],
  [[1.45, 0.105, 4.5], [1.45, 0.105, 1.8]],
  [[-1.45, 0.105, 1.8], [1.45, 0.105, 1.8]],
  [[-7.5, 0.105, -4.5], [-7.5, 0.105, -3.04]],
  [[7.5, 0.105, -4.5], [7.5, 0.105, -3.04]],
  [[-7.5, 0.105, 4.5], [-7.5, 0.105, 3.04]],
  [[7.5, 0.105, 4.5], [7.5, 0.105, 3.04]],
] as [number, number, number][][]

const projects = [
  {
    index: '01',
    name: 'Pronounce App',
    type: 'PRODUCT · LANGUAGE LEARNING',
    description:
      'A pronunciation practice app designed to make language learning more accessible.',
    tag: 'EdTech',
  },
  {
    index: '02',
    name: 'AI Knowledge System',
    type: 'PERSONAL KNOWLEDGE · RAG',
    description:
      'A retrieval-augmented generation system connected to Obsidian, built to query and make better use of a personal knowledge base.',
    tag: 'AI / RAG',
  },
]

const experience = [
  {
    period: '01',
    role: 'Frontend Developer',
    company: 'Hogarth',
    detail: 'Web interfaces built with React, Next.js, TypeScript, and Tailwind CSS.',
  },
  {
    period: '02',
    role: 'Programming Instructor',
    company: 'Alianza Cultural Uruguay - EE.UU. · Superprof',
    detail: 'Programming, logic, Python, JavaScript, and computational thinking.',
  },
  {
    period: '03',
    role: 'WordPress Developer',
    company: 'Freelance',
    detail: 'Websites and digital solutions for independent projects.',
  },
  {
    period: '04',
    role: 'Sports Statistician',
    company: 'Genius Sports',
    detail: 'Sports statistics and real-time data collection.',
  },
]

const playerStats = [
  {
    code: 'PTS',
    label: 'BUILD',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    code: 'AST',
    label: 'TEACH',
    skills: ['Computational thinking', 'Python', 'JavaScript', 'Logic'],
  },
  {
    code: 'REB',
    label: 'ANALYZE',
    skills: ['Sports statistics', 'RAG', 'Knowledge systems'],
  },
]

function arcPoints(
  radius: number,
  startAngle: number,
  endAngle: number,
  segments = 72,
  y = 0.04,
  zOffset = 0,
): [number, number, number][] {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = startAngle + ((endAngle - startAngle) * index) / segments
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius + zOffset]
  })
}

function CourtLines() {
  const threePointAngle = Math.asin(1 / 3.85)

  return (
    <group>
      {courtLines.map((points, index) => (
        <Line
          key={`court-line-${index}`}
          points={points}
          color="#ebe6dc"
          lineWidth={1.5}
          transparent
          opacity={0.64}
        />
      ))}
      <Line
        points={arcPoints(1.05, 0, Math.PI * 2, 72, 0.105)}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.64}
      />
      <Line
        points={arcPoints(1.03, 0, Math.PI * 2, 64, 0.105, -1.8)}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.64}
      />
      <Line
        points={arcPoints(1.03, 0, Math.PI * 2, 64, 0.105, 1.8)}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.64}
      />
      <Line
        points={arcPoints(
          3.85,
          threePointAngle,
          Math.PI - threePointAngle,
          72,
          0.105,
          -4.05,
        )}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />
      <Line
        points={arcPoints(
          3.85,
          Math.PI + threePointAngle,
          Math.PI * 2 - threePointAngle,
          72,
          0.105,
          4.05,
        )}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />
    </group>
  )
}

function InteractiveSign({
  label,
  position,
}: {
  label: string
  position: [number, number, number]
}) {
  return (
    <Billboard position={position}>
      <group>
        <Text
          position={[0, 0, 0]}
          fontSize={0.14}
          color="#d6c3b6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          raycast={() => {}}
        >
          {label}
        </Text>
        <Line
          points={[
            [-0.15, -0.1, 0],
            [0.15, -0.1, 0],
          ]}
          color="#bd694b"
          lineWidth={1}
          transparent
          opacity={0.65}
        />
      </group>
    </Billboard>
  )
}

function LEDBoardIcon({
  icon,
  width,
  height,
}: {
  icon: string
  width: number
  height: number
}) {
  const texture = useTexture(icon)

  return (
    <mesh position={[-width / 2 + height * 0.72, 0, 0.096]}>
      <planeGeometry args={[height * 0.58, height * 0.58]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.04}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

type LEDAd = {
  text: string
  effect: 'scroll' | 'blink' | 'static'
  duration: number
}

const perimeterAds: Record<string, LEDAd[]> = {
  LinkedIn: [
    { text: 'MATIAS FANDINO · CONNECT WITH ME', effect: 'scroll', duration: 6000 },
    { text: 'OPEN LINKEDIN PROFILE', effect: 'static', duration: 4000 },
  ],
  GitHub: [
    { text: 'MATIFANDY8 · SELECTED CODE', effect: 'scroll', duration: 6000 },
    { text: 'EXPLORE MY PROJECTS', effect: 'static', duration: 4000 },
  ],
  Email: [
    { text: CONTACT_EMAIL.toUpperCase(), effect: 'scroll', duration: 7000 },
    { text: 'LET’S BUILD SOMETHING', effect: 'blink', duration: 4000 },
  ],
}

function LEDMarquee({
  label,
  ads,
  hasIcon,
  width,
  height,
}: {
  label: string
  ads: LEDAd[]
  hasIcon: boolean
  width: number
  height: number
}) {
  const [adIndex, setAdIndex] = useState(0)
  const activeAd = ads[adIndex]
  const elapsed = useRef(0)
  const frameAccumulator = useRef(0)
  const { canvas, texture } = useMemo(() => {
    const screen = document.createElement('canvas')
    screen.width = 1024
    screen.height = Math.max(72, Math.round((1024 * height) / width))
    const ledTexture = new THREE.CanvasTexture(screen)
    ledTexture.colorSpace = THREE.SRGBColorSpace
    ledTexture.minFilter = THREE.LinearFilter
    ledTexture.magFilter = THREE.LinearFilter
    return { canvas: screen, texture: ledTexture }
  }, [height, width])
  const textureRef = useRef(texture)
  const dotPattern = useMemo(() => {
    const tile = document.createElement('canvas')
    tile.width = 10
    tile.height = 10
    const tileContext = tile.getContext('2d')
    if (!tileContext) throw new Error('Unable to create the LED pixel pattern.')
    tileContext.fillStyle = '#171918'
    tileContext.fillRect(0, 0, tile.width, tile.height)
    tileContext.beginPath()
    tileContext.arc(5, 5, Math.max(0.7, canvas.height / 120), 0, Math.PI * 2)
    tileContext.fillStyle = '#48443d'
    tileContext.fill()
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create the LED screen context.')
    const pattern = context.createPattern(tile, 'repeat')
    if (!pattern) throw new Error('Unable to create the LED pixel pattern.')
    return pattern
  }, [canvas])

  useEffect(() => {
    elapsed.current = 0
    const timeoutId = window.setTimeout(
      () => setAdIndex((index) => (index + 1) % ads.length),
      activeAd.duration,
    )
    return () => window.clearTimeout(timeoutId)
  }, [activeAd.duration, adIndex, ads])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    elapsed.current += delta
    frameAccumulator.current += delta
    if (frameAccumulator.current < 1 / 24) return
    frameAccumulator.current %= 1 / 24

    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#111312'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalAlpha = 0.68
    context.fillStyle = dotPattern
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalAlpha = 1

    const contentLeft = hasIcon
      ? Math.round((height * 0.96 * canvas.width) / width)
      : 34
    const contentWidth = canvas.width - contentLeft - 28
    context.textAlign = 'left'
    context.textBaseline = 'middle'
    context.font = `700 ${Math.max(11, Math.round(canvas.height * 0.13))}px "Courier New", monospace`
    context.fillStyle = '#aaa79d'
    context.fillText(
      `${label.toUpperCase()}  /  COURTSIDE`,
      contentLeft,
      canvas.height * 0.26,
    )
    context.fillStyle = '#df9574'
    let fontSize = Math.max(12, Math.round(canvas.height * 0.28))
    context.font = `700 ${fontSize}px "Courier New", monospace`
    while (
      context.measureText(activeAd.text).width > contentWidth * 0.94 &&
      fontSize > 12
    ) {
      fontSize -= 2
      context.font = `700 ${fontSize}px "Courier New", monospace`
    }

    context.save()
    context.beginPath()
    context.rect(contentLeft, canvas.height * 0.39, contentWidth, canvas.height * 0.56)
    context.clip()
    if (activeAd.effect === 'static') {
      context.textAlign = 'center'
      context.fillText(
        activeAd.text,
        contentLeft + contentWidth / 2,
        canvas.height * 0.68,
      )
    } else if (
      activeAd.effect === 'blink' &&
      Math.floor(elapsed.current / 0.8) % 2 === 1
    ) {
      context.restore()
      textureRef.current.needsUpdate = true
      return
    } else {
      context.textAlign = 'left'
      const separator = '     /     '
      const message = `${activeAd.text}${separator}`
      const messageWidth = context.measureText(message).width
      const offset = (elapsed.current * 105) % messageWidth
      const firstX = contentLeft + contentWidth - offset
      context.fillText(message, firstX, canvas.height * 0.68)
      context.fillText(message, firstX + messageWidth, canvas.height * 0.68)
    }
    context.restore()
    textureRef.current.needsUpdate = true
  })

  return (
    <mesh position={[0, 0, 0.086]} raycast={() => {}}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

function LEDPerimeterBoard({
  label,
  href,
  detail,
  icon,
  position,
  rotation,
  size,
}: {
  label: string
  href: string
  detail: string
  icon?: string
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number]
}) {
  const [width, height] = size

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation()
        window.open(href, '_blank', 'noopener,noreferrer')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.16]} />
        <meshStandardMaterial color="#242725" metalness={0.38} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.084]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#171a19" />
      </mesh>
      <LEDMarquee
        label={label}
        ads={perimeterAds[label] ?? [{ text: detail, effect: 'scroll', duration: 6000 }]}
        hasIcon={Boolean(icon)}
        width={width}
        height={height}
      />
      {icon && <LEDBoardIcon icon={icon} width={width} height={height} />}
      <Line
        points={[
          [-width * 0.48, height * 0.39, 0.09],
          [width * 0.48, height * 0.39, 0.09],
        ]}
        color="#bd694b"
        lineWidth={1.5}
      />
      {[-1, 1].flatMap((xSide) =>
        [-1, 1].map((ySide) => (
          <mesh
            key={`${xSide}-${ySide}`}
            position={[xSide * width * 0.48, ySide * height * 0.4, 0.09]}
          >
            <sphereGeometry args={[0.025, 12, 8]} />
            <meshBasicMaterial color="#df9574" />
          </mesh>
        )),
      )}
    </group>
  )
}

const sevenSegmentDigits: Record<string, readonly string[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
}

const sevenSegmentBars = [
  { id: 'a', position: [0, 0.42, 0], size: [0.62, 0.1, 0.035] },
  { id: 'b', position: [0.34, 0.21, 0], size: [0.1, 0.34, 0.035] },
  { id: 'c', position: [0.34, -0.21, 0], size: [0.1, 0.34, 0.035] },
  { id: 'd', position: [0, -0.42, 0], size: [0.62, 0.1, 0.035] },
  { id: 'e', position: [-0.34, -0.21, 0], size: [0.1, 0.34, 0.035] },
  { id: 'f', position: [-0.34, 0.21, 0], size: [0.1, 0.34, 0.035] },
  { id: 'g', position: [0, 0, 0], size: [0.62, 0.1, 0.035] },
] as const

function LEDDisplay({
  value,
  position,
  digitWidth,
  maxWidth,
  color,
}: {
  value: string
  position: [number, number, number]
  digitWidth: number
  maxWidth: number
  color: string
}) {
  const advance = digitWidth * 1.25
  const displayWidth = value.length * advance - digitWidth * 0.25
  const scale = Math.min(1, maxWidth / displayWidth)

  return (
    <group position={position} scale={scale}>
      {value.split('').map((character, index) => {
        const x = -displayWidth / 2 + digitWidth / 2 + index * advance
        if (character === ':') {
          return (
            <group key={`${character}-${index}`} position={[x, 0, 0]}>
              {[0.2, -0.2].map((y) => (
                <mesh key={y} position={[0, y * digitWidth, 0]}>
                  <circleGeometry args={[digitWidth * 0.055, 12]} />
                  <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
              ))}
            </group>
          )
        }

        const litSegments = sevenSegmentDigits[character] ?? []
        return (
          <group key={`${character}-${index}`} position={[x, 0, 0]}>
            {sevenSegmentBars.map((segment) => (
              <mesh
                key={segment.id}
                position={[
                  segment.position[0] * digitWidth,
                  segment.position[1] * digitWidth,
                  segment.position[2],
                ]}
              >
                <boxGeometry
                  args={[
                    segment.size[0] * digitWidth,
                    segment.size[1] * digitWidth,
                    segment.size[2],
                  ]}
                />
                <meshBasicMaterial
                  color={litSegments.includes(segment.id) ? color : '#3b2925'}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

function CourtScoreboard({
  shotsAttempted,
  shotsMade,
  shotStatus,
}: {
  shotsAttempted: number
  shotsMade: number
  shotStatus: ShotStatus
}) {
  const [localTime, setLocalTime] = useState(() =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Montevideo',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date()),
  )

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'America/Montevideo',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23',
        }).format(new Date()),
      )
    }
    const intervalId = window.setInterval(updateTime, 30_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <group position={[0, 5.15, -4.84]}>
      <RoundedBox
        args={[5.8, 2.05, 0.24]}
        radius={0.065}
        smoothness={4}
        position={[0, 0, -0.04]}
        castShadow
      >
        <meshStandardMaterial color="#555650" metalness={0.42} roughness={0.46} />
      </RoundedBox>
      <mesh position={[0, 0, 0.088]}>
        <planeGeometry args={[5.62, 1.87]} />
        <meshBasicMaterial color="#232624" />
      </mesh>
      {[-1.82, 1.82].map((x) => (
        <mesh key={x} position={[x, -1.82, -0.17]} castShadow>
          <boxGeometry args={[0.1, 2.42, 0.12]} />
          <meshStandardMaterial color="#92938c" metalness={0.46} roughness={0.44} />
        </mesh>
      ))}
      <Line
        points={[
          [-2.7, 0.72, 0.105],
          [2.7, 0.72, 0.105],
        ]}
        color="#bd694b"
        lineWidth={2}
      />
      <Text
        position={[-2.58, 0.86, 0.11]}
        fontSize={0.095}
        color="#a8aaa2"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.1}
        raycast={() => {}}
      >
        MF  /  COURTSIDE
      </Text>
      <Text
        position={[2.58, 0.86, 0.11]}
        fontSize={0.095}
        color="#a8aaa2"
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.1}
        raycast={() => {}}
      >
        PORTFOLIO DISPLAY
      </Text>
      <Text
        position={[0, 0.58, 0.11]}
        fontSize={0.085}
        color="#a8aaa2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        raycast={() => {}}
      >
        MONTEVIDEO · UTC−3
      </Text>
      <LEDDisplay
        value={localTime}
        position={[0, 0.25, 0.14]}
        digitWidth={0.48}
        maxWidth={2.05}
        color="#ed644b"
      />
      <Text
        position={[-2.02, 0.49, 0.11]}
        fontSize={0.11}
        color="#a8aaa2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        raycast={() => {}}
      >
        MADE
      </Text>
      <LEDDisplay
        value={String(shotsMade).padStart(2, '0')}
        position={[-2.02, 0.04, 0.14]}
        digitWidth={0.62}
        maxWidth={1.08}
        color="#ed644b"
      />
      <Text
        position={[-2.02, -0.52, 0.11]}
        fontSize={0.08}
        color="#8f918a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        raycast={() => {}}
      >
        SHOTS CONVERTED
      </Text>
      <Text
        position={[2.02, 0.49, 0.11]}
        fontSize={0.11}
        color="#a8aaa2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        raycast={() => {}}
      >
        ATTEMPTS
      </Text>
      <LEDDisplay
        value={String(shotsAttempted).padStart(2, '0')}
        position={[2.02, 0.04, 0.14]}
        digitWidth={0.62}
        maxWidth={1.08}
        color="#ed644b"
      />
      <Text
        position={[2.02, -0.52, 0.11]}
        fontSize={0.08}
        color={shotStatus === 'shooting' ? '#df9574' : '#8f918a'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        raycast={() => {}}
      >
        {shotStatus === 'shooting' ? 'SHOT IN THE AIR' : 'LIVE COUNT'}
      </Text>
      <Text
        position={[0, -0.61, 0.11]}
        fontSize={0.12}
        color="#f0e9df"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.045}
        raycast={() => {}}
      >
        MATÍAS FANDIÑO · DEVELOPER / EDUCATOR
      </Text>
      <Line
        points={[
          [-1.22, -0.7, 0.105],
          [-1.22, 0.66, 0.105],
        ]}
        color="#5b625e"
        lineWidth={1}
      />
      <Line
        points={[
          [1.22, -0.7, 0.105],
          [1.22, 0.66, 0.105],
        ]}
        color="#5b625e"
        lineWidth={1}
      />
      {[
        [-2.67, 0.86],
        [2.67, 0.86],
        [-2.67, -0.86],
        [2.67, -0.86],
      ].map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.115]}>
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color="#bd694b" />
        </mesh>
      ))}
    </group>
  )
}

function PlayerFigure({ onOpen }: { onOpen: () => void }) {
  const figureRef = useRef<THREE.Group>(null)
  const isHovered = useRef(false)
  const idleTime = useRef(0)

  useFrame((_, delta) => {
    if (!figureRef.current) return
    idleTime.current += delta
    figureRef.current.rotation.y = Math.sin(idleTime.current * 0.55) * 0.035
    const targetScale = isHovered.current ? 1.06 : 1
    const scale = THREE.MathUtils.damp(figureRef.current.scale.x, targetScale, 8, delta)
    figureRef.current.scale.setScalar(scale)
  })

  const setHover = (hovered: boolean) => {
    isHovered.current = hovered
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }

  return (
    <group
      ref={figureRef}
      position={[5, 0.1, 0.45]}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
    >
      <mesh position={[0, 1.08, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.36, 4, 10]} />
        <meshStandardMaterial color="#9b684e" roughness={0.84} />
      </mesh>
      <mesh position={[0, 1.43, 0]} castShadow>
        <capsuleGeometry args={[0.255, 0.3, 6, 16]} />
        <meshStandardMaterial color="#274b77" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <capsuleGeometry args={[0.29, 0.22, 4, 12]} />
        <meshStandardMaterial color="#203e65" roughness={0.76} />
      </mesh>
      <mesh position={[0, 1.03, 0]}>
        <boxGeometry args={[0.4, 0.035, 0.33]} />
        <meshStandardMaterial color="#e7e1d8" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.77, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.018, 8, 24]} />
        <meshStandardMaterial color="#e7e1d8" roughness={0.72} />
      </mesh>
      <mesh position={[-0.204, 1.43, 0.113]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.028, 0.48, 0.018]} />
        <meshBasicMaterial color="#e7e1d8" />
      </mesh>
      <mesh position={[0.204, 1.43, 0.113]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.028, 0.48, 0.018]} />
        <meshBasicMaterial color="#e7e1d8" />
      </mesh>
      <Text
        position={[0, 1.48, 0.258]}
        fontSize={0.15}
        color="#df9574"
        anchorX="center"
        anchorY="middle"
        raycast={() => {}}
      >
        08
      </Text>
      <mesh position={[0, 1.015, 0.18]}>
        <sphereGeometry args={[0.018, 10, 8]} />
        <meshStandardMaterial color="#bd694b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.91, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.18, 16]} />
        <meshStandardMaterial color="#9b684e" roughness={0.84} />
      </mesh>
      <mesh position={[0, 2.08, 0]} castShadow>
        <sphereGeometry args={[0.29, 32, 28]} />
        <meshStandardMaterial color="#9b684e" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.11, -0.045]} scale={[1, 0.88, 0.86]} castShadow>
        <sphereGeometry args={[0.29, 32, 20]} />
        <meshStandardMaterial color="#38251f" roughness={0.84} />
      </mesh>
      <mesh
        position={[0.055, 2.285, 0.15]}
        rotation={[0.08, -0.18, 0.12]}
        scale={[1.35, 0.48, 0.62]}
        castShadow
      >
        <sphereGeometry args={[0.17, 24, 16]} />
        <meshStandardMaterial color="#493027" roughness={0.78} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={`face-${side}`}>
          <mesh position={[side * 0.285, 2.045, 0]} castShadow>
            <sphereGeometry args={[0.075, 20, 16]} />
            <meshStandardMaterial color="#9b684e" roughness={0.84} />
          </mesh>
          <mesh position={[side * 0.095, 2.105, 0.256]}>
            <sphereGeometry args={[0.063, 20, 16]} />
            <meshStandardMaterial color="#f1ece3" roughness={0.45} />
          </mesh>
          <mesh position={[side * 0.095, 2.105, 0.309]}>
            <sphereGeometry args={[0.039, 18, 14]} />
            <meshStandardMaterial color="#302723" roughness={0.5} />
          </mesh>
          <mesh position={[side * 0.095 - 0.012, 2.123, 0.342]}>
            <sphereGeometry args={[0.012, 12, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh
            position={[side * 0.095, 2.195, 0.25]}
            rotation={[0, 0, Math.PI / 2 + side * 0.12]}
          >
            <capsuleGeometry args={[0.024, 0.11, 4, 8]} />
            <meshStandardMaterial color="#38251f" roughness={0.82} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.035, 0.281]}>
        <sphereGeometry args={[0.042, 16, 12]} />
        <meshStandardMaterial color="#7e4e3b" roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.965, 0.255]} scale={[0.8, 0.56, 0.3]}>
        <sphereGeometry args={[0.26, 24, 16]} />
        <meshStandardMaterial color="#493027" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.99, 0.328]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.009, 0.06, 3, 6]} />
        <meshBasicMaterial color="#e1c5ad" />
      </mesh>
      <mesh position={[0, 2.035, 0.299]}>
        <sphereGeometry args={[0.025, 12, 10]} />
        <meshStandardMaterial color="#8a5942" roughness={0.84} />
      </mesh>
      <group>
        <mesh position={[-0.32, 1.49, 0]} rotation={[0, 0, -0.46]} castShadow>
          <capsuleGeometry args={[0.075, 0.22, 5, 10]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        <mesh position={[-0.45, 1.31, 0.075]} rotation={[0, 0, -0.58]} castShadow>
          <capsuleGeometry args={[0.068, 0.22, 5, 10]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        <mesh position={[-0.54, 1.15, 0.13]} castShadow>
          <sphereGeometry args={[0.075, 16, 14]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        <mesh position={[-0.49, 1.1, 0.23]} rotation={[0.2, 0, -0.5]} castShadow>
          <capsuleGeometry args={[0.028, 0.12, 4, 8]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>

        <mesh position={[0.32, 1.49, 0]} rotation={[0, 0, 0.46]} castShadow>
          <capsuleGeometry args={[0.075, 0.22, 5, 10]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        <mesh position={[0.43, 1.25, -0.005]} rotation={[0, 0, 0.16]} castShadow>
          <capsuleGeometry args={[0.068, 0.24, 5, 10]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        <mesh position={[0.45, 1.075, 0.005]} castShadow>
          <sphereGeometry args={[0.073, 16, 14]} />
          <meshStandardMaterial color="#9b684e" roughness={0.84} />
        </mesh>
        {[-1, 0, 1].map((finger) => (
          <mesh
            key={finger}
            position={[0.45 + finger * 0.035, 1.015, 0.025]}
            rotation={[0, 0, finger * 0.14]}
            castShadow
          >
            <capsuleGeometry args={[0.018, 0.055, 3, 6]} />
            <meshStandardMaterial color="#9b684e" roughness={0.84} />
          </mesh>
        ))}
      </group>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.155, 0.82, 0]} castShadow>
            <capsuleGeometry args={[0.115, 0.2, 4, 10]} />
            <meshStandardMaterial color="#203e65" roughness={0.76} />
          </mesh>
          <mesh position={[side * 0.155, 0.57, 0]}>
            <cylinderGeometry args={[0.079, 0.079, 0.13, 12]} />
            <meshStandardMaterial color="#e7e1d8" roughness={0.72} />
          </mesh>
          <mesh position={[side * 0.155, 0.34, 0]} castShadow>
            <capsuleGeometry args={[0.075, 0.36, 4, 10]} />
            <meshStandardMaterial color="#9b684e" roughness={0.84} />
          </mesh>
          <mesh position={[side * 0.155, 0.13, 0.07]} castShadow>
            <RoundedBox args={[0.25, 0.16, 0.4]} radius={0.055} smoothness={3}>
              <meshStandardMaterial color="#274b77" roughness={0.72} />
            </RoundedBox>
          </mesh>
          <mesh position={[side * 0.155, 0.09, 0.13]}>
            <boxGeometry args={[0.22, 0.035, 0.19]} />
            <meshStandardMaterial color="#343635" roughness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.61, 1.09, 0.15]} castShadow>
        <sphereGeometry args={[0.18, 24, 20]} />
        <meshStandardMaterial color="#bd694b" roughness={0.7} />
      </mesh>
      <Line
        points={Array.from({ length: 49 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 48
          return [
            -0.61 + Math.cos(angle) * 0.183,
            1.09,
            0.15 + Math.sin(angle) * 0.183,
          ]
        })}
        color="#613829"
        lineWidth={1}
      />
      <Line
        points={Array.from({ length: 49 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 48
          return [
            -0.61,
            1.09 + Math.cos(angle) * 0.183,
            0.15 + Math.sin(angle) * 0.183,
          ]
        })}
        color="#613829"
        lineWidth={1}
      />
    </group>
  )
}

function Hoop({
  onOpen,
  end,
}: {
  onOpen: () => void
  end: 'far' | 'near'
}) {
  return (
    <group
      position={[0, 0.09, end === 'far' ? -4.1 : 4.1]}
      rotation={[0, end === 'far' ? 0 : Math.PI, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh position={[0, 1.09, -1.05]}>
        <boxGeometry args={[0.14, 2.18, 0.14]} />
        <meshStandardMaterial color="#96958e" metalness={0.42} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.05, -1.05]}>
        <boxGeometry args={[0.9, 0.1, 0.68]} />
        <meshStandardMaterial color="#686a63" metalness={0.35} roughness={0.48} />
      </mesh>
      <mesh position={[0, 2.2, -0.8]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[0.09, 0.09, 0.72]} />
        <meshStandardMaterial color="#96958e" metalness={0.42} roughness={0.42} />
      </mesh>
      <mesh position={[0, 2.12, -0.48]} castShadow>
        <boxGeometry args={[1.5, 0.84, 0.09]} />
        <meshBasicMaterial
          color="#e7e1d8"
        />
      </mesh>
      <mesh position={[0, 2.12, -0.416]}>
        <boxGeometry args={[0.5, 0.28, 0.018]} />
        <meshBasicMaterial color="#b8613f" />
      </mesh>
      <mesh position={[0, 1.83, -0.22]}>
        <boxGeometry args={[0.055, 0.05, 0.44]} />
        <meshStandardMaterial color="#a9a49a" metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.024, 12, 48]} />
        <meshBasicMaterial color="#d98059" />
      </mesh>
      {Array.from({ length: 16 }, (_, index) => {
        const ringAngle = (Math.PI * 2 * index) / 16
        return (
          <Line
            key={`net-thread-${index}`}
            points={[
              [Math.cos(ringAngle) * 0.19, 1.83, Math.sin(ringAngle) * 0.19],
              [Math.cos(ringAngle) * 0.1, 1.61, Math.sin(ringAngle) * 0.1],
            ]}
            color="#e6a382"
            lineWidth={1.2}
            transparent
            opacity={0.72}
          />
        )
      })}
      <Line
        points={arcPoints(0.1, 0, Math.PI * 2, 32, 1.61)}
        color="#e6a382"
        lineWidth={0.8}
        transparent
        opacity={0.72}
      />
    </group>
  )
}

function AttackZone({
  onOpen,
  end,
}: {
  onOpen: () => void
  end: 'far' | 'near'
}) {
  return (
    <group
      position={[0, 0.1, end === 'far' ? -3.15 : 3.15]}
      rotation={[0, end === 'far' ? 0 : Math.PI, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 2.7]} />
        <meshBasicMaterial
          color="#bd694b"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={[
          [-1.45, 0, -1.35],
          [-1.45, 0, 1.35],
          [1.45, 0, 1.35],
          [1.45, 0, -1.35],
          [-1.45, 0, -1.35],
        ]}
        color="#d98059"
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />
      <Line
        points={[
          [-1.45, 0.002, 1.35],
          [1.45, 0.002, 1.35],
        ]}
        color="#ebe6dc"
        lineWidth={1.5}
        transparent
        opacity={0.75}
      />
    </group>
  )
}

function Basketball({
  onShoot,
  onShotMade,
  shotRequest,
}: {
  onShoot: () => void
  onShotMade: () => void
  shotRequest: number
}) {
  const ballRef = useRef<THREE.Group>(null)
  const targetScale = useRef(1)
  const idleElapsed = useRef(0)
  const shotElapsed = useRef(0)
  const lastShotRequest = useRef(0)
  const shotActive = useRef(false)
  const shotStart = new THREE.Vector3(0, 0.22, 0)
  const hoopCenter = new THREE.Vector3(0, 1.92, -4.1)
  const shotDuration = 1.05
  const dropDuration = 0.45
  const returnDuration = 0.7

  useFrame((_, delta) => {
    if (!ballRef.current) return
    const frameDelta = Math.min(delta, 0.05)

    if (shotRequest !== lastShotRequest.current) {
      lastShotRequest.current = shotRequest
      shotElapsed.current = 0
      shotActive.current = true
      targetScale.current = 1
      document.body.style.cursor = 'auto'
    }

    if (shotActive.current) {
      shotElapsed.current += frameDelta
      const elapsed = shotElapsed.current
      ballRef.current.rotation.x += frameDelta * 8
      ballRef.current.rotation.z += frameDelta * 11

      if (elapsed < shotDuration) {
        const progress = elapsed / shotDuration
        ballRef.current.position.lerpVectors(shotStart, hoopCenter, progress)
        ballRef.current.position.y += Math.sin(progress * Math.PI) * 2.15
      } else if (elapsed < shotDuration + dropDuration) {
        const progress = (elapsed - shotDuration) / dropDuration
        ballRef.current.position.set(
          hoopCenter.x,
          hoopCenter.y - progress * 0.72,
          hoopCenter.z,
        )
      } else if (elapsed < shotDuration + dropDuration + returnDuration) {
        const progress =
          (elapsed - shotDuration - dropDuration) / returnDuration
        const easedProgress = 1 - (1 - progress) ** 2
        ballRef.current.position.set(
          THREE.MathUtils.lerp(hoopCenter.x, shotStart.x, easedProgress),
          shotStart.y + Math.sin(progress * Math.PI) * 0.32,
          THREE.MathUtils.lerp(hoopCenter.z, shotStart.z, easedProgress),
        )
      } else {
        shotActive.current = false
        ballRef.current.position.copy(shotStart)
        ballRef.current.rotation.set(0, 0, 0)
        onShotMade()
      }
    } else {
      idleElapsed.current += frameDelta
      ballRef.current.rotation.y += frameDelta * 0.2
      ballRef.current.position.y =
        shotStart.y + Math.sin(idleElapsed.current * 1.2) * 0.025
    }

    const scale = ballRef.current.scale.x
    const nextScale = THREE.MathUtils.damp(
      scale,
      targetScale.current,
      8,
      frameDelta,
    )
    ballRef.current.scale.setScalar(nextScale)
  })

  const seam = (points: [number, number, number][]) => (
    <Line points={points} color="#613829" lineWidth={1.6} />
  )

  return (
    <group
      ref={ballRef}
      position={[0, 0.22, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onShoot()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (!shotActive.current) {
          targetScale.current = 1.12
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        targetScale.current = 1
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh>
        <sphereGeometry args={[BALL_RADIUS, 40, 40]} />
        <meshStandardMaterial
          color="#bd694b"
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>
      {seam(
        Array.from({ length: 65 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 64
          return [
            Math.cos(angle) * (BALL_RADIUS + 0.004),
            0,
            Math.sin(angle) * (BALL_RADIUS + 0.004),
          ]
        }),
      )}
      {seam(
        Array.from({ length: 65 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 64
          return [
            0,
            Math.cos(angle) * (BALL_RADIUS + 0.004),
            Math.sin(angle) * (BALL_RADIUS + 0.004),
          ]
        }),
      )}
      {seam(
        Array.from({ length: 65 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 64
          return [
            Math.cos(angle) * (BALL_RADIUS + 0.004),
            Math.sin(angle) * (BALL_RADIUS + 0.004),
            0,
          ]
        }),
      )}
    </group>
  )
}

function SideTribune({ side }: { side: -1 | 1 }) {
  const rowCount = 4
  const seatsPerRow = 12

  return (
    <group>
      {Array.from({ length: rowCount }, (_, row) => {
        const rowX = side * (9.05 + row * 0.76)
        const deckY = 0.16 + row * 0.36
        const seatX = rowX + side * 0.015
        const seatY = deckY + 0.18

        return (
          <group key={`tribune-${side}-${row}`}>
            <mesh position={[rowX, deckY, 0]} receiveShadow castShadow>
              <boxGeometry args={[0.72, 0.24, 9.35]} />
              <meshStandardMaterial color="#424643" roughness={0.82} />
            </mesh>
            {Array.from({ length: seatsPerRow }, (_, seat) => {
              const z = -4.03 + seat * 0.735
              return (
                <group key={`seat-${seat}`} position={[seatX, seatY, z]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.53, 0.14, 0.58]} />
                    <meshStandardMaterial
                      color={row % 2 === 0 ? '#354f69' : '#3a5875'}
                      roughness={0.68}
                    />
                  </mesh>
                  <mesh position={[side * 0.2, 0.2, 0]} castShadow>
                    <boxGeometry args={[0.13, 0.42, 0.58]} />
                    <meshStandardMaterial
                      color={row % 2 === 0 ? '#354f69' : '#3a5875'}
                      roughness={0.68}
                    />
                  </mesh>
                </group>
              )
            })}
          </group>
        )
      })}

      {[ -4.55, 0, 4.55 ].map((z) => (
        <mesh key={`rail-post-${side}-${z}`} position={[side * 12.02, 1.86, z]}>
          <boxGeometry args={[0.08, 1.46, 0.08]} />
          <meshStandardMaterial color="#888a83" metalness={0.42} roughness={0.46} />
        </mesh>
      ))}
      <mesh position={[side * 12.02, 2.57, 0]}>
        <boxGeometry args={[0.08, 0.08, 9.2]} />
        <meshStandardMaterial color="#888a83" metalness={0.42} roughness={0.46} />
      </mesh>
    </group>
  )
}

function CourtScene({
  onOpen,
  onShoot,
  onShotMade,
  shotRequest,
  shotStatus,
  shotsAttempted,
  shotsMade,
  focus,
}: {
  onOpen: (panel: PanelName) => void
  onShoot: () => void
  onShotMade: () => void
  shotRequest: number
  shotStatus: ShotStatus
  shotsAttempted: number
  shotsMade: number
  focus: FocusName
}) {
  const controlsRef = useRef<CameraControls | null>(null)

  useEffect(() => {
    const view = cameraViews[focus]
    void controlsRef.current?.setLookAt(
      ...view.position,
      ...view.target,
      true,
    )
  }, [focus])

  return (
    <>
      <color attach="background" args={['#151716']} />
      <fog attach="fog" args={['#151716', 28, 58]} />
      <ambientLight intensity={1.15} />
      <directionalLight
        position={[5, 10, 4]}
        intensity={2.1}
        color="#f3dfca"
      />
      <pointLight position={[-6, 5, -2]} intensity={24} color="#c77958" />
      <CameraControls
        ref={controlsRef}
        makeDefault
        minDistance={8}
        maxDistance={44}
        minPolarAngle={0.2}
        maxPolarAngle={1.42}
        dollySpeed={0.7}
        truckSpeed={0.45}
        smoothTime={0.6}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.44, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1c1e1d" roughness={1} />
      </mesh>
      <RoundedBox
        args={[17.4, 0.32, 11]}
        radius={0.28}
        smoothness={5}
        position={[0, -0.3, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#383b3b" roughness={0.72} metalness={0.08} />
      </RoundedBox>
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[17.1, 0.22, 10.7]} />
        <meshBasicMaterial color="#6e8a3b" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial color="#496fa6" side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 16 }, (_, index) => (
        <mesh
          key={`court-plank-${index}`}
          position={[-7.5 + index, 0.092, 0]}
        >
          <boxGeometry args={[0.985, 0.003, 8.96]} />
          <meshBasicMaterial color={index % 2 === 0 ? '#365b94' : '#3b629b'} />
        </mesh>
      ))}
      <CourtLines />
      <SideTribune side={-1} />
      <SideTribune side={1} />
      <AttackZone end="far" onOpen={() => onOpen('experience')} />
      <AttackZone end="near" onOpen={() => onOpen('experience')} />
      <Hoop end="far" onOpen={() => onOpen('projects')} />
      <CourtScoreboard
        shotsAttempted={shotsAttempted}
        shotsMade={shotsMade}
        shotStatus={shotStatus}
      />
      <LEDPerimeterBoard
        label="LinkedIn"
        detail="MATIAS FANDINO"
        href="https://www.linkedin.com/in/matiasfandino/?isSelfProfile=true"
        icon="/social/linkedin.svg"
        position={[-8.62, 0.67, -2.22]}
        rotation={[0, Math.PI / 2, 0]}
        size={[4.2, 0.7]}
      />
      <LEDPerimeterBoard
        label="GitHub"
        detail="MATIFANDY8"
        href="https://github.com/matifandy8"
        icon="/social/github.svg"
        position={[-8.62, 0.67, 2.22]}
        rotation={[0, Math.PI / 2, 0]}
        size={[4.2, 0.7]}
      />
      <LEDPerimeterBoard
        label="Email"
        detail={CONTACT_EMAIL}
        href={`mailto:${CONTACT_EMAIL}`}
        position={[8.62, 0.67, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.8, 0.7]}
      />
      <InteractiveSign label="SHOOT" position={[0, 0.62, 0]} />
      <InteractiveSign
        label="PROJECTS"
        position={[0, 2.95, -4.1]}
      />
      <InteractiveSign
        label="EXPERIENCE"
        position={[0, 0.62, -2.75]}
      />
      <InteractiveSign
        label="EXPERIENCE"
        position={[0, 0.62, 2.75]}
      />
      <PlayerFigure onOpen={() => onOpen('profile')} />
      <InteractiveSign
        label="PROFILE"
        position={[5, 2.62, 0.45]}
      />
      <Basketball
        onShoot={onShoot}
        onShotMade={onShotMade}
        shotRequest={shotRequest}
      />
    </>
  )
}

function ContactPanel() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (copyStatus !== 'copied') return
    const timeoutId = window.setTimeout(() => setCopyStatus('idle'), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [copyStatus])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="max-w-xl text-sm leading-6 text-stone-400">
          Have a project, teaching opportunity, or just want to talk basketball
          and technology? Send me a note.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 inline-flex min-h-11 items-center gap-3 text-lg text-stone-100 transition hover:text-[#df9574] sm:text-xl"
        >
          <Mail aria-hidden="true" className="size-5 text-[#df9574]" strokeWidth={1.5} />
          {CONTACT_EMAIL}
          <ArrowUpRight aria-hidden="true" className="size-4 text-stone-500" strokeWidth={1.5} />
        </a>
        <nav aria-label="Social profiles" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-2 text-xs text-stone-400 transition hover:text-stone-100"
            >
              {link.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5 text-[#df9574]" strokeWidth={1.5} />
            </a>
          ))}
        </nav>
        {copyStatus === 'error' && (
          <p role="alert" className="mt-3 text-xs text-[#df9574]">
            Could not access the clipboard. Select and copy the email address instead.
          </p>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => void copyEmail()}
          className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-4 text-xs text-stone-300 transition hover:border-[#bd694b]/60 hover:text-white active:scale-[0.98]"
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" className="size-4 text-[#df9574]" strokeWidth={1.5} />
          ) : (
            <Copy aria-hidden="true" className="size-4 text-[#df9574]" strokeWidth={1.5} />
          )}
          {copyStatus === 'copied' ? 'Email copied' : 'Copy email'}
        </button>
        <p aria-live="polite" className="mt-2 min-h-4 text-[10px] text-stone-500">
          {copyStatus === 'copied' ? 'Ready to paste into your message.' : ''}
        </p>
      </div>
    </div>
  )
}

function PanelContent({
  panel,
  onOpen,
}: {
  panel: PanelName
  onOpen: (panel: PanelName) => void
}) {
  if (panel === 'contact') return <ContactPanel />

  if (panel === 'profile') {
    return (
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl tracking-tight text-stone-100">Matías Fandiño</h3>
            <p className="mt-1 text-sm text-stone-400">Developer · Educator</p>
          </div>
          <div className="space-y-5 border-t border-white/10 pt-5">
            <div className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-stone-200">Montevideo, Uruguay</p>
                <p className="mt-1 text-xs text-stone-500">LATAM · UTC−3</p>
              </div>
            </div>
            <div className="flex gap-3">
              <BriefcaseBusiness aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-stone-200">Development &amp; teaching</p>
                <p className="mt-1 text-xs text-stone-500">Product · code · thinking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <GraduationCap aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-stone-200">Education</p>
                <p className="mt-1 text-xs text-stone-500">Academic details coming soon</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-5 font-mono text-[10px] tracking-[0.16em] text-stone-500">
            PLAYER SKILLS
          </p>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {playerStats.map((stat) => (
              <div
                key={stat.code}
                className="grid gap-3 py-4 sm:grid-cols-[64px_1fr]"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-[#df9574]">{stat.code}</span>
                  <span className="text-[10px] tracking-[0.12em] text-stone-500">
                    {stat.label}
                  </span>
                </div>
                <p className="text-sm leading-6 text-stone-300">
                  {stat.skills.join(' · ')}
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onOpen('skills')}
            className="mt-5 inline-flex min-h-10 w-full items-center justify-between border border-white/10 px-3 text-left text-xs text-stone-300 transition hover:border-[#bd694b]/60 hover:text-white active:scale-[0.99]"
          >
            Open player stats
            <ArrowUpRight aria-hidden="true" className="size-3.5 text-[#df9574]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    )
  }

  if (panel === 'projects') {
    return (
      <>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <motion.article
              layout
              key={project.index}
              className="group border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-[#bd694b]/55 hover:bg-white/[0.045]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#df9574]">
                  {project.index}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-stone-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#df9574]"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-8 text-[10px] tracking-[0.14em] text-stone-500">
                {project.type}
              </p>
              <h3 className="mt-2 text-xl tracking-tight text-stone-100">
                {project.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">
                {project.description}
              </p>
              <span className="mt-5 inline-flex border border-white/10 px-2 py-1 font-mono text-[10px] text-stone-300">
                {project.tag}
              </span>
            </motion.article>
          ))}
        </div>
        <p className="mt-5 text-xs text-stone-500">
          Selected projects · more details coming soon.
        </p>
      </>
    )
  }

  if (panel === 'experience') {
    return (
      <div className="divide-y divide-white/10 border-t border-white/10">
        {experience.map((item) => (
          <motion.article
            layout
            key={item.period}
            className="grid gap-2 py-4 sm:grid-cols-[48px_1fr] sm:gap-4"
          >
            <span className="pt-1 font-mono text-xs text-[#df9574]">
              {item.period}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base text-stone-100">{item.role}</h3>
                <p className="text-xs text-stone-500">{item.company}</p>
              </div>
              <p className="mt-1 text-sm leading-6 text-stone-400">
                {item.detail}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {playerStats.map((stat) => (
        <motion.article
          layout
          key={stat.code}
          className="border-t border-white/10 pt-4"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-[#df9574]">{stat.code}</span>
            <h3 className="text-xs tracking-[0.16em] text-stone-300">
              {stat.label}
            </h3>
          </div>
          <ul className="mt-4 space-y-2">
            {stat.skills.map((skill) => (
              <li key={skill} className="text-sm text-stone-400">
                {skill}
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
      <p className="text-xs leading-5 text-stone-500 sm:col-span-3">
        PTS, AST, and REB organize my areas of play; they are not performance
        metrics.
      </p>
    </div>
  )
}

const panelMeta: Record<PanelName, { kicker: string; title: string }> = {
  projects: { kicker: '02 / PLAYS', title: 'Selected projects' },
  experience: { kicker: '01 / CAREER', title: 'Career on the court' },
  skills: { kicker: '03 / BOX SCORE', title: 'Player stats' },
  profile: { kicker: '00 / PLAYER PROFILE · 2026', title: 'About the player' },
  contact: { kicker: '04 / COURTSIDE', title: 'Let’s connect' },
}

function ContentModal({
  panel,
  onClose,
  onOpen,
}: {
  panel: PanelName | null
  onClose: () => void
  onOpen: (panel: PanelName) => void
}) {
  useEffect(() => {
    if (!panel) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, panel])

  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-[#0d0f0e]/75 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            layout
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            className="my-auto w-full max-w-3xl border border-white/10 bg-[#1b1e1c]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-8"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div className="mb-7 flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-[#df9574]">
                  {panelMeta[panel].kicker}
                </p>
                <h2
                  id="panel-title"
                  className="mt-2 text-2xl tracking-tight text-stone-100 sm:text-3xl"
                >
                  {panelMeta[panel].title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="grid size-10 shrink-0 place-items-center border border-white/10 text-stone-300 transition hover:border-white/30 hover:text-white active:scale-[0.98]"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <PanelContent panel={panel} onOpen={onOpen} />
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [activePanel, setActivePanel] = useState<PanelName | null>(null)
  const [sceneFocus, setSceneFocus] = useState<FocusName>('overview')
  const [shotRequest, setShotRequest] = useState(0)
  const [shotStatus, setShotStatus] = useState<ShotStatus>('ready')
  const [shotsAttempted, setShotsAttempted] = useState(0)
  const [shotsMade, setShotsMade] = useState(0)
  const shotLock = useRef(false)
  const closeModal = () => setActivePanel(null)
  const openPanel = (panel: PanelName) => {
    setSceneFocus(panel)
    setActivePanel(panel)
  }
  const shoot = () => {
    if (shotLock.current) return
    shotLock.current = true
    setShotStatus('shooting')
    setShotsAttempted((attempts) => attempts + 1)
    setShotRequest((request) => request + 1)
  }
  const finishShot = () => {
    shotLock.current = false
    setShotStatus('made')
    setShotsMade((made) => made + 1)
  }

  useEffect(
    () => () => {
      document.body.style.cursor = 'auto'
    },
    [],
  )

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#151716] font-sans text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_54%_48%,rgba(193,116,84,0.1),transparent_45%)]" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [15, 13, 22], fov: 35 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#151716')
          }}
          fallback={
            <div className="grid min-h-[100dvh] place-items-center px-6 text-center text-sm text-stone-300">
              This 3D experience requires a browser with WebGL support.
            </div>
          }
        >
          <CourtScene
            onOpen={openPanel}
            onShoot={shoot}
            onShotMade={finishShot}
            shotRequest={shotRequest}
            shotStatus={shotStatus}
            shotsAttempted={shotsAttempted}
            shotsMade={shotsMade}
            focus={sceneFocus}
          />
        </Canvas>
      </div>

      <header className="pointer-events-none relative z-10 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <a
          href="#inicio"
          className="pointer-events-auto inline-flex items-center gap-3 text-sm font-medium tracking-wide text-stone-100"
        >
          <span className="grid size-8 place-items-center border border-white/15 font-mono text-[11px] text-[#df9574]">
            MF
          </span>
          MATÍAS FANDIÑO
        </a>
        <div className="pointer-events-auto hidden items-center gap-2 border border-white/10 bg-[#151716]/55 px-3 py-2 text-[10px] tracking-[0.14em] text-stone-400 backdrop-blur-md sm:flex">
          <Radio aria-hidden="true" className="size-3 text-[#df9574]" strokeWidth={1.5} />
          MONTEVIDEO, UY
        </div>
      </header>

      <section
        id="inicio"
        className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-[1400px] flex-col justify-between gap-8 px-5 pb-5 pt-8 sm:px-8 sm:pb-8 lg:pt-0"
      >
        <nav
          aria-label="Explore the court"
          className="pointer-events-auto flex flex-wrap items-center gap-2 self-end lg:absolute lg:bottom-8 lg:left-8"
        >
          <span className="mr-1 font-mono text-[9px] tracking-[0.13em] text-stone-500">
            EXPLORE THE COURT
          </span>
          <button
            type="button"
            aria-label="Return to overview"
            aria-pressed={sceneFocus === 'overview'}
            onClick={() => setSceneFocus('overview')}
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-[10px] backdrop-blur-md transition active:scale-[0.98] ${
              sceneFocus === 'overview'
                ? 'border-[#bd694b]/70 bg-[#bd694b]/10 text-white'
                : 'border-white/10 bg-[#151716]/65 text-stone-300 hover:border-white/30 hover:text-white'
            }`}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            Overview
          </button>
          {[
            { panel: 'profile' as const, label: 'Profile', code: '00' },
            { panel: 'experience' as const, label: 'Experience', code: '01' },
            { panel: 'projects' as const, label: 'Projects', code: '02' },
            { panel: 'skills' as const, label: 'Skills', code: '03' },
            { panel: 'contact' as const, label: 'Contact', code: '04' },
          ].map((item) => (
            <button
              type="button"
              key={item.panel}
              aria-pressed={sceneFocus === item.panel}
              onClick={() => openPanel(item.panel)}
              className={`inline-flex min-h-9 items-center gap-2 border px-3 text-[10px] backdrop-blur-md transition active:scale-[0.98] ${
                sceneFocus === item.panel
                  ? 'border-[#bd694b]/70 bg-[#bd694b]/10 text-white'
                  : 'border-white/10 bg-[#151716]/65 text-stone-300 hover:border-[#bd694b]/60 hover:text-white'
              }`}
            >
              <span className="font-mono text-[#df9574]">{item.code}</span>
              {item.label}
            </button>
          ))}
          {shotsAttempted > 0 && (
            <span
              aria-live="polite"
              className="inline-flex min-h-9 items-center border border-white/10 bg-[#151716]/65 px-3 font-mono text-[9px] tracking-[0.08em] text-stone-400"
            >
              {shotStatus === 'shooting'
                ? `SHOT IN PROGRESS · MADE ${shotsMade}/${shotsAttempted}`
                : `SHOT MADE · ${shotsMade}/${shotsAttempted}`}
            </span>
          )}
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              shoot()
            }}
            disabled={shotStatus === 'shooting'}
            className="inline-flex min-h-9 items-center gap-2 bg-[#bd694b] px-3 text-[10px] font-medium text-[#1c1715] transition hover:bg-[#d28060] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            <Crosshair aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            {shotStatus === 'shooting'
              ? 'Shot in the air...'
              : shotStatus === 'made'
                ? 'Shoot again'
                : 'Shoot'}
          </button>
          <span className="inline-flex w-full items-center gap-2 pt-1 font-mono text-[9px] tracking-[0.08em] text-stone-500 sm:w-auto sm:pl-2 sm:pt-0">
            <Crosshair
              aria-hidden="true"
              className="size-3 shrink-0 text-[#df9574]"
              strokeWidth={1.5}
            />
            DRAG TO ORBIT · RIGHT-DRAG / TWO-FINGER DRAG TO PAN · SCROLL / PINCH TO ZOOM · CLICK BALL TO SHOOT
          </span>
        </nav>
      </section>

      <footer className="pointer-events-none absolute bottom-2 right-5 z-10 hidden font-mono text-[9px] tracking-[0.1em] text-stone-600 sm:block">
        INTERACTIVE CV · 01—03
      </footer>

      <ContentModal
        panel={activePanel}
        onClose={closeModal}
        onOpen={openPanel}
      />
    </main>
  )
}

export default App
