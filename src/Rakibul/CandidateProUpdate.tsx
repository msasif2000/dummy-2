import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import CandidateNav from "../CommonNavbar/CandidateNav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosDev from "../../hooks/useAxiosDev";
import useAuth from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";

interface EducationData {
  university: string;
  subject: string;
  fromDate: Date | null; // Update fromDate and toDate to Date | null
  toDate: Date | null;
}

interface ExperienceData {
  company: string;
  position: string;
  fromDate: Date | null; // Update fromDate and toDate to Date | null
  toDate: Date | null;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  bio: string;
  skills: string[];
  experience: string;
  education: EducationData[];
  experienceDetails: ExperienceData[];
  photo: File;
  village: string;
  city: string;
  country: string;
  availability: string;
  position: string;
  work: string;
}

// changed on 2 february--

interface CurrentUserData {
  name: string;
  bio: string;
  city: string;
  country: string;
  phone: string;
  position: string;
  village: string;
}

// ----

const CandidateProUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosDev = useAxiosDev();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUserData | null>(null);
  // const [currentUser, setCurrentUser] = useState(null);
  // const axiosPublic = useAxiosPublic()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      skills: [],
      education: [],
      experienceDetails: [],
    },
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [additionalExperiences, setAdditionalExperiences] = useState<
    ExperienceData[]
  >([]);
  const [additionalEducations, setAdditionalEducations] = useState<
    EducationData[]
  >([]);

  const selectedSkills = watch("skills");

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      Array.isArray(selectedSkills)
        ? selectedSkills.filter((selectedSkill) => selectedSkill !== skill)
        : []
    );
  };

  const addExperience = () => {
    setAdditionalExperiences([
      ...additionalExperiences,
      {
        company: "",
        position: "",
        fromDate: null,
        toDate: null,
      },
    ]);
  };

  const addEducation = () => {
    setAdditionalEducations([
      ...additionalEducations,
      {
        university: "",
        subject: "",
        fromDate: null,
        toDate: null,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = [...additionalExperiences];
    updatedExperiences.splice(index, 1);
    setAdditionalExperiences(updatedExperiences);
  };

  const removeEducation = (index: number) => {
    const updatedEducations = [...additionalEducations];
    updatedEducations.splice(index, 1);
    setAdditionalEducations(updatedEducations);
  };

  const backToProfile = () => {
    navigate(-1);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);

    try {
      const updateUserDataResponse = await axiosDev.put(
        `/user-update/${user?.email}`,
        data
      );

      if (updateUserDataResponse.data.message === "true") {
        const formData = new FormData();
        formData.append("photo", data.photo);

        const updateUserPhotoResponse = await axiosDev.post(
          `/user-update-photo/${user?.email}`,
          formData
        );

        if (updateUserPhotoResponse.data.message === true) {
          toast.success("Profile Updated Successfully");
          navigate("/dashboard/candidateProfile");
        } else {
          toast.error("Failed to update profile photo");
        }
      } else {
        toast.error("Failed to update profile data");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const backToResume = () => {
    navigate("/dashboard/candidateProfile/resume");
  };

  useEffect(() => {
    if (user?.email) {
      axiosDev
        .get(`/user-profile/${user.email}`)
        .then((res) => {
          console.log(res.data);
          setCurrentUser(res.data);
        })
        .catch((error) => console.log(error))
    };
  }, [user]);

  return (
    <div className="min-h-screen">
      <CandidateNav
        text="Upgrade your information"
        btn="Return"
        btn2="See Resume"
        handleClick={backToProfile}
        handleClick2={backToResume}
      />

      <div className="bg-white px-2 py-5">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex md:space-x-10 py-10 ">
            <div className="form-control w-full md:w-1/3">
              <label
                className="font-bold text-gray-400 text-xl"
                htmlFor="photo"
              >
                Profile Picture
              </label>

              <input
                type="file"
                name="photo"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("photo", file);
                  }
                }}
                className="py-4 outline-none font-bold bg-transparent border-b-2
              w-full border-gray-300 text-xl hover:border-accent duration-500"
              />
            </div>
          </div>

          <div className="pb-10 space-y-6">
            {/* Second div group */}
            <div className="md:flex md:space-x-10">
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  defaultValue={currentUser?.name}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("position", {
                    required: "position is required",
                  })}
                  defaultValue={currentUser?.position}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("phone", { required: "phone is required" })}
                  defaultValue={currentUser?.phone}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
            </div>
            {/* Second div group */}
            <div className="md:flex md:space-x-10">
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("village", { required: "Village is required" })}
                  defaultValue={currentUser?.village}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("city", { required: "City is required" })}
                  defaultValue={currentUser?.city}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
              <div className="form-control w-full">
                <input
                  type="text"
                  {...register("country", { required: "Country is required" })}
                  defaultValue={currentUser?.country}
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>
            </div>
          </div>

          <div className="pb-10 space-y-6">
            <div className="form-control w-full">
              <textarea
                rows={3}
                {...register("bio", { required: "bio is required" })}
                defaultValue={currentUser?.bio}
                className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
              ></textarea>
            </div>

            <div className="form-control w-full">
              <div className="flex flex-wrap">
                {Array.isArray(selectedSkills) &&
                  selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-green-300 font-bold rounded-full px-4 py-2 m-2 flex items-center"
                    >
                      <span className="mr-2">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-red-500"
                      >
                        <AiOutlineCloseCircle />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  value={inputValue}
                  placeholder="Type a skill and press enter"
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue.trim() !== "") {
                      setValue(
                        "skills",
                        Array.isArray(selectedSkills)
                          ? [...selectedSkills, inputValue.trim()]
                          : [inputValue.trim()]
                      );
                      setInputValue("");
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>

            {errors.skills && <p>{errors.skills.message}</p>}

            <div className="md:flex md:space-x-10">
              <div className="form-control w-full">
                <input
                  type="number"
                  {...register("experience", {
                    required: "experience is required",
                  })}
                  placeholder="Years of experience"
                  className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
                />
              </div>

              <select
                {...register("availability", {
                  required: "availability is required",
                })}
                name="availability"
                id="availability"
                className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-500"
              >
                <option value="" disabled selected>
                  Availability
                </option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>

              <select
                {...register("work", {
                  required: "work type is required",
                })}
                name="work"
                id="work"
                className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
              >
                <option value="" disabled selected>
                  Preferred work setting
                </option>
                <option value="Remote">Remote</option>
                <option value="Office">Office</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <p className="text-2xl font-bold mb-4 pb-10">Experience</p>
          {additionalExperiences.map((experience, index) => (
            <div key={index} className="form-control w-full mt-6 space-y-1">
              <h2 className="text-lg font-bold mb-4">Experience {index + 1}</h2>
              <div className="md:flex md:space-x-4 pb-10">
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    {...register(`experienceDetails.${index}.company`, {
                      required: "Company name is required",
                    })}
                    placeholder="Company Name"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    {...register(`experienceDetails.${index}.position`, {
                      required: "Position is required",
                    })}
                    placeholder="Position"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
              </div>
              <div className="md:flex md:space-x-4 mt-4">
                <div className="w-full md:w-1/2">
                  <DatePicker
                    selected={experience.fromDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setAdditionalExperiences((prevState) => {
                          const updatedExperiences = [...prevState];
                          updatedExperiences[index].fromDate = date;
                          return updatedExperiences;
                        });
                        setValue(`experienceDetails.${index}.fromDate`, date);
                      }
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="From Date"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <DatePicker
                    selected={experience.toDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setAdditionalExperiences((prevState) => {
                          const updatedExperiences = [...prevState];
                          updatedExperiences[index].toDate = date;
                          return updatedExperiences;
                        });
                        setValue(`experienceDetails.${index}.toDate`, date);
                      }
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="To Date"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-red-500 mt-2 text-right"
              >
                Remove Experience
              </button>
            </div>
          ))}

          <div className="mt-4">
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-500 text-xl font-semibold"
            >
              Add Experience
            </button>
          </div>
          <p className="text-2xl font-bold mb-4 py-10">Education</p>
          {additionalEducations.map((education, index) => (
            <div key={index} className="form-control w-full mt-6">
              <h2 className="text-lg font-bold mb-4">Education {index + 1}</h2>
              <div className="md:flex md:space-x-4">
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    {...register(`education.${index}.university`, {
                      required: "University name is required",
                    })}
                    placeholder="University Name"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    {...register(`education.${index}.subject`, {
                      required: "Subject studied is required",
                    })}
                    placeholder="Studied Subject"
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
              </div>
              <div className="md:flex md:space-x-4 mt-4">
                <div className="w-full md:w-1/2">
                  <DatePicker
                    selected={education.fromDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setAdditionalEducations((prevState) => {
                          const updatedEducations = [...prevState];
                          updatedEducations[index].fromDate = date;
                          return updatedEducations;
                        });
                        setValue(`education.${index}.fromDate`, date);
                      }
                    }}
                    placeholderText="From Date"
                    dateFormat="dd-MM-yyyy" // Add date format if needed
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <DatePicker
                    selected={education.toDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setAdditionalEducations((prevState) => {
                          const updatedEducations = [...prevState];
                          updatedEducations[index].toDate = date;
                          return updatedEducations;
                        });
                        setValue(`education.${index}.toDate`, date);
                      }
                    }}
                    placeholderText="To Date"
                    dateFormat="dd-MM-yyyy" // Add date format if needed
                    className="py-4 outline-none font-bold bg-transparent border-b-2 w-full border-gray-300 text-xl hover:border-accent duration-50"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-500 mt-2 text-right"
              >
                Remove Education
              </button>
            </div>
          ))}

          <div className="mt-4">
            <button
              type="button"
              onClick={addEducation}
              className="text-blue-500 text-xl font-semibold"
            >
              Add Education
            </button>
          </div>

          <button type="submit" className="btn btn-accent mb-10 w-full ">
            {loading ? (
              <span className="loading loading-ring loading-lg"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>

  );
};

export default CandidateProUpdate;
