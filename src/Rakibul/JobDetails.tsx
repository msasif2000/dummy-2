import { useEffect, useState } from "react";
import EachJobDetails from "./EachJobDetails";

const JobDetails = () => {

    const [ detailsJobs, setDetailsJobs] = useState([]);

    useEffect(() => {
        fetch('popular.json')
            .then(res => res.json())
            .then(data => setDetailsJobs(data))
    }, [])

    return (
        <div>
            {
            detailsJobs.map(detailsJob => <EachJobDetails key={detailsJob.id}
              detailsJob={detailsJob}
            >
            </EachJobDetails>)
          }
        </div>
    );
};

export default JobDetails;