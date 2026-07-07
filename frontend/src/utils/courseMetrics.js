export const parseDurationToSeconds = (duration) => {
  if (duration === undefined || duration === null || duration === "") return 0

  if (typeof duration === "number") {
    return Number.isFinite(duration) ? Math.max(0, duration) : 0
  }

  const normalized = String(duration).trim()
  if (!normalized) return 0

  if (normalized.includes(":")) {
    const parts = normalized.split(":").map((part) => Number(part))
    if (parts.some((part) => Number.isNaN(part))) return 0

    return parts.reduce((total, part) => total * 60 + part, 0)
  }

  const numericDuration = Number(normalized)
  return Number.isFinite(numericDuration) ? Math.max(0, numericDuration) : 0
}

export const formatDuration = (seconds) => {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }

  return `${remainingSeconds}s`
}

export const getCourseDurationInSeconds = (courseContent = []) => (
  courseContent.reduce((courseTotal, section) => (
    courseTotal + (section?.subSection || []).reduce(
      (sectionTotal, lecture) => sectionTotal + parseDurationToSeconds(lecture?.timeDuration || lecture?.duration),
      0
    )
  ), 0)
)

export const getTotalLectures = (courseContent = []) => (
  courseContent.reduce((total, section) => total + (section?.subSection?.length || 0), 0)
)
