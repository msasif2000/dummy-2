

const JobCards = ({ job }) => {
    const { picture, platform, title, post_time, description } = job;


    const inputString = description;
    const wordsArray = inputString.split(' ');
    const firstFiveWords = wordsArray.slice(0, 8);
    const shortDescription = firstFiveWords.join(' ');

    return (
        <div className="bg-[#F2F5FE] rounded-md p-6">
            <div className="flex">
                <figure><img src={picture} alt="" className="h-14" /></figure>
                <div>
                <p>{platform}</p>
                <p className="text-xs opacity-80">{post_time}</p>
                </div>
            </div>
            <div className="mt-2">
                <h2 className=" font-semibold">{title}</h2>
                <p className="text-xs opacity-80">{shortDescription}...</p>
            </div>
            <button className="mt-6 text-sm px-6 py-1 rounded-sm text-[#4864E1] border-2 border-[#4864E1] hover:bg-[#4864E1] hover:text-white"> Apply Now</button>
        </div>
    );
};

export default JobCards;