import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { SERVER } from '../lib/constants';

import { clearUserInfo } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({ baseUrl: SERVER, credentials: 'include' });

async function baseQueryWithAuth(args, api, extra) {
	const result = await baseQuery(args, api, extra);
	if (result.error && result.error.status === 401) {
		api.dispatch(clearUserInfo());
	}
	return result;
}

export const api = createApi({
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Product', 'Order', 'User', 'Category', 'Review'],
	endpoints: (builder) => ({})
});