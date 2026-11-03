import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

// Keep the dialog open in the top layer until its exit animation unmounts it.
// The browser makes the rest of the document inert and contains keyboard focus.
export function Modal({
  children,
  focusKey,
  labelledBy,
  onClose,
}: {
  children: ReactNode
  focusKey: string
  labelledBy: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    dialog.showModal()
    return () => {
      dialog.close()
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  // Profile can switch directly to Skills without closing the modal.
  useLayoutEffect(() => {
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
  }, [focusKey])

  return (
    <motion.dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none place-items-center overflow-y-auto border-0 bg-[#0d0f0e]/75 px-4 py-8 text-stone-100 backdrop-blur-sm backdrop:bg-transparent open:grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </motion.dialog>
  )
}
