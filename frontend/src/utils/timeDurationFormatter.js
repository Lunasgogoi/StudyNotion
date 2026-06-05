export default function GetTotalDuration(courseContent) {
  let totalDurationInSeconds = 0;

  // Loop through all sections
  courseContent?.forEach((section) => {
    // Loop through all lectures in the section
    section?.subSection?.forEach((lecture) => {
      // Parse the timeDuration (assuming it's saved as a string or number of seconds)
      const timeDurationInSeconds = parseInt(lecture.timeDuration);
      if (!isNaN(timeDurationInSeconds)) {
        totalDurationInSeconds += timeDurationInSeconds;
      }
    });
  });

  // Convert total seconds to Hours, Minutes, Seconds
  const hours = Math.floor(totalDurationInSeconds / 3600);
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
  const seconds = Math.floor((totalDurationInSeconds % 3600) % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}