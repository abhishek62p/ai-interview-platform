"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"


// const chartData = [
//     { type: "Problem Solving", value: 186 },
//     { type: "System Design", value: 305 },
//     { type: "Communication Skills", value: 237 },
//     { type: "Technical Accuracy", value: 273 },
//     { type: "Behavioral Responses", value: 209 },
//     { type: "Time Management", value: 214 },
// ]

const chartConfig = {
    value: {
        label: "value",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig


export function SkillsPerformanceChart(Data: any) {
    return (
        <Card className="min-w-3xs p-0 m-0 z-10 gap-0 flex justify-center items-center h-fit bg-white/60 rounded-4xl">
            <CardHeader className="h-full w-full">
                <CardTitle className="p-3 pt-5">Skills Performance</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
                <ChartContainer
                    config={chartConfig}
                    className="w-[280px] md:w-[500px] aspect-square flex justify-center max-h-[320px]"
                >
                    <RadarChart className="w-[180px] md:w-[500px] flex justify-center !h-[320px] !max-w-[600px]" data={Data.ChartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis className="" dataKey="type" />
                        <PolarGrid className="" />
                        <Radar
                            dataKey="value"
                            fill="var(--color-value)"
                            fillOpacity={0.8}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
