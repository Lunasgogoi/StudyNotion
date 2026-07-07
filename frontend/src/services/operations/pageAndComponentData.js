// src/services/operations/pageAndComponentData.js
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { ratingsEndpoints } from "../apis";
import {catalogData} from "../apis";

const { REVIEWS_DETAILS_API } = ratingsEndpoints;

export const getAllReviews = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", REVIEWS_DETAILS_API);
    
    if (!response?.data?.success) {
      throw new Error("Could not Fetch Reviews");
    }
    
    // Store the data in our result array
    result = response?.data?.data;
    
    console.log(result)

  } catch (error) {
    console.log("GET_ALL_REVIEWS_API ERROR............", error);
    toast.error("Could not fetch reviews");
  }
  return result;
};

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    )

    if (!response?.data?.success) {
      throw new Error("Could not Fetch Category page data")
    }
    return response?.data
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error)
    toast.error(error.message)
    return error.response?.data
  } finally {
    toast.dismiss(toastId)
  }
}
