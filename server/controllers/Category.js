const Category = require("../models/Category");

// createCategory handler function
exports.createCategory = async (req, res) => {
    try {
        let { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }

        name = name.trim();
        description = description.trim();

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "A category with this name already exists",
            });
        }

        const categoryDetails = await Category.create({
            name,
            description,
        });

        console.log("Category created: ", categoryDetails);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            categoryDetails,
        });

    } catch (error) {
        console.error("Error in createCategory controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating category",
            error: error.message,
        });
    }
};

// getAllCategories handler function
exports.getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({})
            .populate("courses");

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: allCategories,
        });

    } catch (error) {
        console.error("Error in getAllCategories controller:", error);

        return res.status(500).json({
            success: false,
            message: "Error in fetching categories",
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const coursePopulate = {
            path: "courses",
            populate: [
                {
                    path: "ratingsAndReviews",
                },
                {
                    path: "instructor",
                    select: "firstName lastName image",
                },
            ],
        };

        const selectedCategory = await Category.findById(categoryId)
            .populate(coursePopulate)
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const selectedCourses = selectedCategory.courses || [];

        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        }).populate(coursePopulate);

        let differentCourses = [];

        for (const category of categoriesExceptSelected) {
            differentCourses = differentCourses.concat(category.courses || []);
        }

        const allCategories = await Category.find().populate(coursePopulate);
        const allCourses = allCategories.flatMap((category) => category.courses || []);

        const topSellingCourses = allCourses
            .sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            message: "Category page details fetched successfully",
            data: {
                selectedCategory,
                selectedCourses,
                differentCourses,
                topSellingCourses,
            },
        });

    } catch (error) {
        console.log("Error in categoryPageDetails controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
