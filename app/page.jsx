"use client";

import Login from "@/pages/Login/Login";
import { BASE_API, endpoints } from "../constant/endpoints";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loader from "@/components/ui/Loaders/Loader";

export default function Home() {
  const { push } = useRouter();

  async function fetchProfile() {
    const lang = Cookies.get('lang') || 'EN';
    const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${lang}&token=${Cookies.get('token')}`, {});
    return res.data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  if (isLoading) return <Loader />;
  if (data) {
    const profile = {
      name: data?.data?.name,
      email: data?.data?.email,
      mobile: data?.data?.mobile,
      contactName: data?.data?.contactName,
      contactEmail: data?.data?.contactEmail,
      business: data?.data?.business,
      contactPhone: data?.data?.contactPhone,
      username: data?.data?.username,
    }
    Cookies.set('profile', JSON.stringify(profile));
    push("/home")
  }

  return (
    <>
      <Login />
    </>
  );
}
