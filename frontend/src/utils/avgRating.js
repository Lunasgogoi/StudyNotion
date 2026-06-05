export default function GetAvgRating(ratingArr) {
  // If no ratings exist, return 0
  if (!ratingArr || ratingArr?.length === 0) return 0;

  // Sum up all the ratings
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating;
    return acc;
  }, 0);

  // Calculate the average and round it to 1 decimal place (e.g., 4.5)
  const multiplier = Math.pow(10, 1);
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier;

  return avgReviewCount;
}