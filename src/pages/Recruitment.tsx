import RecruitmentCard from "../components/RecruitmentCard";
import Footer from "../components/Footer";
function Recruitment() {
  return (
    <div className="h-full w-full bg-streak bg-cover pt-24">
      <div className="flex flex-col pt-20 text-white">
        <div className="flex flex-row items-center justify-center">
          <h1 className="flex justify-center font-bayon text-6xl text-white">
            RECRUITMENT
          </h1>
        </div>
        <div className="flex flex-col items-center pt-10">
          <RecruitmentCard />
          <RecruitmentCard />
          <RecruitmentCard />
        </div>
      </div>
      <div className="mt-40">
        <Footer />
      </div>
    </div>
  );
}

export default Recruitment;
