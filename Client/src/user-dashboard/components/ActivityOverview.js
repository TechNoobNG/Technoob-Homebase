import { useContext } from "react";
import { UserContext } from "../context/userContext";

function ActivityOverview() {
  const { data: res } = useContext(UserContext);
  const lastQuizAttempted = res?.data?.lastCompletedQuizAttempt;

  return (
    <section className="user-activity-overview">
      <div className="user-card score">
        <div className="user-card-top">
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="icon icon-quiz"
            >
              <path
                d="M6.72999 11.4754L3.38314 11.2716C5.78218 4.93966 12.67 1.33318 19.3855 3.12628C26.538 5.03611 30.7865 12.3481 28.8747 19.458C26.9629 26.568 19.6148 30.7834 12.4623 28.8737C7.1516 27.4556 3.44191 23.0594 2.66602 17.9792"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10.6666V16L18.6667 18.6666"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="icon-title">Recent Quiz Score</span>
          </p>
          <p>
            <span className="score-number">
              {lastQuizAttempted?.quiz?.score
                ? lastQuizAttempted?.quiz?.score
                : 0}
              /20
            </span>
            <span className="score-label">Correct Responses</span>
          </p>
        </div>
        <div className="user-card-bottom">
          <p>
            <small className="score-total">20/20</small>
            <small className="score-label">High Score</small>
          </p>
          <p>
            <small className="score-percentage">
              {lastQuizAttempted?.quiz?.score
                ? `${Math.floor((lastQuizAttempted?.quiz?.score / 20) * 100)}%`
                : `0%`}
            </small>
            <small>Your score</small>
          </p>
        </div>
      </div>
      <div className="user-card participation">
        <div className="participation-top">
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="icon icon-leaderboard"
            >
              <path
                d="M5.69012 5.77039C7.93865 4.03651 11.4312 2.66663 16 2.66663C20.5688 2.66663 24.0613 4.03651 26.3099 5.77039C26.6257 6.01393 26.7836 6.13571 26.9132 6.35151C27.022 6.53265 27.1003 6.8074 27.1033 7.01868C27.1069 7.27036 27.0229 7.49421 26.8551 7.94193C26.4407 9.04715 26.2335 9.59975 26.1496 10.147C26.044 10.8373 26.0429 11.0063 26.1404 11.6978C26.2176 12.2461 26.6393 13.413 27.4828 15.747C27.792 16.6026 28 17.5722 28 18.6666C28 22.6666 24.6667 25.8333 21.3333 26.6666C18.4109 27.3973 16.8889 28.4444 16 29.3333C15.1111 28.4444 13.5891 27.3973 10.6667 26.6666C7.33333 25.8333 4 22.6666 4 18.6666C4 17.5722 4.20793 16.6026 4.51713 15.747C5.36067 13.413 5.78243 12.2461 5.85964 11.6978C5.95703 11.0063 5.95603 10.8373 5.85036 10.147C5.76659 9.59975 5.55936 9.04715 5.14491 7.94193C4.97701 7.49421 4.89307 7.27036 4.89669 7.01868C4.89973 6.8074 4.97801 6.53265 5.08679 6.35151C5.21636 6.13571 5.37428 6.01393 5.69012 5.77039Z"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.9208 10.1036L17.8593 11.9962C17.9873 12.2597 18.3285 12.5124 18.6165 12.5608L20.3177 12.8458C21.4056 13.0286 21.6616 13.8243 20.8776 14.6094L19.5551 15.9428C19.3312 16.1687 19.2085 16.6042 19.2779 16.916L19.6564 18.5667C19.9551 19.8732 19.2672 20.3787 18.1207 19.6958L16.5261 18.7442C16.2381 18.572 15.7636 18.572 15.4703 18.7442L13.8757 19.6958C12.7345 20.3787 12.0413 19.8679 12.3399 18.5667L12.7185 16.916C12.7879 16.6042 12.6652 16.1687 12.4413 15.9428L11.1187 14.6094C10.3401 13.8243 10.5908 13.0286 11.6787 12.8458L13.3797 12.5608C13.6624 12.5124 14.0037 12.2597 14.1317 11.9962L15.0703 10.1036C15.5823 9.07663 16.4141 9.07663 16.9208 10.1036Z"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="icon-title">leaderboard</span>
          </p>

          <p>
            <span className="participation-number">
              {res?.data?.rank ? res?.data?.rank : 0}
            </span>
            <span className="participation-label">Position</span>
          </p>
        </div>
        <div className="participation-bottom">
          <p>
            <small className="participation-percentage">40%</small>
            <small>Engagement</small>
          </p>
          <p>
            <small className="participation-total">8/10</small>
            <small className="participation-label">Responses</small>
          </p>
        </div>
      </div>
      <div className="user-card questions">
        <div className="questions-top">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon icon-textsms"
          >
            <title>textsms</title>
            <path d="M17.016 11.016v-2.016h-2.016v2.016h2.016zM12.984 11.016v-2.016h-1.969v2.016h1.969zM9 11.016v-2.016h-2.016v2.016h2.016zM20.016 2.016q0.797 0 1.383 0.586t0.586 1.383v12q0 0.797-0.586 1.406t-1.383 0.609h-14.016l-3.984 3.984v-18q0-0.797 0.586-1.383t1.383-0.586h16.031z"></path>
          </svg>

          <p>
            <span className="questions-number">20</span>
            <span className="questions-label">questions</span>
          </p>
        </div>
        <div className="questions-bottom">
          <p>
            <small className="questions-total">15 mins</small>
            <small className="questions-label">total time</small>
          </p>
          {/* <p>
        <small className="questions-percentage">90%</small>
        <small>Your score</small>
      </p> */}
        </div>
      </div>
    </section>
  );
}

export default ActivityOverview;
