import React, { Component } from 'react'
import DateRange from '../../extra/DateRange'
import HubstaffWatcher from '../../../../api/classes/client/HubstaffWatcher'
import moment from 'moment'
import { withTracker } from "meteor/react-meteor-data";
import ClientWatcher from '../../../../api/classes/client/ClientWatcher';

function convertSecondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return { total:`${hours}h ${minutes}m` };
  }

class Attendance extends Component {
    constructor(props){
        super(props)
        HubstaffWatcher.setWatcher(this,'ATTENDANCE')
        ClientWatcher.setWatcher(this,'ATTENDANCE')
    }

    componentDidMount(){
        let start = moment().startOf('month')
        let end = moment()
        let user = this.props.user
        if(user.profile){
          let userId = user.profile.id
          HubstaffWatcher.getAttendance(start,end,userId)
        }
    }

    componentWillUnmount(){
        HubstaffWatcher.reset('attendance')
      }
    
    render() {
        HubstaffWatcher.initiateWatch('ATTENDANCE')
        let data = HubstaffWatcher.attendanceData;
        let user = this.props.user

        return (
            <div className="dashboard-content">
                <div className="dashboard-top">
                    <h3 className="sub-page-name">Attendance</h3>
                    <form action="/search" className="search w-form">
                        {/* <input type="search" className="search-input w-input" maxLength="256" name="query" placeholder="Search…" id="search" required="" />
                        <input type="submit" value="Search" className="search-button w-button" /> */}
                    </form>
                </div>
                <div className="attendance-conttent-div">
                    <div className="w-form">
                        {/* <form id="email-form" name="email-form" data-name="Email Form" method="get" aria-label="Email Form">
                            <div className="attendance-checkox-div">
                                <label className="w-checkbox checkbox-field">
                                    <input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox" className="w-checkbox-input" />
                                    <span className="w-form-label" for="checkbox">Show only users with shifts</span>
                                </label>
                                <label className="w-checkbox checkbox-field">
                                    <input type="checkbox" id="checkbox-2" name="checkbox-2" data-name="Checkbox 2" className="w-checkbox-input" />
                                    <span className="w-form-label" for="checkbox-2">Show only absent or late</span>
                                </label>
                            </div>
                        </form> */}
                        <div className="w-form-done" tabIndex="-1" role="region" aria-label="Email Form success">
                            <div>Thank you! Your submission has been received!</div>
                        </div>
                        <div className="w-form-fail" tabIndex="-1" role="region" aria-label="Email Form failure">
                            <div>Oops! Something went wrong while submitting the form.</div>
                        </div>
                    </div>
                    <div className="attendance-list-div">
                        <div className="attendance-user">
                            <div data-w-id="7fdc055c-3ad6-cc47-c0d9-eb4e8093a761" className="attendance-user-top">
                                {/* <div className="attendance-user-div">
                                    <div className="user-div-avatar">
                                        <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452806c7d5ffc9b7ed696c3_Asset%2016.svg" loading="lazy" alt="" />
                                    </div>
                                    <div>James &nbsp;[Graphic Design]</div>
                                </div> */}
                                {/* <div className="icon-accordion">
                                    <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645282d178695b78b750ad44_Asset%2022.svg" loading="lazy" alt="" />
                                </div> */}
                            </div>
                            <div className="user-attendance-table show">
                                <div className="div-block">
                                    <form action="/search" className="search w-form">
                                        {/* <input type="search" className="search-input w-input" maxLength="256" name="query" placeholder="Search…" id="search" required="" />
                                        <input type="submit" value="Search" className="search-button w-button" /> */}
                                    </form>
                                    <div className="date-range-container">
                                        <div className="date-range-label">date range</div>
                                            <DateRange type={"attendance"}  user={user}/>
                                    </div>
                                </div>
                                <div className="table-div">
                                    <div className="table-heading">
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Date</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Status</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Start time</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Actual Start time</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Shift Length</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Expected Hours</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Actual Hours Worked</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-content">
                                        {data && data.map((item,index)=>{
                                            return(
                                                <div key={index} className="table-row gray">
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>{moment(item.date).format('dddd')}, {moment(item.date).format('MMM DD')}</div>
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        {item.status =='absent' ?
                                                         <div className="tag-absent">Absent</div>
                                                        :
                                                        item.status =='weekends' ?<div className="tag-weekend">Weekend</div>
                                                        :
                                                        item.status =='onprogress' ?
                                                        <div className="tag-present">Ongoing</div>
                                                        :
                                                        <div className="tag-present">Present</div>
                                                        }
                              
                            
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>20:00 pm</div>
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>{item.status ? "-" :moment(item.created_at).subtract(10,'minutes').format('HH:mm a')}</div>
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>9h 00m</div>
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>9h 00m</div>
                                                    </div>
                                                </div>
                                                <div className="table-col">
                                                    <div className="table-content-div">
                                                        <div>{item.tracked ? convertSecondsToHoursAndMinutes(item.tracked).total:"-"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}



                                        {/* <div className="table-row">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-late">Late</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div> */}


                                        {/* <div className="table-row gray">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-absent">Absent</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div> */}


                                        

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="attendance-user">
                            <div data-w-id="004a71cb-b81c-a740-9432-0264b2f3a21a" className="attendance-user-top">
                                <div className="attendance-user-div">
                                    <div className="user-div-avatar">
                                        <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452806c7d5ffc9b7ed696c3_Asset%2016.svg" loading="lazy" alt="" />
                                    </div>
                                    <div>James &nbsp;[Graphic Design]</div>
                                </div>
                                <div className="icon-accordion">
                                    <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645282d178695b78b750ad44_Asset%2022.svg" loading="lazy" alt="" />
                                </div>
                            </div>
                            <div className="user-attendance-table">
                                <div className="div-block">
                                    <form action="/search" className="search w-form">
                                        <input type="search" className="search-input w-input" maxLength="256" name="query" placeholder="Search…" id="search" required="" />
                                        <input type="submit" value="Search" className="search-button w-button" />
                                    </form>
                                    <div className="date-range-container">
                                        <div className="date-range-label">date range</div>
                                        <div className="date-range-div">
                                            <div data-w-id="2587e60d-6193-e612-2581-d65926df259f" className="date-range-btn">
                                                <div>May 31, 2023 - June 31, 2023</div>
                                            </div>
                                            <div className="date-range-dropdown">
                                                <div className="from-range">
                                                    <div className="div-block-6">
                                                        <div className="div-block-5">
                                                            <div className="text-block">May </div>
                                                            <div>2023</div>
                                                        </div>
                                                        <div className="calendar-dates-div">
                                                            <div className="calendar-weeks">
                                                                <div className="calendar-week-labels">
                                                                    <div className="calendar-dates">
                                                                        <div>Su</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Mo</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Tu</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>We</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Th</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Fr</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Sat</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>1</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>2</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>3</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>4</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>5</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>6</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>7</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>8</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>9</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>10</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>11</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>12</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>13</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>14</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>15</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>16</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>17</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>18</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>19</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>20</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>21</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>22</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>23</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>24</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>25</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>26</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>27</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>28</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>29</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>30</div>
                                                                    </div>
                                                                    <div className="calendar-dates today">
                                                                        <div>31</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>1</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>2</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>3</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>4</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates disabled">
                                                                        <div>5</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>6</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>7</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>8</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>9</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>10</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>11</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="to-range">
                                                    <div className="div-block-6">
                                                        <div className="div-block-5">
                                                            <div className="text-block">June</div>
                                                            <div>2023</div>
                                                        </div>
                                                        <div className="calendar-dates-div">
                                                            <div className="calendar-weeks">
                                                                <div className="calendar-week-labels">
                                                                    <div className="calendar-dates">
                                                                        <div>Su</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Mo</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Tu</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>We</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Th</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Fr</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>Sat</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>1</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>2</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>3</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>4</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>5</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>6</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>7</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>8</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>9</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>10</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>11</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>12</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>13</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>14</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>15</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>16</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>17</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>18</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>19</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>20</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>21</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>22</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>23</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>24</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>25</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>26</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>27</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>28</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates">
                                                                        <div>29</div>
                                                                    </div>
                                                                    <div className="calendar-dates">
                                                                        <div>30</div>
                                                                    </div>
                                                                    <div className="calendar-dates today">
                                                                        <div>31</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>1</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>2</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>3</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>4</div>
                                                                    </div>
                                                                </div>
                                                                <div className="calendar-week-date-rows">
                                                                    <div className="calendar-dates disabled">
                                                                        <div>5</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>6</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>7</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>8</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>9</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>10</div>
                                                                    </div>
                                                                    <div className="calendar-dates disabled">
                                                                        <div>11</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-div">
                                    <div className="table-heading">
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Date</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Status</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Start time</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Actual Start time</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Shift Length</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Expected Hours</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Actual Hours Worked</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-content">
                                        <div className="table-row gray">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-present">Present</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-present">Present</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-row gray">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-present">Present</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-present">Present</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-row gray">
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>Wed, May 3</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div className="tag-present">Present</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>3:00 AM</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                            <div className="table-col">
                                                <div className="table-content-div">
                                                    <div>9h 00m</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}
export default withTracker(() => {
    ClientWatcher.initiateWatch("DASHBOARD");
    const isReady = ClientWatcher.getSubscribeUser()
    return {
        user: ClientWatcher.user(),
        loading: !isReady,
    };
})(Attendance);