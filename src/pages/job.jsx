import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationCard from '@/components/application-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import MDEditor from '@uiw/react-md-editor';
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, { job_id: id });

  const handleStatusChange = (value) => {
    fnHiringStatus(value === 'open').then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader width="100%" color="#26d7b7" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-7 mt-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="font-extrabold text-4xl sm:text-5xl">
          {job?.title}
        </h1>
        <img
          src={job?.company?.logo_url}
          className="h-11 object-contain"
          alt={job?.title}
        />
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-3">

        {/* Row 1 */}
        <div className="flex justify-between items-center text-sm sm:text-base">

          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            {job?.location}
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {job?.applications?.length} Applicants
          </div>

          <div className="flex items-center gap-2">
            {job?.isOpen ? (
              <>
                <DoorOpen className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Open</span>
              </>
            ) : (
              <>
                <DoorClosed className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Closed</span>
              </>
            )}
          </div>

        </div>

        {/* Row 2 */}
        {job?.recruiter_id === user?.id && (
          <div className="flex justify-end">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-44 text-white ${
                  job?.isOpen ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <SelectValue
                  placeholder={`Hiring (${job?.isOpen ? 'Open' : 'Closed'})`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {loadingHiringStatus && (
          <BarLoader width="100%" color="#36d7b7" />
        )}

      </div>

      {/* Description */}
      <h2 className="text-2xl font-bold">About The Job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      {/* Requirements */}
      <h2 className="text-2xl font-bold">What We Are Looking For</h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {/* Apply Section */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications.find(
            (ap) => ap.candidate_id === user?.id
          )}
        />
      )}

      {/* Applications */}
      {job?.applications?.length > 0 &&
        job?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Applications</h2>
            {job?.applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        )}

    </div>
  );
};

export default JobPage;


