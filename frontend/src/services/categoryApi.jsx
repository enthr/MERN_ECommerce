import { api } from './api';
import { CATEGORY_URL } from '../lib/constants';

export const categoryApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllCategories: builder.query({
			query: () => ({
				url: `${CATEGORY_URL}/all`,
                method: 'GET'
			}),
			providesTags: ['Category'],
			keepUnusedDataFor: 120
		}),
		getCategoryById: builder.query({
			query: (categoryId) => ({
				url: `${CATEGORY_URL}/${categoryId}`,
                method: 'GET'
			}),
            providesTags: ['Category'],
			keepUnusedDataFor: 120
		}),
		createCategory: builder.mutation({
			query: () => ({
				url: `${CATEGORY_URL}/create`,
				method: 'POST'
			}),
			invalidatesTags: ['Category']
		}),
		updateCategoryById: builder.mutation({
			query: (category) => ({
				url: `${CATEGORY_URL}/update/${category._id}`,
				method: 'PUT',
				body: {
					name: category.name
				}
			}),
			invalidatesTags: ['Category']
		}),
		deleteCategoryById: builder.mutation({
			query: (categoryId) => ({
				url: `${CATEGORY_URL}/delete/${categoryId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Category']
		})
	})
});

export const { 
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryByIdMutation,
    useDeleteCategoryByIdMutation
} = categoryApi;