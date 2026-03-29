const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async (req, res) => {
    try {
        //get userId
        const userId = req.user.id;

        //fetch data from body
        const { rating, review, courseId } = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        //check if user has already submitted rating or not
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            alreadyReviewed.rating = rating;
            alreadyReviewed.review = review;
            await alreadyReviewed.save();
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review,
        });

        //update course rating
        const updatedCourse = await Course.findByIdAndUpdate(
            {
                $push: {
                    ratingsAndReviews: ratingReview._id,
                }
            },
            { new: true }
        );
        console.log(updatedCourse);
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            data: ratingReview,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating rating and review",
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get courseId
        const { courseId } = req.body;

        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ])

        //return rating
        if (result.length() > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                data: result[0].averageRating,
            })
        }

        //if no ratings found
        return res.status(200).json({
            success: true,
            message: "Average rating fetched successfully",
            data: 0,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


//getAllRatings&Reviews

exports.getAllRatingsAndReviews = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName image email",
            })
            .populate({
                path:"course",
                select:"courseName",
            })

            return  res.status(200).json({
                success: true,
                message: "All reviews fetched successfully",
                data: allReviews,
            });

    } catch (err) {

    }
}