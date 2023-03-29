import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'

import JobCard from '../JobCard'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileData: null,
    profileApiStatus: apiStatusConstants.initial,
    searchInput: '',
    checkboxArray: [],
    salaryRange: '',
    jobsData: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {salaryRange, checkboxArray, searchInput} = this.state
    const employmentTypes =
      checkboxArray.length !== 0 ? checkboxArray.join(',') : ''
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const {jobs} = data
      const jobsDetails = jobs.map(eachValue => ({
        companyLogoUrl: eachValue.company_logo_url,
        employmentType: eachValue.employment_type,
        id: eachValue.id,
        jobDescription: eachValue.job_description,
        location: eachValue.location,
        packagePerAnnum: eachValue.package_per_annum,
        rating: eachValue.rating,
        title: eachValue.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsData: jobsDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure, jobsData: ''})
    }
  }

  jobSuccessView = () => {
    const {jobsData} = this.state
    if (jobsData.length !== 0) {
      return (
        <ul className="jobs-list-container">
          {jobsData.map(eachJob => (
            <JobCard jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      )
    }
    return this.noJobView()
  }

  noJobView = () => (
    <div className="main-no-job-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-job-image"
        alt="no jobs"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  tryAgainJobs = () => {
    this.setState({apiStatus: apiStatusConstants.initial}, this.getJobDetails)
  }

  jobsFailureView = () => (
    <div className="main-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.tryAgainJobs}
      >
        Retry
      </button>
    </div>
  )

  loadingView = () => (
    <div className="main-loader-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  getJobsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.jobSuccessView()
      case apiStatusConstants.inProgress:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.jobsFailureView()
      default:
        return null
    }
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const response = await fetch(profileUrl, options)
    const data = await response.json()

    if (response.ok) {
      const newData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: newData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchKeyDown = e => {
    if (e.key === 'Enter') {
      this.getJobDetails()
    }
  }

  getProfileView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.getProfileSuccessView()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.profileLoaderView()
      default:
        return null
    }
  }

  getProfileSuccessView = () => {
    const {profileData, searchInput} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <>
        <div className="sm-search-bar-holder">
          <input
            type="search"
            className="search-bar"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            placeholder="Search"
            onKeyDown={this.searchKeyDown}
          />
          <button
            className="search-button"
            type="button"
            onClick={this.getJobDetails}
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <div className="success-profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
      </>
    )
  }

  retryAgain = () => this.getProfileDetails()

  getProfileFailureView = () => (
    <div className="failure-profile-container">
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.retryAgain}
      >
        Retry
      </button>
    </div>
  )

  profileLoaderView = () => (
    <div className="profile-loader">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  onChangeEmploymentType = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          checkboxArray: [...prevState.checkboxArray, event.target.value],
        }),
        this.getJobDetails,
      )
    } else {
      this.setState(
        prevState => ({
          checkboxArray: prevState.checkboxArray.filter(
            eachValue => eachValue !== event.target.value,
          ),
        }),
        this.getJobDetails,
      )
    }
  }

  onChangeSalaryRange = event => {
    if (event.target.checked) {
      this.setState({salaryRange: event.target.value}, this.getJobDetails)
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="main-jobs-container">
        <Header />
        <div className="jobs-container">
          <div className="filter-container">
            {this.getProfileView()}
            <hr />
            <h1 className="filter-heading">Type of Employment</h1>
            <ul className="filter-list">
              {employmentTypesList.map(eachType => (
                <li className="checkbox-holder" key={eachType.employmentTypeId}>
                  <input
                    type="checkbox"
                    className="employment-checkbox"
                    id={eachType.employmentTypeId}
                    value={eachType.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label className="label" htmlFor={eachType.employmentTypeId}>
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="filter-heading">Salary Range</h1>
            <ul className="filter-list">
              {salaryRangesList.map(eachType => (
                <li className="radio-holder" key={eachType.salaryRangeId}>
                  <input
                    type="radio"
                    className="salary-radio"
                    id={eachType.salaryRangeId}
                    value={eachType.salaryRangeId}
                    name="salary-radio"
                    onChange={this.onChangeSalaryRange}
                  />
                  <label className="label" htmlFor={eachType.salaryRangeId}>
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-job-view-container">
            <div className="lg-searchbar-holder">
              <input
                type="search"
                className="search-bar"
                value={searchInput}
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.searchKeyDown}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.getJobDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getJobsView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
