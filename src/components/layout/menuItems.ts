import { CalendarDays, Users, BarChart2, Settings } from 'lucide-react'

export type MenuItem = {
    name: string
    icon: (props: { size?: number; className?: string }) => JSX.Element
    href: string
    adminOnly: boolean
}

export const menuItems: MenuItem[] = [
    { name: 'Accueil', icon: CalendarDays as any, href: '/', adminOnly: false },
    { name: 'Agenda', icon: CalendarDays as any, href: '/agenda', adminOnly: false },
    { name: 'Clients', icon: Users as any, href: '/customers', adminOnly: false },
    { name: 'Statistiques', icon: BarChart2 as any, href: '/dashboard', adminOnly: true },
    { name: 'Configuration', icon: Settings as any, href: '/settings', adminOnly: true },
]


