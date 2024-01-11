import { api } from './api';
import { PRODUCT_URL, UPLOAD_URL } from '../lib/constants';

export const productApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllProducts: builder.query({
			query: ({ page }) => ({
				url: `${PRODUCT_URL}/all`,
				method: 'GET',
				params: {
					page: page
				}
			}),
			providesTags: ['Product'],
			keepUnusedDataFor: 120
		}),
		searchProducts: builder.query({
			query: ({ keyword, page }) => ({
				url: `${PRODUCT_URL}/search`,
				method: 'GET',
				params: {
					keyword: keyword,
					page: page
				}
			})
		}),
		getProductById: builder.query({
			query: (productId) => ({
				url: `${PRODUCT_URL}/${productId}`,
				method: 'GET'
			}),
			providesTags: ['Product'],
			keepUnusedDataFor: 120
		}),
		getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/top`,
                method: 'GET'
            }),
            keepUnusedDataFor: 120
        }),
		createProduct: builder.mutation({
			query: () => ({
				url: `${PRODUCT_URL}/create`,
				method: 'POST'
			}),
			invalidatesTags: ['Product']
		}),
		updateProductById: builder.mutation({
			query: (product) => ({
				url: `${PRODUCT_URL}/update/${product._id}`,
				method: 'PUT',
				body: {
					name: product.name,
					image: product.image,
					brand: product.brand,
					category: product.category,
					description: product.description,
					price: product.price,
					countInStock: product.countInStock
				}
			}),
			invalidatesTags: ['Product']
		}),
		deleteProductById: builder.mutation({
			query: (productId) => ({
				url: `${PRODUCT_URL}/delete/${productId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Product']
		}),
		uploadProductImage: builder.mutation({
			query: (formData) => ({
				url: `${UPLOAD_URL}`,
				method: 'POST',
				body: formData
			}),
			invalidatesTags: ['Product']
		})
	})
});

export const {
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useGetTopProductsQuery,
    useSearchProductsQuery,
	useCreateProductMutation,
	useUpdateProductByIdMutation,
	useDeleteProductByIdMutation,
	useUploadProductImageMutation
} = productApi;
