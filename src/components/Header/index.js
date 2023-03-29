import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {MdHome, MdWork} from 'react-icons/md'

import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="main-header-container">
      <Link to="/" className="website-logo-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-website-logo"
          alt="website logo"
        />
      </Link>

      <ul className="header-list">
        <li className="header-item">
          <Link to="/" className="header-link">
            <p className="header-text">Home</p>
            <MdHome className="header-icon" />
          </Link>
        </li>

        <li className="">
          <Link to="/jobs" className="header-link">
            <p className="header-text">Jobs</p>
            <MdWork className="header-icon" />
          </Link>
        </li>
        <li className="button-list-item">
          <button
            className="lg-logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
          <button
            className="sm-logout-button"
            type="button"
            onClick={onClickLogout}
          >
            <FiLogOut className="header-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
