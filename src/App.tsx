import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Line, RoundedBox } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  CircleDot,
  Crosshair,
  GraduationCap,
  MapPin,
  Radio,
  RotateCcw,
  X,
} from 'lucide-react'
import * as THREE from 'three'

type PanelName = 'projects' | 'experience' | 'skills'
type FocusName = 'overview' | PanelName
const BALL_RADIUS = 0.13

type CameraControlsHandle = {
  setLookAt: (
    positionX: number,
    positionY: number,
    positionZ: number,
    targetX: number,
    targetY: number,
    targetZ: number,
    smooth?: boolean,
  ) => Promise<void>
}

const cameraViews: Record<
  FocusName,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  overview: { position: [15, 15, 22], target: [0, 0.3, 0] },
  experience: { position: [5, 8, 9], target: [0, 0.4, -2.8] },
  projects: { position: [3.8, 7.8, 3.8], target: [0, 0.7, -3.2] },
  skills: { position: [5.4, 4.7, 6.2], target: [0, 0.16, 0] },
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
): [number, number, number][] {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = startAngle + ((endAngle - startAngle) * index) / segments
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
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
  onOpen,
  onHover,
}: {
  onOpen: () => void
  onHover: (hovered: boolean) => void
}) {
  const ballRef = useRef<THREE.Group>(null)
  const targetScale = useRef(1)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    if (!ballRef.current) return
    elapsed.current += delta
    ballRef.current.rotation.y += delta * 0.2
    ballRef.current.position.y = 0.22 + Math.sin(elapsed.current * 1.2) * 0.025
    const scale = ballRef.current.scale.x
    const nextScale = THREE.MathUtils.damp(scale, targetScale.current, 8, delta)
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
        onOpen()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        targetScale.current = 1.12
        onHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        targetScale.current = 1
        onHover(false)
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

function CourtScene({
  onOpen,
  onBallHover,
  focus,
}: {
  onOpen: (panel: PanelName) => void
  onBallHover: (hovered: boolean) => void
  focus: FocusName
}) {
  const controlsRef = useRef<CameraControlsHandle>(null)

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
        maxDistance={36}
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
      <AttackZone end="far" onOpen={() => onOpen('experience')} />
      <AttackZone end="near" onOpen={() => onOpen('experience')} />
      <Hoop end="far" onOpen={() => onOpen('projects')} />
      <Hoop end="near" onOpen={() => onOpen('projects')} />
      <Basketball
        onOpen={() => onOpen('skills')}
        onHover={onBallHover}
      />
    </>
  )
}

