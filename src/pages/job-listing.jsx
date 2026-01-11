import { getJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useEffect, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { BarLoader } from "react-spinners"
import JobCard from '@/components/job-card';
import { getCompanies } from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { State } from 'country-state-city';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 9;

const JobListingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company_id, setCompanyId] = useState('');
  const { isLoaded, session } = useSession();
    const [page, setPage] = useState(1);

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,

  } = useFetch(getJobs, {
    searchQuery,
    location,
    company_id,
  });
  const {
    fn: fnCompanies,
    data: companies,

  } = useFetch(getCompanies
  );
  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded])
  useEffect(() => {
    if (isLoaded)
      fnJobs();
  }, [isLoaded, session, location, company_id, searchQuery]);
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let query = formData.get("search-query");
    if (query) setSearchQuery(query);
  }
  const clearFilter = () => {
    setCompanyId("");
    setLocation("");
    setSearchQuery("");
  }

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className='font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>
      {/* Search and Filters */}
      <form
        onSubmit={handleSearch}
        className='h-14 flex w-full gap-2 items-center mb-3'
      >
        <Input
          type="text"
          placeholder='Search jobs...'
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant='blue'>Search</Button>
      </form>
      <div className="w-full flex flex-col sm:flex-row gap-2 items-center">
        <Select
          value={location}
          onValueChange={(value) => setLocation(value)}
        >
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompanyId(value)}
        >
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={clearFilter}
          variant="destructive"
          className="w-full sm:flex-1"
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {loadingJobs === false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            })
          ) : (
            <div>No jobs found </div>
          )}

        </div>
      )};
         {/* 🔽 PAGINATION */}
      {jobs?.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>

            {Array.from({ length: jobs.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((p) => Math.min(jobs.totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
}
    </div>
  )
};

export default JobListingPage;