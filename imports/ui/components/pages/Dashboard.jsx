import React, { Component } from 'react'
import DateRange from '../extra/DateRange'
import moment from 'moment'
import ClientWatcher from '../../../api/classes/client/ClientWatcher';
import { withTracker } from "meteor/react-meteor-data";
import HubstaffWatcher from '../../../api/classes/client/HubstaffWatcher';



function convertSecondsToHoursAndMinutes(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return { total:`${hours}h ${minutes}m` };
}




class Dashboard extends Component {
    constructor(props){
      super(props)
      this.state={
        baseRate:"",
        modExcangeRate:""
      }
      HubstaffWatcher.setWatcher(this,"DASHBOARD")
      ClientWatcher.setWatcher(this,"DASHBOARD")
    }

  componentDidMount(){
    ClientWatcher.getCurrentExchange()
    let start = moment().startOf('month').format('YYYY-MM-DD')
    let end = moment().format('YYYY-MM-DD') 
    let user = this.props.user
    if(user.profile){
      let currentBaseRate = user.profile.baseRate
      let userId = user.profile.id
      HubstaffWatcher.getActivity(start,end,currentBaseRate,userId)
    }
  }

  componentWillUnmount(){
    HubstaffWatcher.reset('dashboard')
  }

  render() {
    HubstaffWatcher.initiateWatch("DASHBOARD")
    ClientWatcher.initiateWatch("DASHBOARD")
    let data = HubstaffWatcher.activityData
    let totalTrack = HubstaffWatcher.TotalTrack
    let user = this.props.user
    let exchangeRates = ClientWatcher.currentRates

    return (
      <div className="dashboard-content">
        <div className="dashboard-top">
          <h3>Hello, {this.props.user?.profile.name}</h3>
          <div className="dashboard-date">
            <div>Today</div>
            <div className="date">{moment().format('MMM DD, YYYY')}</div>
          </div>
        </div>
        <div className="dahsboard-card-container">
          <div className="card-col-4">
            <div className="card-white-div">
              <div className="card-white">
                <div className="card-white-content">
                  <div className="card-label">Total time tracked</div>
                  <div className="card-main-info-div">
                    <div className="card-main-info">{convertSecondsToHoursAndMinutes(totalTrack.track).total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col-4">
            <div className="card-white-div">
              <div className="card-white">
                <div className="card-white-content">
                  <div className="card-label">Idle minutes</div>
                  <div className="card-main-info-div">
                    <div className="card-main-info">{convertSecondsToHoursAndMinutes(totalTrack.idle).total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col-4">
            <div className="card-white-div">
              <div className="card-white">
                <div className="card-white-content">
                  <div className="card-label">Total Earned </div>
                  <div className="card-main-info-div">
                    <div className="card-main-info">${ ClientWatcher.perHourCalc(this.state.baseRate?this.state.baseRate : user.profile?.baseRate,totalTrack.track).total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col-4">
            <div className="card-white-div">
              <div className="card-white">
                <div className="card-white-content">
                  <div className="card-label">Average hours work per day</div>
                  <div className="card-main-info-div">
                    <div className="card-main-info">{convertSecondsToHoursAndMinutes(totalTrack.average).total}</div>
                    <div className="percentage-div">
                      <div className="percentage-icon">
                        <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645276841b872006888e98d4_Asset%2012.svg" loading="lazy" alt="" />
                      </div>
                      <div>{totalTrack.percent.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-timeline">
          <div className="card-white">
            <div className="dashboard-time-div">
              <div className="dashbaord-timeline-top">
                <h4 className="table-hd">Timelines</h4>
                <div className="date-range-container">
                    <div className="date-range-label">Current Exchange ₱</div>
                    <div className="date-range-div">
                        <input type='number' value={this.state.modExcangeRate ? this.state.modExcangeRate : exchangeRates?.rates} style={{width:'60px',marginRight:'10px'}} onChange={(e)=>this.setState({modExcangeRate: e.target.value})} />
                   </div>
                   <div className="date-range-label">Base Rate</div>
                    <div className="date-range-div">
                        <input type='number' value={this.state.baseRate? this.state.baseRate : user.profile?.baseRate} style={{width:'40px',marginRight:'10px'}} onChange={(e)=>this.setState({baseRate:e.target.value})}/>
                   </div>
                  <div className="date-range-label">date range</div>
                  <div className="date-range-div">
                    <DateRange type={"dashboard"} user={user}/>
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
                      <div>Time Tracked</div>
                    </div>
                  </div>
                  <div className="table-col">
                    <div className="table-hd-content-div">
                      <div>Start time</div>
                    </div>
                  </div>
                  <div className="table-col">
                    <div className="table-hd-content-div">
                      <div>End Time</div>
                    </div>
                  </div>
                  <div className="table-col">
                    <div className="table-hd-content-div">
                      <div>Earned (USD)</div>
                    </div>
                  </div>
                  <div className="table-col">
                    <div className="table-hd-content-div">
                      <div>Earned (PHP)</div>
                    </div>
                  </div>
                </div>
                <div className="table-content">
                {data && data.map((data,index)=>{
                        return(
                          <div key={index} className="table-row gray">
                          <div className="table-col">
                            <div className="table-content-div">
                              <div>{moment(data.created_at).format('dddd')}, {moment(data.created_at).format('MMM DD')}</div>
                            </div>
                          </div>
                          <div className="table-col">
                            <div className="table-content-div">
                              <div>{convertSecondsToHoursAndMinutes(data.tracked).total}</div>
                            </div>
                          </div>
                          <div className="table-col">
                            <div className="table-content-div">
                              <div>{moment(data.created_at).subtract(10,'minutes').format('HH:mm a')}</div>
                            </div>
                          </div>
                          <div className="table-col">
                            <div className="table-content-div">
                              <div>{moment(data.updated_at).format('HH:mm a')}</div>
                            </div>
                          </div>
                          <div className="table-col">
                            <div className="table-content-div">
                              <div>
                                $ {
                                this.state.baseRate ? 
                                ClientWatcher.perHourCalc(this.state.baseRate,data.tracked).total :
                                ClientWatcher.perHourCalc(user.profile?.baseRate,data.tracked).total
                                }
                              </div>
                            </div>
                          </div>
                          <div className="table-col">
                            <div className="table-content-div">
                            <div>
                              {
                                this.state.baseRate || this.state.modExcangeRate ? 
                             `₱ ${((ClientWatcher.perHourCalc(this.state.baseRate?this.state.baseRate:user.profile?.baseRate,data.tracked).total) * ( this.state.modExcangeRate?this.state.modExcangeRate:exchangeRates?.rates)).toFixed(2)}`
                            :`₱ ${((ClientWatcher.perHourCalc(user.profile?.baseRate,data.tracked).total) * ( exchangeRates?.rates)).toFixed(2)}` 
                            }</div>
                            </div>
                          </div>
                        </div>
                        )
                      })}
                </div>
              </div>
            </div>
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
})(Dashboard);