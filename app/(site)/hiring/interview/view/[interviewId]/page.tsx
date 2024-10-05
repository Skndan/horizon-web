import { Mail } from "./_components/mail";

const InterviewPage = ({ params }: { params: { interviewId: string } }) => {

  return (
    <>

      {/* <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <Heading title={`Interviews `} description="Manage your interview schedules" /> 
          </div>
          <Separator /> */}
      <Mail
        interviewId={params.interviewId}
      />
      {/* </div>
      </div> */}
    </>)
}

export default InterviewPage;