
//createCourse handler function
const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const jwt = require("jsonwebtoken");

const parseListField = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value !== "string") {
        return [];
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(trimmedValue);
        return Array.isArray(parsedValue)
            ? parsedValue.map((item) => String(item).trim()).filter(Boolean)
            : [];
    } catch (error) {
        return trimmedValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
};

const isInstructorOwner = (course, instructorId) => {
    return course?.instructor?.toString() === instructorId?.toString();
};

const parseCoursePrice = (coursePrice) => {
    const price = Number(coursePrice);
    return Number.isFinite(price) && price >= 0 ? price : null;
};

const publicCourseFilter = {
    $or: [{ status: "Published" }, { status: { $exists: false } }],
};

exports.createCourse = async (req, res) => {
    try {

        // =========================
        // FILE VALIDATION
        // =========================

        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is required",
            });
        }

        const thumbnail = req.files.thumbnailImage;

        // =========================
        // BODY DATA
        // =========================

        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            coursePrice,
            courseTags,
            category,
            instructions,
            status,
        } = req.body;

        // =========================
        // SANITIZE INPUTS
        // =========================

        courseName = courseName?.trim();
        courseDescription = courseDescription?.trim();
        whatYouWillLearn = whatYouWillLearn?.trim();
        category = category?.trim();

        // =========================
        // REQUIRED FIELD VALIDATION
        // =========================

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            coursePrice === undefined ||
            coursePrice === null ||
            coursePrice === "" ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // =========================
        // OBJECT ID VALIDATION
        // =========================

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }

        // =========================
        // CHECK CATEGORY EXISTS
        // =========================

        const categoryDetails = await Category.findById(category);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // =========================
        // CHECK INSTRUCTOR
        // =========================

        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        if (instructorDetails.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can create courses",
            });
        }

        // =========================
        // TAGS HANDLING
        // =========================

        const tags = parseListField(courseTags);

        if (tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one tag is required",
            });
        }

        const price = parseCoursePrice(coursePrice);
        if (price === null) {
            return res.status(400).json({
                success: false,
                message: "Course price must be a valid non-negative number",
            });
        }

        // =========================
        // IMAGE UPLOAD
        // =========================

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );

        // =========================
        // CREATE COURSE
        // =========================

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            category,
            courseTags: tags,
            instructions: parseListField(instructions),
            status: status === "Published" ? "Published" : "Draft",
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // =========================
        // UPDATE USER
        // =========================

        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // =========================
        // UPDATE CATEGORY
        // =========================

        await Category.findByIdAndUpdate(
            category,
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // =========================
        // RESPONSE
        // =========================

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });

    } catch (error) {

        console.error("CREATE COURSE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

//getAllCourses handler function

exports.getAllCourses = async (req, res) => {
    try {
        // Fetch all courses
        const courses = await Course.find(publicCourseFilter)
            .populate({
                path: "instructor",
                select: "firstName lastName email accountType image additionalDetails",
                populate: {
                    path: "additionalDetails", // ✅ fixed typo
                },
            })
            .populate("category")
            .populate("ratingsAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            });

        // Validation
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: courses,
        });

    } catch (error) {
        console.error("Error in getAllCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching courses",
        });
    }
};
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                select: "firstName lastName email accountType image additionalDetails",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingsAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id ${courseId}`,
            });
        }

        let completedVideos = [];
        const token = req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const courseProgress = await CourseProgress.findOne({
                    courseId,
                    userId: decoded.id,
                });

                completedVideos = courseProgress?.completedVideos || [];
            } catch (error) {
                completedVideos = [];
            }
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
            completedVideos,
        });

    } catch (error) {
        console.log("Error in getCourseDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching course details",
        });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({
            instructor: instructorId,
        })
            .populate("category")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Instructor courses fetched successfully",
            data: instructorCourses,
        });
    } catch (error) {
        console.log("Error in getInstructorCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching instructor courses",
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        // 1. Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (!isInstructorOwner(course, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this course",
            });
        }

        // 2. Un-enroll students from the course
        // (Assuming you have a studentsEnrolled array in your Course model)
        const studentsEnrolled = course.studentsEnrolled || [];
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }

        // 3. Remove from Instructor's course list
        await User.findByIdAndUpdate(course.instructor, {
            $pull: { courses: courseId },
        });

        // 4. Remove the course from Category
        await Category.findByIdAndUpdate(course.category, {
            $pull: { courses: courseId },
        });

        // 5. Delete sections and sub-sections
        const courseSections = course.courseContent || [];
        for (const sectionId of courseSections) {
            // Find the section to get its sub-sections
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection || [];
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId); // Delete sub-section
                }
            }
            // Delete the section
            await Section.findByIdAndDelete(sectionId);
        }

        // 6. Finally, delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.error("DELETE COURSE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting course",
            error: error.message,
        });
    }
};

exports.searchCourses = async (req, res) => {
  try {
    const { searchQuery } = req.body; // or req.query if you prefer a GET request

    if (!searchQuery) {
      return res.status(400).json({ success: false, message: "Search query is missing" });
    }

    // Use MongoDB $or operator to search across multiple fields
    // $options: "i" makes it case-insensitive
    const courses = await Course.find({
      $and: [
        publicCourseFilter,
        {
          $or: [
            { courseName: { $regex: searchQuery, $options: "i" } },
            { courseDescription: { $regex: searchQuery, $options: "i" } },
            { courseTags: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ],
    })
    .populate("instructor", "firstName lastName email accountType image")
    .populate("category")
    .populate("ratingsAndReviews")
    .exec();

    return res.status(200).json({
      success: true,
      data: courses,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch search results",
      error: error.message,
    });
  }
};

// ================================
// EDIT COURSE - Updates existing course
// ================================
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = {};

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!isInstructorOwner(course, req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this course",
      });
    }

    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      coursePrice,
      courseTags,
      category,
      instructions,
      status,
    } = req.body;

    if (courseName?.trim()) {
      updateData.courseName = courseName.trim();
    }

    if (courseDescription?.trim()) {
      updateData.courseDescription = courseDescription.trim();
    }

    if (whatYouWillLearn?.trim()) {
      updateData.whatYouWillLearn = whatYouWillLearn.trim();
    }

    if (coursePrice !== undefined && coursePrice !== null && coursePrice !== "") {
      const price = parseCoursePrice(coursePrice);
      if (price === null) {
        return res.status(400).json({
          success: false,
          message: "Course price must be a valid non-negative number",
        });
      }

      updateData.price = price;
    }

    if (category?.trim()) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const categoryDetails = await Category.findById(category);
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      updateData.category = category;
    }

    // =========================
    // HANDLE THUMBNAIL UPDATE
    // =========================
    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const uploadedThumbnail = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updateData.thumbnail = uploadedThumbnail.secure_url;
    }

    // =========================
    // HANDLE TAGS
    // =========================
    if (courseTags !== undefined) {
      const tags = parseListField(courseTags);
      if (tags.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one tag is required",
        });
      }

      updateData.courseTags = tags;
    }

    if (instructions !== undefined) {
      const parsedInstructions = parseListField(instructions);
      updateData.instructions = parsedInstructions;
    }

    if (status !== undefined) {
      if (!["Draft", "Published"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course status",
        });
      }

      updateData.status = status;
    }

    // =========================
    // UPDATE COURSE
    // =========================
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updateData },
      { new: true }
    )
      .populate("instructor", "firstName lastName email accountType image")
      .populate("category")
      .populate("ratingsAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });

    if (
      updateData.category &&
      course.category?.toString() !== updateData.category.toString()
    ) {
      await Category.findByIdAndUpdate(course.category, {
        $pull: { courses: courseId },
      });
      await Category.findByIdAndUpdate(updateData.category, {
        $addToSet: { courses: courseId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error("EDIT COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};
