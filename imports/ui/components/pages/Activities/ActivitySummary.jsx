import React, { Component } from 'react'
import { LineChart } from '../../extra/LineChart'
import HubstaffWatcher from '../../../../api/classes/client/HubstaffWatcher'


function convertSecondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return { total:`${hours}h ${minutes}m` };
  }
  
  function totalAmount(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
  
    return { total:((hours * 2) + (minutes/60 * 2)).toFixed(2)};
  }
  

export default class ActivitySummary extends Component {
    constructor(props){
        super(props)
        HubstaffWatcher.setWatcher(this,"ACTIVITYSUMMARY")
      }
    

      
    render() {
        HubstaffWatcher.initiateWatch("ACTIVITYSUMMARY")
        let totalTrack = HubstaffWatcher.TotalTrack
        return (
            <div className="activity-summary-content">
                <div>
                    <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100" className="w-tabs">
                        <div className="tabs-menu w-tab-menu" role="tablist">
                            <a data-w-tab="Tab 1" className="tab-link w-inline-block w-tab-link w--current" id="w-tabs-0-data-w-tab-0" href="#w-tabs-0-data-w-pane-0" role="tab" aria-controls="w-tabs-0-data-w-pane-0" aria-selected="true">
                                <div>Project Progress</div>
                            </a>
                            <a data-w-tab="Tab 2" className="tab-link w-inline-block w-tab-link" tabIndex="-1" id="w-tabs-0-data-w-tab-1" href="#w-tabs-0-data-w-pane-1" role="tab" aria-controls="w-tabs-0-data-w-pane-1" aria-selected="false">
                                <div>Hours per week</div>
                            </a>
                        </div>
                        <div className="w-tab-content">
                            <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active" id="w-tabs-0-data-w-pane-0" role="tabpanel" aria-labelledby="w-tabs-0-data-w-tab-0">
                                <div className="tab-content-div">
                                    <div className="project-progress">
                                        <div className="card-white">
                                            <div className="project-progress-chart-div">
                                    <LineChart/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div data-w-tab="Tab 2" className="w-tab-pane" id="w-tabs-0-data-w-pane-1" role="tabpanel" aria-labelledby="w-tabs-0-data-w-tab-1"></div>
                        </div>
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
                                    <div className="card-label">Unproductive website &amp; app usage</div>
                                    <div className="card-main-info-div">
                                        <div className="card-main-info">0m</div>
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
            </div>
        )
    }
}
