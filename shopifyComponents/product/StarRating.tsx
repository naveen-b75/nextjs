import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({
  rating,
  setRating
}: {
  rating: number;
  setRating: (value: number) => void;
}) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="ratings-stars" style={{ display: 'flex' }}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={30}
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: 'pointer' }}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
