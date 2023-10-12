function JobEvent() {
  return (
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
  );
}

export default JobEvent;
