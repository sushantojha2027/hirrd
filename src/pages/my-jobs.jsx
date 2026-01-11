import CreatedApplication from '@/components/created-application';
import CreatedJobs from '@/components/created-jobs';
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { BarLoader } from 'react-spinners';

const MyJobPage = () => {
  const {user,isLoaded} = useUser();
  if(!isLoaded){
    return <BarLoader width={"100%"} color='#36d7b7' />
  }
  return (
    <div>
      <h1 className='font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        {user?.unsafeMetadata?.role === "candidate"
        ? "My Applications"
        : "My Jobs"
      }
      </h1>
      {user?.unsafeMetadata?.role === "candidate"? (
      <CreatedApplication />):
      (
        <CreatedJobs />
      )
      }
       
    </div>
  )
}

export default MyJobPage
