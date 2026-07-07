import { useMemo, useState } from "react"
import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const chartColors = useMemo(
    () => courses.map((_, index) => {
      const hue = (index * 137) % 360
      return `hsl(${hue}, 72%, 55%)`
    }),
    [courses]
  )

  // Data for Students Chart
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  }

  // Data for Income Chart
  const chartDataIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  }

  // Chart Options (Makes it look sleek and removes chunky legends)
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: "#AFB2BF",
          usePointStyle: true,
          boxWidth: 8,
        }
      }
    },
    cutout: '70%', // Creates the modern Doughnut look
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md border border-richblack-800 bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      
      {/* Sleek Toggle Buttons */}
      <div className="flex gap-x-2 rounded-full bg-richblack-700 p-1 w-fit">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-full px-4 py-1 text-sm transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-900 text-yellow-50 font-medium shadow-sm"
              : "text-richblack-200 hover:text-richblack-50"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-full px-4 py-1 text-sm transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-900 text-yellow-50 font-medium shadow-sm"
              : "text-richblack-200 hover:text-richblack-50"
          }`}
        >
          Income
        </button>
      </div>
      
      {/* Chart Container */}
      <div className="relative mx-auto aspect-square w-full max-w-[300px] mt-4">
        <Doughnut
          data={currChart === "students" ? chartDataStudents : chartDataIncome}
          options={options}
        />
      </div>
    </div>
  )
}
