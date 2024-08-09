'use client';
import { MagentoVercelProduct } from 'lib/magento/types';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import StarRating from './StarRating';

const ReviewForm = ({
  reviewsmetadata,
  product
}: {
  reviewsmetadata: { items: any };
  product: MagentoVercelProduct;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [rating, setRating] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const onSubmit = async (data: { nickname: string; summary: string; comment: string }) => {
    // Handle form submission, e.g., send data to API
    const getValueId = (
      reviewsmetadata: {
        items: { id: string; name: string; values: { value_id: number; value: number }[] }[];
      },
      rating: number
    ) => {
      for (const item of reviewsmetadata.items) {
        if (item.name === 'Rating') {
          const valueObject = item.values.find((v) => v.value == rating);
          if (valueObject) {
            return [
              {
                id: item.id,
                value_id: valueObject.value_id
              }
            ];
          }
        }
      }
      return null; // Return null if the value is not found
    };
    const valueId = getValueId(reviewsmetadata, rating);
    if (valueId != null) {
      const ReviewData = {
        sku: product.sku,
        nickname: data.nickname,
        summary: data.summary,
        text: data.comment,
        ratings: valueId
      };
      //const response = await setReviewsDataProxy(ReviewData);

      formRef.current?.reset();
      setRating(0);
      router.refresh();
    }
  };

  return (
    <>
      <div id="reviews" className="customer-reviews-section mt-6">
        <h3 className="mb-4 text-2xl font-bold">Customer Reviews</h3>
        <ol className="items review-items">
          {product.reviewsList?.items.map((ratings, index) => (
            <li key={index} className="mb-2 border-b  border-solid border-slate-300 pb-2">
              <div className="review-title" itemProp="name">
                {ratings.summary}
              </div>
              <div className="review-content-container">
                <div className="review-content" itemProp="description">
                  {ratings.text}
                </div>
                <div className="review-details">
                  <p className="review-author">
                    <strong className="review-details-label">Review by:</strong>
                    <span className="review-details-value ml-1" itemProp="author">
                      {ratings.nickname}
                    </span>
                  </p>
                  <p className="review-date mt-1 text-sm">
                    <time className="review-details-value" itemProp="datePublished" dateTime="">
                      {ratings.created_at}
                    </time>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <form className="mb-6" id="review-form" ref={formRef}>
        <div className="mb-6 flex items-center">
          <label className="mr-2 min-w-[100px]">Rating:</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-4 flex">
          <label className="mr-2 mt-1 min-w-[100px]">Nick Name:</label>
          <div>
            <input
              className="h-9 w-[266px] border px-2"
              type="text"
              {...register('nickname', { required: true })}
            />
            {errors.nickname && (
              <span className="mt-2 block text-sm text-red-500">This field is required</span>
            )}
          </div>
        </div>
        <div className="mb-4 flex">
          <label className="mr-2 mt-1 min-w-[100px]">Summary:</label>
          <div>
            <input
              className="h-9 w-[266px] border px-2"
              type="text"
              {...register('summary', { required: true })}
            />
            {errors.summary && (
              <span className="mt-2 block text-sm text-red-500">This field is required</span>
            )}
          </div>
        </div>
        <div className="mb-4 flex">
          <label className="mr-2 mt-1 min-w-[100px]">Comment:</label>
          <div>
            <textarea
              className="h-16 w-[266px] border px-2 pt-2 !outline-0"
              {...register('comment', { required: true })}
            />
            {errors.comment && (
              <span className="mt-1 block text-sm text-red-500">This field is required</span>
            )}
          </div>
        </div>
        <button
          className="rounded-full bg-[#222222] p-2 px-6 tracking-wide text-white hover:opacity-90"
          type="submit"
        >
          Submit Review
        </button>
      </form>
    </>
  );
};

export default ReviewForm;
