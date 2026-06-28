import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
} from "./store/apiSlice";

export function useAuth() {
  const { data, isLoading, isFetching, refetch } = useGetCurrentUserQuery();
  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();
  const [logoutMutation] = useLogoutMutation();

  const user = data?.user || null;

  const login = async (values) => {
    const response = await loginMutation(values).unwrap();
    await refetch();
    return response;
  };

  const signup = async (values) => {
    return signupMutation(values).unwrap();
  };

  const logout = async () => {
    const response = await logoutMutation().unwrap();
    await refetch();
    return response;
  };

  return {
    user,
    loading: isLoading || isFetching,
    isLoggedIn: Boolean(user),
    refreshAuth: refetch,
    login,
    signup,
    logout,
  };
}
