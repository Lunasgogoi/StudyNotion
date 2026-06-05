//import React from "react"
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"

function RatingStars({ Review_Count, Star_Size }) {
  const wholeStars = Math.max(Math.floor(Review_Count) || 0, 0)
  const hasHalfStar = !Number.isInteger(Review_Count) && Review_Count > wholeStars
  const full = Math.min(wholeStars, 5)
  const half = hasHalfStar ? 1 : 0
  const empty = Math.max(5 - full - half, 0)

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...new Array(full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={Star_Size || 20} />
      ))}
      {half ? <TiStarHalfOutline key="half" size={Star_Size || 20} /> : null}
      {[...new Array(empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={Star_Size || 20} />
      ))}
    </div>
  )
}

export default RatingStars

