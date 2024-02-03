import React, { useEffect, useState } from 'react';


interface Candidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  work_experience: string;
  positions_responsibility: string;
  training_courses: string;
  academic_personal_projects: string;
  skills: string[];
  portfolio: string;
  accomplishment: string;
}

const Resume: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../public/candidates.json');
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  console.log(candidates);

  return (
    <div>
      {candidates ? (
        candidates.map((candidate, index) => (
          <div key={index}>
            <h1>{candidate.name}</h1>
            <p>Email: {candidate.email}</p>
            <p>Phone: {candidate.phone}</p>
            <p>Location: {candidate.location}</p>
            <p>Education: {candidate.education}</p>
            <p>Work Experience: {candidate.work_experience}</p>
            <p>Positions & Responsibility: {candidate.positions_responsibility}</p>
            <p>Training Courses: {candidate.training_courses}</p>
            <p>Academic/Personal Projects: {candidate.academic_personal_projects}</p>
            <p>Skills: {candidate.skills.join(', ')}</p>
            <p>Portfolio: <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer">{candidate.portfolio}</a></p>
            <p>Accomplishment: {candidate.accomplishment}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Resume;