function SkillStats() {
  return (
    <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
      {playerStats.map((stat) => (
        <div key={stat.code} className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#df9574]">
            {stat.code}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.12em] text-stone-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function PanelContent({ panel }: { panel: PanelName }) {
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
}

function ContentModal({
  panel,
  onClose,
}: {
  panel: PanelName | null
  onClose: () => void
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
            <PanelContent panel={panel} />
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [activePanel, setActivePanel] = useState<PanelName | null>(null)
  const [ballHovered, setBallHovered] = useState(false)
  const [sceneFocus, setSceneFocus] = useState<FocusName>('overview')
  const closeModal = () => setActivePanel(null)
  const openPanel = (panel: PanelName) => {
    setSceneFocus(panel)
    setActivePanel(panel)
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
            onBallHover={setBallHovered}
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
        className="pointer-events-none relative z-10 mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1400px] grid-cols-1 content-between gap-8 px-5 pb-5 pt-8 sm:px-8 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:content-center lg:gap-12 lg:pt-0"
      >
        <div className="pointer-events-auto max-w-[460px] self-end lg:self-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
            }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.17em] text-[#df9574]"
            >
              <CircleDot aria-hidden="true" className="size-3" strokeWidth={1.5} />
              FULL-STACK & AI-FIRST DEVELOPER
            </motion.p>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="max-w-[12ch] text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-stone-100 sm:text-5xl lg:text-[4.15rem]"
            >
              Ideas that
              <br />
              find their
              <br />
              <span className="text-[#df9574]">game.</span>
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="mt-5 max-w-[38ch] text-sm leading-6 text-stone-300 sm:text-base"
            >
              I build digital products, teach people to think in code, and turn
              complex data into useful systems.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="mt-7 flex flex-wrap gap-2"
            >
              <button
                type="button"
                onClick={() => openPanel('experience')}
                className="inline-flex min-h-11 items-center gap-2 bg-[#bd694b] px-4 text-xs font-medium text-[#1c1715] transition hover:bg-[#d28060] active:scale-[0.98]"
              >
                View experience
                <ArrowDownRight aria-hidden="true" className="size-4" strokeWidth={1.7} />
              </button>
              <button
                type="button"
                onClick={() => openPanel('projects')}
                className="inline-flex min-h-11 items-center gap-2 border border-white/15 bg-[#151716]/50 px-4 text-xs text-stone-200 backdrop-blur-sm transition hover:border-white/35 active:scale-[0.98]"
              >
                Explore projects
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <aside className="pointer-events-auto w-full self-end border border-white/10 bg-[#191c1a]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5 lg:self-center">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#df9574]">
                PLAYER PROFILE / 2026
              </p>
              <h2 className="mt-2 text-xl tracking-tight text-stone-100">
                Matías Fandiño
              </h2>
              <p className="mt-1 text-xs text-stone-400">
                Developer · Educator
              </p>
            </div>
            <Braces aria-hidden="true" className="mt-1 size-5 text-stone-500" strokeWidth={1.4} />
          </div>

          <div className="mt-5 space-y-4 border-y border-white/10 py-4">
            <div className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-stone-200">Montevideo, Uruguay</p>
                <p className="mt-1 text-[11px] text-stone-500">LATAM · UTC−3</p>
              </div>
            </div>
            <div className="flex gap-3">
              <BriefcaseBusiness aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-stone-200">Development & teaching</p>
                <p className="mt-1 text-[11px] text-stone-500">
                  Product · code · thinking
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <GraduationCap aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#df9574]" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-stone-200">Education</p>
                <p className="mt-1 text-[11px] text-stone-500">
                  Academic details coming soon
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pb-4">
            <p className="font-mono text-[10px] tracking-[0.12em] text-stone-500">
              PLAYER SKILLS
            </p>
            {ballHovered && (
              <motion.span
                layoutId="ball-active"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-[#df9574]"
              >
                BALL IN PLAY
              </motion.span>
            )}
          </div>
          <SkillStats />
          <button
            type="button"
            onClick={() => openPanel('skills')}
            className="mt-4 inline-flex min-h-10 w-full items-center justify-between border border-white/10 px-3 text-left text-xs text-stone-300 transition hover:border-[#bd694b]/60 hover:text-white active:scale-[0.99]"
          >
            Open player stats
            <ArrowUpRight aria-hidden="true" className="size-3.5 text-[#df9574]" strokeWidth={1.5} />
          </button>
        </aside>

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
            { panel: 'experience' as const, label: 'Experience', code: '01' },
            { panel: 'projects' as const, label: 'Projects', code: '02' },
            { panel: 'skills' as const, label: 'Skills', code: '03' },
          ].map((item) => (
            <button
              type="button"
              key={item.panel}
              aria-pressed={sceneFocus === item.panel}
              onClick={() => setSceneFocus(item.panel)}
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
          <span className="inline-flex w-full items-center gap-2 pt-1 font-mono text-[9px] tracking-[0.08em] text-stone-500 sm:w-auto sm:pl-2 sm:pt-0">
            <Crosshair
              aria-hidden="true"
              className="size-3 shrink-0 text-[#df9574]"
              strokeWidth={1.5}
            />
            DRAG TO ORBIT · SCROLL / PINCH TO ZOOM
          </span>
        </nav>
      </section>

      <footer className="pointer-events-none absolute bottom-2 right-5 z-10 hidden font-mono text-[9px] tracking-[0.1em] text-stone-600 sm:block">
        INTERACTIVE CV · 01—03
      </footer>

      <AnimatePresence>
        {ballHovered && !activePanel && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="pointer-events-none absolute left-1/2 top-[43%] z-10 hidden -translate-x-1/2 border border-white/10 bg-[#191c1a]/90 px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-stone-200 backdrop-blur-md md:block"
          >
            CLICK TO OPEN PLAYER STATS
          </motion.div>
        )}
      </AnimatePresence>

      <ContentModal panel={activePanel} onClose={closeModal} />
    </main>
  )
}

export default App
