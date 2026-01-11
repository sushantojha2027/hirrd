import { getApplications } from '@/api/apiApplications';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './application-card';

const CreatedApplication = () => {
    const {user, isLoaded} = useUser();
    const{
        loading: loadingApplications,
        data: applications,
        fn : fnApplications
    } = useFetch(getApplications,{
        user_id: user.id,
    });
    useEffect(()=>{
        fnApplications();
    },[isLoaded])
    if(loadingApplications){
        return <BarLoader width={"100%"} color='#36d7b7' />
    }
  return (
    <div className='flex flex-col gap-2'>
       {applications?.map((application) => {
                return (
              <ApplicationCard
                key={application.id}
                application={application}
                isCandidate
              />
            );
})}
    </div>
  )
}

export default CreatedApplication
