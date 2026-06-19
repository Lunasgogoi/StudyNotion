const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Course id and subsection id are required",
      });
    }

    // 1. Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ success: false, message: "Invalid SubSection" });
    }

    // 2. Find the course progress document for this user and course
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseId,
        userId,
        completedVideos: [],
      });
    }

    // 3. Toggle the subsection completion state
    const completedVideoIndex = courseProgress.completedVideos.findIndex(
      (id) => id.toString() === subsectionId
    );

    let isCompleted = true;
    if (completedVideoIndex >= 0) {
      courseProgress.completedVideos.splice(completedVideoIndex, 1);
      isCompleted = false;
    } else {
      courseProgress.completedVideos.push(subsectionId);
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: isCompleted
        ? "Lecture marked as completed"
        : "Lecture marked as incomplete",
      data: courseProgress.completedVideos,
      isCompleted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
