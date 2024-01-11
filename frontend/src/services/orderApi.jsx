import { api } from './api';
import { ORDER_URL, PAYPAL_URL } from '../lib/constants';

export const orderApi = api.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: `${ORDER_URL}/create`,
				method: 'POST',
				body: {
					orderItems: order.orderItems,
					shippingAddress: order.shippingAddress,
					paymentMethod: order.paymentMethod
				}
			})
		}),
		updateOrderToDeliveredById: builder.mutation({
			query: (orderId) => ({
				url: `${ORDER_URL}/delivered/${orderId}`,
				method: 'PUT'
			})
		}),
		updateOrderToPaidById: builder.mutation({
			query: ({ orderId, details }) => ({
				url: `${ORDER_URL}/paid/${orderId}`,
				method: 'PUT',
				body: { ...details }
			})
		}),
		getPaypalClientId: builder.query({
			query: () => ({
				url: PAYPAL_URL,
                method: 'GET'
			}),
			keepUnusedDataFor: 5
		}),
		getAllOrders: builder.query({
			query: () => ({
				url: `${ORDER_URL}/all`,
				method: 'GET'
			}),
			keepUnusedDataFor: 120
		}),
		getUserOrders: builder.query({
			query: () => ({
				url: `${ORDER_URL}/user`,
				method: 'GET'
			}),
			keepUnusedDataFor: 120
		}),
		getOrderById: builder.query({
			query: (orderId) => ({
				url: `${ORDER_URL}/${orderId}`,
				method: 'GET'
			}),
			keepUnusedDataFor: 120
		})
	})
});

export const {
	useCreateOrderMutation,
	useUpdateOrderToDeliveredByIdMutation,
	useUpdateOrderToPaidByIdMutation,
	useGetAllOrdersQuery,
	useGetUserOrdersQuery,
	useGetOrderByIdQuery,
    useGetPaypalClientIdQuery
} = orderApi;
