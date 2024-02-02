import { useLoaderData } from "react-router-dom";
import JobCards from "./jobCards";

function App() {

  const popularJobs = useLoaderData();
  console.log(popularJobs)


  return (
    <>
      <div className="">

        <h3 className="text-4xl font-bold text-center mb-5">Most popular jobs for you</h3>
        <p className="text-sm text-center mb-10">The most updated platform about jobs that are open</p>
        <div className="grid md:grid-cols-4 gap-5">
          {
            popularJobs.map(job => <JobCards key={job.id}
              job={job}
            >
            </JobCards>)
          }
        </div>



      </div>
    </>
  );
}

export default App;
