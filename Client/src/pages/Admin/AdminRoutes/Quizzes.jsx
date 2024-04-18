import { useContext } from "react";
import QuizComponent from "../../../components/QuizComponent";
import { useState } from "react";
import RecentActivities from "../../../components/Tables/RecentActivities";
import { AppContext } from "../../../AppContext/AppContext";
import serverApi from "../../../utility/server";
import { toast } from "react-toastify";
import showToast from "../../../utility/Toast";

const Quizzes = () => {
  const username = null;
  const [active, setActive] = useState("Quiz");
  const stack = [
    "Frontend Development",
    "UI/UX",
    "Backend Development",
    "Mobile Development",
    "Product Management",
    "Project Management",
    "Technical Writing",
    "Cloud Development",
    "Cybersecurity",
    "Software Testing",
    "DevOps",
    "SEO",
    "Product Design"
]
  const [loading, setLoading] = useState(false)
  const [answerInput, setAnswerInput] = useState({
    id: 1,
    question:
      "What is the output of the following code?\n\n```javascript\nconsole.log(2 + 2);\n```",
    answers: [
      { id: 1, answer: "" },
      { id: 2, answer: "" },
      { id: 3, answer: "" },
      { id: 4, answer: "" },
      { id: 5, answer: "" },
    ],
    correctAnswerId: 2,
  });
  const { UserProfile } = useContext(AppContext);

  const [data, setData] = useState({
    theme: "",
    type: "quiz",
    stack: "",
    instructions: "",
    questions_answers: [
     
    ],
    duration: 1,
    deadline: "",
  });



  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

    // console.log(data);
  };
  // const handleQuestions = (e) => {
  //   const newData =
  //   setData({...data, questions_answers:[...data.questions_answers, newData]})
  // }
  const handleAnswers = (e, i) => {
   answerInput.answers.forEach((item) => {
      if (item.id === i + 1) {
        item.answer = e.target.value;
      }
    });
    // setAnswerInput({ ...answerInput, answers: answer });
    // console.log(answerInput);
    // if(i+1 === answerInput?.answers.id){
    //   setAnswerInput({...answerInput, answers:answer})
    //   console.log(answer, answerInput);
    // }
  };

  // console.log("seeing answers", answerInput, data);

  const handlePublishQuiz = async (e) => {
    e.preventDefault();
    setData({ ...data, questions_answers: answerInput });
    setLoading(true)
    const abortController = new AbortController();
    
    try {
      serverApi.requiresAuth(true)
      const {data:response} = await showToast({
        type: "promise",
        promise: serverApi.post(
          '/quizzes/create',
          data,
          {
            signal: abortController.signal,
            headers: {
              'content-type': 'application/json',
            }
          }
        )
      })

      const responseData = response?.data
      console.log(responseData);
      // await serverApi.post("/quizzes/create",data,
      // {
      //   headers: {'content-type': 'application/json'}
      // });
      // toast.success()
    } catch (error) {
      console.log(error);
      
    }finally{
      setLoading(false)
    }

    console.log(data);
  };
  return (
    <section className="w-full overflow-hidden">
      <div className="flex justify-between ">
        <div className="flex  sm:flex-row mb-5 md:mb-0 py-1 sm:py-5 justify-start sm:justify-center items-start sm:items-center ">
          <h1 className=" md:text-3xl text-xl font-semibold">
            Hey, {UserProfile.firstname} -
          </h1>
          <p className="md:pt-2 pt-1 text-sm ml-3 sm:text-lg text-[#3A3A3A66] sm:text-black">
            Welcome to the resource page.
          </p>
        </div>
      </div>

      <div className="flex flex-col h-full bg-white lg:shadow-lg w-full p-5 rounded-md">
        <div className="w-full flex max-lg:flex-col gap-3 lg:gap-24 py-5 lg:py-10 nun justify-between lg:items-center">
          <div className="flex ">
            <h1 className=" font-semibold md:text-3xl text-xl">Quizzes and Competition</h1>
          </div>
          <input type="text" placeholder="Search" className="p-3 border w-full lg:w-[400px] rounded-[5px]" />
        </div>
        <form className="flex flex-col gap-3 mb-5 lg:mb-10">
          <div className="flex border-b gap-2 lg:gap-4">
            <p
              onClick={() => {
                setData({ ...data, type: "quiz" });
              }}
              className={`${
                data.type === "quiz" &&
                "bg-gray-100 text-tblue  border-b-2 border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%] cursor-pointer`}
            >
              Quiz
            </p>
            <p
              onClick={() => {
                setData({ ...data, type: "competition" });
              }}
              className={`${
                data.type === "competition" &&
                "text-tblue border-b-2  border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%] cursor-pointer`}
            >
              Competition
            </p>
          </div>
            <QuizComponent
              data={data}
              setData={setData}
              handleChange={handleChange}
            />
          <h1 className="mt-10 font-semibold lg:text-lg">Add Questions</h1>
          <div className="flex border-b gap-2 lg:gap-4">
            <p
              className={`${
                active === "Quiz" && "bg-gray-100 text-tblue border-b-2 border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%]`}
            >
              Multiple choice
            </p>
            <p
              className={`${
                active === "competition" && "text-tblue border-b-2 border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%]`}
            >
              Open ended
            </p>
          </div>
          <div className="flex flex-col gap-10 border-b py-2">
            <div className="flex gap-12 w-full justify-between items-center ">
              <h1 className="text-lg font-semibold">Question</h1>
              <input
                type="text"
                onBlur={(e) =>
                  setAnswerInput({ ...answerInput, question: e.target.value })
                }
                placeholder="~~input text here~~"
                className="border p-1 w-full"
              />
            </div>
          {data?.type === "quiz" &&  <div className="flex gap-12 w-[99%] justify-start items-center ">
              <h1 className="text-lg font-semibold">Answers</h1>
              <div className="w-full gap-3 flex max-lg:flex-col items-center justify-between">
                {answerInput?.answers?.map((item, i) => (
                  <input
                    key={i}
                    onBlur={(e) => handleAnswers(e, i)}
                    type="text"
                    placeholder={`${item?.id} ~~input text here~~`}
                    className="border p-1 w-full lg:w-[20%] "
                  />
                ))}
              </div>
            </div>}
            <div className="flex gap-12 w-[99%] justify-start items-center ">
              <h1 className="text-lg whitespace-nowrap font-semibold">
                Correct Answer
              </h1>
              <div className="w-full gap-3 flex max-lg:flex-col items-center justify-between">
                <input
                  onBlur={(e) =>
                    setAnswerInput({
                      ...answerInput,
                      correctAnswerId: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="input correct answer"
                  className="border capitalize p-1 w-full lg:w-[20%] "
                />
              </div>
            </div>
            <button className="border w-full lg:w-fit rounded-md text-tblue border-tblue px-6 p-4 lg:py-2">
              Add Question
            </button>
            <button className="border w-full lg:w-fit rounded-md text-tblue border-tblue px-6 p-4 lg:py-2">
              Add Question
            </button>
          </div>
          <div className="w-full flex items-center">
            <div className="flex max-lg:flex-col gap-5 w-full lg:justify-end">
              <button className=" px-16 py-3 bg-gray-400 rounded-md font-semibold">
                Save to draft
              </button>
              <button
                onClick={handlePublishQuiz}
                className="px-16 py-3 bg-tblue text-white rounded-md "
              >
                {loading ? "Publishing..." : "Publish Quiz"}
              </button>
            </div>
          </div>
        </form>
        <RecentActivities />
      </div>
    </section>
  );
};

export default Quizzes;
