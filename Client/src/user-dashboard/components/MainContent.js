import Avatar from "./Avatar";

function MainContent() {
  return (
    <main className="main-content">
      <figure>
        <Avatar />
        <figcaption>
          <p>Hello Adeola,</p>
          <p>
            Today is Monday, <time>15th May, 2023</time>
          </p>
        </figcaption>
      </figure>
      <section className="banner">
        <img src="./img/remote-workers.png" alt="remote workers" />
        <div>
          <h2>
            One space <br /> to rule them all
          </h2>
          <p>Empowering technoobs with cutting-edge tools</p>
        </div>
      </section>
      <section className="user-activity-overview">
        <div className="user-card score">
          <div className="user-card-top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="icon icon-check"
            >
              <path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM15.66 15.66c1.449-1.449 2.344-3.45 2.344-5.66 0-4.421-3.584-8.004-8.004-8.004-2.21 0-4.211 0.896-5.66 2.344v0c-1.449 1.449-2.344 3.45-2.344 5.66 0 4.421 3.584 8.004 8.004 8.004 2.21 0 4.211-0.896 5.66-2.344v0zM6.7 9.29l2.3 2.31 4.3-4.3 1.4 1.42-5.7 5.68-3.7-3.7 1.4-1.42z"></path>
            </svg>
            <p>
              <span className="score-number">18/20</span>
              <span className="score-label">Correct Responses</span>
            </p>
          </div>
          <div className="user-card-bottom">
            <p>
              <small className="score-total">20/20</small>
              <small className="score-label">High Score</small>
            </p>
            <p>
              <small className="score-percentage">90%</small>
              <small>Your score</small>
            </p>
          </div>
        </div>
        <div className="user-card participation">
          <div className="participation-top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="icon icon-people"
            >
              <title>people_alt</title>
              <path d="M9 12.984q1.5 0 3.281 0.422t3.258 1.406 1.477 2.203v3h-16.031v-3q0-1.219 1.477-2.203t3.258-1.406 3.281-0.422zM15 12q-0.609 0-1.313-0.234 1.313-1.547 1.313-3.75 0-0.891-0.375-2.016t-0.938-1.781q0.703-0.234 1.313-0.234 1.641 0 2.813 1.195t1.172 2.836-1.172 2.813-2.813 1.172zM5.016 8.016q0-1.641 1.172-2.836t2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813zM16.688 13.125q2.484 0.375 4.406 1.383t1.922 2.508v3h-4.031v-3q0-2.297-2.297-3.891z"></path>
            </svg>

            <p>
              <span className="participation-number">8</span>
              <span className="participation-label">Participants</span>
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
      <section className="job-event">
        <article className="task-schedule">
          <h3>Tasks for today</h3>
          <label htmlFor="event" className="task task-event">
            <div className="task-description">
              <h4 className="task-heading">Women in tech summit</h4>
              <p className="task-category">Event</p>
            </div>
            <button className="task-button">
              <input type="radio" id="event" name="event" className="event" />
              <span className="radio-btn"></span>
            </button>
          </label>
          <label htmlFor="quiz" className="task task-quiz">
            <div className="task-description">
              <h4 className="task-heading">Front-end web development</h4>
              <p className="task-category">Quiz</p>
            </div>
            <button className="task-button">
              <input type="radio" id="quiz" name="event" className="quiz" />
              <span className="radio-btn"></span>
            </button>
          </label>
          <label htmlFor="competition" className="task task-competition">
            <div className="task-description">
              <h4 className="task-heading">Task management design</h4>
              <p className="task-category">Competition</p>
            </div>
            <button className="task-button">
              <input
                type="radio"
                id="competition"
                name="event"
                defaultChecked
                className="competition"
              />
              <span className="radio-btn"></span>
            </button>
          </label>
        </article>

        <article className="trending-job">
          <h3>Trending Jobs</h3>
          <div className="job-opening">
            <h4>Social Media Assistant</h4>
            <div className="job-description">
              <p>Dropbox . San Francisco, USA</p>
              <ul>
                <li>Full-Time</li>
                <li>Marketing</li>
                <li>Design</li>
              </ul>
            </div>
            <div className="job-application-status">
              <progress value={5} max={10} />
              <p>
                <strong>5 applied</strong> of 10 capacity
              </p>
              <button className="btn job-application-btn">Learn More</button>
            </div>
          </div>
          <div className="job-opening">
            <h4>Social Media Assistant</h4>
            <div className="job-description">
              <p>Dropbox . San Francisco, USA</p>
              <ul>
                <li>Full-Time</li>
                <li>Marketing</li>
                <li>Design</li>
              </ul>
            </div>
            <div className="job-application-status">
              <progress value={5} max={10} />
              <p>
                <strong>5 applied</strong> of 10 capacity
              </p>
              <button className="btn job-application-btn">Learn More</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default MainContent;
