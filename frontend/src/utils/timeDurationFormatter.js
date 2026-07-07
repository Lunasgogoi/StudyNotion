import { formatDuration, getCourseDurationInSeconds } from "./courseMetrics"

export default function GetTotalDuration(courseContent) {
  return formatDuration(getCourseDurationInSeconds(courseContent))
}
