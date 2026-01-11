import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';

const CreatedJobs = () => {
    const {user,isLoaded} = useUser();
    const{
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs

    } = useFetch(getMyJobs,{
        recruiter_id: user.id,
    });
    useEffect(() =>{
        fnCreatedJobs();
    },[isLoaded])
   
  return (
   <div>
     {loadingCreatedJobs? (
         <BarLoader width={"100%"} color='#36d7b7' />):(
         <div className='mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {createdJobs?.length? (
                createdJobs.map((job)=>{
                    return(
                        <JobCard
                        key= {job.id}
                        job={job}
                        onJobSaved = {fnCreatedJobs}
                        isMyJob
                        />
                    );
                })

            )
        :  (
            <div>No jobs found</div>
        )
        }
        </div>
        )
    }
   </div>
  )
}

export default CreatedJobs
