"use client"

import { Tabs } from '@/app/components/ui/tabs'
import { useState, useEffect } from 'react'

export default function DashboardTabsWrapper({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("dashboard")

    useEffect(() => {
        // Listen for tab change events
        const handleTabChange = (event: CustomEvent) => {
            setActiveTab(event.detail.tab)
        }

        window.addEventListener('changeTab' as any, handleTabChange)
        return () => window.removeEventListener('changeTab' as any, handleTabChange)
    }, [])

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-h-screen w-full">
            {children}
        </Tabs>
    )
}
