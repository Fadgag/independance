"use client"

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import MobileNav from './MobileNav'
import { usePathname } from 'next/navigation'

export default function MobileSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const pathname = usePathname()
    // close sheet when navigation changes
    useEffect(() => {
        if (isOpen) onClose()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    return (
        <div
            data-testid="mobile-sheet"
            role="dialog"
            aria-modal="true"
            className={`fixed inset-y-0 left-0 z-50 w-80 max-w-full transform transition-transform duration-300 bg-[var(--studio-bg)] border-r border-[var(--studio-border)] ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--studio-border)]">
                <div className="font-bold">Menu</div>
                <button aria-label="Fermer le menu" onClick={onClose} className="p-2">
                    <X />
                </button>
            </div>
            <div className="overflow-y-auto h-full">
                <MobileNav onLinkClick={onClose} />
            </div>
        </div>
    )
}


