import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'

import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="link">
        <div className="icon-container">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="company logo"
          />
          <div className="role-holder">
            <h1 className="role">{title}</h1>
            <div className="rating-holder">
              <BsStarFill className="star-image" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-middle-container">
          <div className="location-holder">
            <div className="icon-holder">
              <MdLocationOn className="job-card-icon" />
              <p className="icon-name">{location}</p>
            </div>
            <div className="icon-holder">
              <MdWork className="job-card-icon" />
              <p className="icon-name">{employmentType}</p>
            </div>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description">Description</h1>
        <p className="description-para">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
