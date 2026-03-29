const Category = require("../models/Category");

// createCategory handler function
exports.createCategory = async (req, res) => {
    try {
        // fetch name and description, and set defaults to avoid undefined errors
        let { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }

        // Trim whitespace from the inputs
        name = name.trim();
        description = description.trim();

        // Check if category already exists (Case-insensitive check is often a good idea here)
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "A category with this name already exists",
            });
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name,
            description,
        });
        
        console.log("Category created: ", categoryDetails);

        // return response
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
            error: error.message, // Optional: helpful for debugging
        });
    }
};

// getAllCategories handler function
exports.getAllCategories = async (req, res) => {
    try {
        // fetch all categories from DB, use .lean() for performance optimization
        const allCategories = await Category.find({}, { name: 1, description: 1 }).lean();

        // return response
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            allCategories,
        });

    } catch (error) {
        console.error("Error in getAllCategories controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching categories",
        });
    }
};

exports.categoryPageDeatils = async (req,res) => {
    try {
        //get ID
        const {categoryId} = req.body;

        //Get courses for the specified category
        const selectedCatgory = await Category.findById(categoryId)
            .populate("courses");

            //when category is not found
            if (!selectedCatgory) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            //when there are no courses in the category
            if (selectedCatgory.course.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No courses found in this category",
                });
            }

            const selectedCourses = selectedCatgory.course;

            //get courses for all the other categories
            const CategoriesExceptSelected = await Category.find({
                _id : {$ne : categoryId}
            })
            .populate("courses");

            let differentCourses = [];

            for(const category of CategoriesExceptSelected) {
                differentCourses = differentCourses.concat(category.courses);
            }

            //get top-selling courses across all categories
            const allCategories = await Category.find().populate("courses");

            const allCourses = allCategories.flatMap(category => category.courses);

            const topSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

            res.status(200).json({
                success: true,
                message: "Category page details fetched successfully",
                selectedCourses: selectedCourses,
                differentCourses: differentCourses,
                topSellingCourses: topSellingCourses,
            });

    } catch(error) {
        console.log("Error in getAllUserDetails middleware", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error:error.message,
        });
    }
}