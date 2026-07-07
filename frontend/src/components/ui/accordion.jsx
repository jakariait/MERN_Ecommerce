import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

function Accordion({ className, expanded, onChange, children, ...props }) {
  const [open, setOpen] = React.useState(expanded ?? false)

  React.useEffect(() => {
    if (expanded !== undefined) setOpen(expanded)
  }, [expanded])

  const handleToggle = () => {
    const next = !open
    setOpen(next)
    if (onChange) onChange(null, next)
  }

  const childrenArray = React.Children.toArray(children)
  const summary = childrenArray.find(
    (child) => child.type?.name === "AccordionSummary" || child.type?.displayName === "AccordionSummary"
  )
  const details = childrenArray.find(
    (child) => child.type?.name === "AccordionDetails" || child.type?.displayName === "AccordionDetails"
  )

  return (
    <div
      data-slot="accordion"
      className={cn("border-b", className)}
      {...props}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left"
      >
        {summary?.props?.children}
        {summary?.props?.expandIcon || <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", open && "rotate-180")} />}
      </button>
      {open && (
        <div
          data-slot="accordion-content"
          className={cn("pb-4 pt-0 text-sm", details?.props?.className)}
          style={details?.props?.style}
        >
          {details?.props?.children}
        </div>
      )}
    </div>
  )
}

function AccordionSummary({ children, expandIcon, ...props }) {
  return null
}

function AccordionDetails({ children, ...props }) {
  return null
}

export { Accordion, AccordionSummary, AccordionDetails }
