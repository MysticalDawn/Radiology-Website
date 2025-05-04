import type { LucideIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatusIndicatorProps {
  icon: LucideIcon
  label: string
  value: string
  status: "optimal" | "warning" | "critical" | "complete"
  showProgress?: boolean
  progressValue?: number
}

export function StatusIndicator({
  icon: Icon,
  label,
  value,
  status,
  showProgress = false,
  progressValue = 0,
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case "optimal":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "critical":
        return "text-red-500"
      case "complete":
        return "text-blue-500"
      default:
        return "text-slate-500"
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case "optimal":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      case "complete":
        return "bg-blue-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="flex items-center gap-3 text-white">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 ${getStatusColor()}`}>
              <Icon className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {label} Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">{label}</span>
          <span className={`text-xs ${getStatusColor()}`}>{value}</span>
        </div>
        {showProgress && (
          <Progress value={progressValue} className={`h-1.5 mt-1.5 ${getProgressColor()}`} />
        )}
      </div>
    </div>
  )
}
