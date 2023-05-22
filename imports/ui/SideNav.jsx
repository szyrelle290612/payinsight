import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class SideNav extends Component {
    render() {
        return (
            <div className="sidebar">
                <a href="#" className="brand-name w-inline-block">
                    <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a474b0877c09be4e337_Asset%208.svg" loading="lazy" alt="" />
                </a>
                <div className="sidebar-links-container">
                    <Link to={'/dashboard'} aria-current="page" className="sidebar-link-div w-inline-block ">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6b630f60221c3283cc_Asset%202.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Dashboard</div>
                    </Link>
                    <a  className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6c630f6037653283d1_Asset%203.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Activities</div>
                    </a>
                    <div className="sidebar-sub-div">
                        {/* <Link to="/activities-summary" aria-current="page" className="sidebar-sub-link w-inline-blockt">
                            <div className="sidebar-subtext">Activity Summary</div>
                        </Link> */}
                        <Link to="/attendance" className="sidebar-sub-link w-inline-block">
                            <div className="sidebar-subtext">Attendance</div>
                        </Link>
                        {/* <div className="sidebar-sub-link disabled">
                            <div className="sidebar-subtext">Rate History</div>
                        </div> */}
                    </div>
                    {/* <a href="/activities-summary" className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6c3303ce5c8644cede_Asset%204.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Paid Time-Off</div>
                    </a> */}
                    <Link to="/payroll" className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6ce4170671ac6617a9_Asset%205.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Payroll</div>
                    </Link>
                    {this.props.auth.includes('admin') &&
                    <Link to="/setting" className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="./images/asset-100.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Settings</div>
                    </Link>
                    }
                    {/* <a href="/payroll" className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6c7dd89d496770019d_Asset%206.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Expenses</div>
                    </a>
                    <a href="/payroll" className="sidebar-link-div w-inline-block">
                        <div className="sidebar-link-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a6b3f964e9bba3c2e11_Asset%207.svg" loading="lazy" alt="" />
                        </div>
                        <div className="sidebar-text">Form</div>
                    </a> */}
                </div>
            </div>
        )
    }
}
