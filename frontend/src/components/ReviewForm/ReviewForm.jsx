import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as reviewService from '../../services/reviewService';

const initialState = {
  title: '',
  text: '',
  rating: '',
};

export default function ReviewForm(props) {
  const [formData, setFormData] = useState(initialState);
  const { gameId } = useParams(); 
 

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const newReview = await reviewService.create(gameId, formData);
    props.onReviewAdded(newReview); 
    setFormData(initialState); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="text">Review</label>
      <textarea
        id="text"
        name="text"
        value={formData.text}
        onChange={handleChange}
        required
      />

      <label htmlFor="rating">Rating (1–10)</label>
      <input
        id="rating"
        name="rating"
        type="number"
        min="1"
        max="10"
        value={formData.rating}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit Review</button>
    </form>
  );
}

