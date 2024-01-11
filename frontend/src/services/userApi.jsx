import { api } from './api';
import { USER_URL } from '../lib/constants';

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: `${USER_URL}/register`,
				method: 'POST',
				body: {
					name: data.name,
					email: data.email,
					password: data.password
				}
			})
		}),
		login: builder.mutation({
			query: (data) => ({
				url: `${USER_URL}/login`,
				method: 'POST',
				body: {
					email: data.email,
					password: data.password
				}
			})
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USER_URL}/logout`,
				method: 'POST'
			})
		}),
		getProfile: builder.query({
			query: () => ({
				url: `${USER_URL}/profile`,
				method: 'GET'
			})
		}),
		updateProfile: builder.mutation({
			query: (data) => ({
				url: `${USER_URL}/profile/update`,
				method: 'PUT',
				body: {
					name: data.name,
					email: data.email,
					password: data.password
				}
			})
		}),
		getAllUsers: builder.query({
			query: () => ({
				url: `${USER_URL}/all`,
				method: 'GET'
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 60
		}),
		getUserById: builder.query({
			query: (userId) => ({
				url: `${USER_URL}/${userId}`,
				method: 'GET'
			})
		}),
		updateUserById: builder.mutation({
			query: (data) => ({
				url: `${USER_URL}/update/${data._id}`,
				method: 'PUT',
				body: {
					name: data.name,
					email: data.email,
					password: data.password,
                    role: data.role
				}
			}),
			invalidatesTags: ['User']
		}),
		deleteUserById: builder.mutation({
			query: (userId) => ({
				url: `${USER_URL}/delete/${userId}`,
				method: 'DELETE'
			})
		})
	})
});

export const { 
    useLoginMutation, 
    useGetProfileQuery, 
    useGetAllUsersQuery, 
    useGetUserByIdQuery, 
    useRegisterMutation, 
    useLogoutMutation, 
    useUpdateProfileMutation, 
    useUpdateUserByIdMutation,
    useDeleteUserByIdMutation
} = userApi;