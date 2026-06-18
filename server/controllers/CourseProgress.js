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

    // 3. Check if video is already marked as completed
    if (courseProgress.completedVideos.some((id) => id.toString() === subsectionId)) {
      return res.status(400).json({ success: false, message: "Subsection already completed" });
    }

    // 4. Push the new video to the completed array
    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: courseProgress.completedVideos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
