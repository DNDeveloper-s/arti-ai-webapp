import React from 'react';
// import {useSession} from 'next-auth/react';
import AppLoader from '@/components/AppLoader';
import Dashboard from '@/components/Dashboard/Dashboard';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import LandingPage from '@/components/LandingPage/LandingPage';

export default async function Home() {
  // const {data, status} = useSession();
  // let status = 'authenticated';
  const session = await getServerSession(authOptions)

  let jsx = <AppLoader />

  if(!session)  jsx = <LandingPage />

  if(session)  jsx = <Dashboard />

  return jsx
}
