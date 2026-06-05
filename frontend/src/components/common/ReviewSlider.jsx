// src/components/core/HomePage/ReviewSlider.jsx
import { useEffect, useState } from 'react'
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
// Import required modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
import { FaStar } from 'react-icons/fa'

import { getAllReviews } from '../../services/operations/pageAndComponentData'

const ReviewSlider = () => {
  // 2. Create a state to hold the real reviews
  const [reviews, setReviews] = useState([]);
  const [truncateWords] = useState(15);

  // 3. Trigger the API call on mount
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getAllReviews();
      if (res) {
        setReviews(res);
      }
    };
    fetchReviews();
  }, []);



  return (
    <div className="w-full">
      <div className="my-12.5 h-46 max-w-maxContentTab lg:max-w-maxContent mx-auto">

        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={false}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1024: { slidesPerView: 4 }, // Shows 4 cards on desktop
            768: { slidesPerView: 2 },  // Shows 2 cards on tablets
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >

          {reviews?.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 min-h-37.5 rounded-md border border-richblack-700">

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={review?.user?.image}
                    alt="user profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="font-medium text-richblack-25 wrap-break-word">
                  {review?.review.split(" ").length > 15
                    ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                    : `${review?.review}`}
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <div className="flex gap-0.5 text-yellow-100">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className={starIndex < Math.round(review.rating) ? "opacity-100" : "opacity-30"}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  )
}

  export default ReviewSlider
