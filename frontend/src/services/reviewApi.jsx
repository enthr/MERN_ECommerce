import { api } from './api';
import { REVIEW_URL } from '../lib/constants';

export const reviewApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (review) => ({
                url: `${REVIEW_URL}/create`,
                method: 'POST',
                body: {
                    productId: review.productId,
                    rating: review.rating,
                    comment: review.comment
                }
            }),
            invalidatesTags: ['Review']
        }),
        updateReviewById: builder.mutation({
            query: (review) => ({
                url: `${REVIEW_URL}/update/${review._id}`,
                method: 'PUT',
                body: {
                    rating: review.rating,
                    comment: review.comment
                }
            }),
            invalidatesTags: ['Review']
        }),
        deleteReviewById: builder.mutation({
            query: (reviewId) => ({
                url: `${REVIEW_URL}/delete/${reviewId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Review']
        }),
        getAllReviews: builder.query({
            query: () => ({
                url: `${REVIEW_URL}/all`,
                method: 'GET'
            }),
            providesTags: ['Review']
        }),
        getAllProductReviews: builder.query({
            query: (productId) => ({
                url: `${REVIEW_URL}/all/${productId}`,
                method: 'GET'
            }),
            providesTags: ['Review'],
            keepUnusedDataFor: 120
        }),
        getReviewById: builder.query({
            query: (reviewId) => ({
                url: `${REVIEW_URL}/${reviewId}`,
                method: 'GET'
            }),
            providesTags: ['Review'],
            keepUnusedDataFor: 120
        })
    })
});

export const {
    useCreateReviewMutation,
    useUpdateReviewByIdMutation,
    useDeleteReviewByIdMutation,
    useGetAllReviewsQuery,
    useGetAllProductReviewsQuery,
    useGetReviewByIdQuery
} = reviewApi;