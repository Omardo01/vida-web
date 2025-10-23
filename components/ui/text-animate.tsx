"use client"

import { ElementType, memo } from "react"
import { AnimatePresence, motion, MotionProps, Variants } from "motion/react"

import { cn } from "@/lib/utils"

type AnimationType = "text" | "word" | "character" | "line"
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "slideUp"
  | "slideDown"

interface TextAnimateProps extends MotionProps {
  children: string
  className?: string
  segmentClassName?: string
  delay?: number
  duration?: number
  variants?: Variants
  as?: ElementType
  by?: AnimationType
  startOnView?: boolean
  once?: boolean
  animation?: AnimationVariant
}

const defaultAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
        },
      },
    },
  },
  blurIn: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3,
        },
      },
    },
  },
  blurInUp: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration: 0.4,
        },
      },
    },
  },
  slideUp: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      },
    },
  },
  slideDown: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
    },
  },
}

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = true,
  by = "word",
  animation = "fadeIn",
  ...props
}: TextAnimateProps) => {
  const MotionComponent = motion.create(Component)

  let segments: string[] = []
  switch (by) {
    case "word":
      segments = children.split(/(\s+)/)
      break
    case "character":
      segments = children.split("")
      break
    case "line":
      segments = children.split("\n")
      break
    case "text":
    default:
      segments = [children]
      break
  }

  const finalVariants = variants
    ? {
        container: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              delayChildren: delay,
              staggerChildren: duration / segments.length,
            },
          },
        },
        item: variants,
      }
    : {
        container: {
          ...defaultAnimationVariants[animation].container,
          show: {
            ...defaultAnimationVariants[animation].container.show,
            transition: {
              delayChildren: delay,
              staggerChildren: duration / segments.length,
            },
          },
        },
        item: defaultAnimationVariants[animation].item,
      }

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        variants={finalVariants.container as Variants}
        initial="hidden"
        whileInView={startOnView ? "show" : undefined}
        animate={startOnView ? undefined : "show"}
        className={cn("whitespace-pre-wrap", className)}
        viewport={{ once }}
        {...props}
      >
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={finalVariants.item}
            className={cn(
              by === "line" ? "block" : "inline-block whitespace-pre",
              segmentClassName
            )}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  )
}

export const TextAnimate = memo(TextAnimateBase)

