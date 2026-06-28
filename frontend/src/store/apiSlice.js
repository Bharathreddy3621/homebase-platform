import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const airbnbApi = createApi({
  reducerPath: "airbnbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: "include",
  }),
  tagTypes: [
    "Auth",
    "Homes",
    "Home",
    "Favourites",
    "Bookings",
    "HostHomes",
  ],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (values) => ({
        url: "/auth/login",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation({
      query: (values) => ({
        url: "/auth/signup",
        method: "POST",
        body: values,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getHomes: builder.query({
      query: () => "/homes",
      providesTags: (result) =>
        result?.homes
          ? [
              { type: "Homes", id: "LIST" },
              ...result.homes.map((home) => ({ type: "Home", id: home._id })),
            ]
          : [{ type: "Homes", id: "LIST" }],
    }),
    getHome: builder.query({
      query: (homeId) => `/homes/${homeId}`,
      providesTags: (result, error, homeId) => [{ type: "Home", id: homeId }],
    }),
    getFavourites: builder.query({
      query: () => "/favourites",
      providesTags: ["Favourites"],
    }),
    addFavourite: builder.mutation({
      query: (homeId) => ({
        url: "/favourites",
        method: "POST",
        body: { id: homeId },
      }),
      invalidatesTags: ["Auth", "Favourites", "Homes", "Home"],
    }),
    removeFavourite: builder.mutation({
      query: (homeId) => ({
        url: `/favourites/${homeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth", "Favourites", "Homes", "Home"],
    }),
    getBookings: builder.query({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),
    getHostHomes: builder.query({
      query: () => "/host/homes",
      providesTags: (result) =>
        result?.homes
          ? [
              { type: "HostHomes", id: "LIST" },
              ...result.homes.map((home) => ({ type: "Home", id: home._id })),
            ]
          : [{ type: "HostHomes", id: "LIST" }],
    }),
    createHostHome: builder.mutation({
      query: (body) => ({
        url: "/host/homes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HostHomes", "Homes"],
    }),
    updateHostHome: builder.mutation({
      query: ({ homeId, body }) => ({
        url: `/host/homes/${homeId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["HostHomes", "Homes", "Home"],
    }),
    deleteHostHome: builder.mutation({
      query: (homeId) => ({
        url: `/host/homes/${homeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HostHomes", "Homes", "Home"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetHomesQuery,
  useGetHomeQuery,
  useGetFavouritesQuery,
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
  useGetBookingsQuery,
  useGetHostHomesQuery,
  useCreateHostHomeMutation,
  useUpdateHostHomeMutation,
  useDeleteHostHomeMutation,
} = airbnbApi;
