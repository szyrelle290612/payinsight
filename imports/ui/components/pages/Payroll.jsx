import React, { Component } from 'react'
import ClientWatcher from '../../../api/classes/client/ClientWatcher'
import moment from 'moment'
import { withTracker } from "meteor/react-meteor-data";
import { Link } from 'react-router-dom';
import { Toast } from '../extra/Toast';

function convertSecondsToHoursAndMinutes(seconds) {
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return { total:`${hours}h ${minutes}m`,average:(seconds - 32400)/32400 * 100 };
  }


class Payroll extends Component {
    constructor(props){
        super(props)

        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    
        this.state={
            balance:0,
            selectedMonth: currentMonth,
            quarter:"First",
            baseRate:0,
            received:0,
            modExcangeRate:0
        }
        
        ClientWatcher.setWatcher(this,'PAYROLL')
    }
    componentDidMount(){
        this.setState({balance:this.props.user?.profile?.balance})
        ClientWatcher.getCurrentExchange()
        // ClientWatcher.getPayroll()
        
    }

    // componentDidUpdate(prevProps, prevState){
    //     if(prevState !== this.state.balance){
    //         ClientWatcher.getPayroll()
    //     }
    // }

    handleMonthChange = (event) => {
        let {name,value} = event.target
        this.setState({
          [name]: value
        });
      }

    handleSubmit(e){
        e.preventDefault()
        const { selectedMonth,quarter,baseRate,received } = this.state;
        ClientWatcher.computeSalary(selectedMonth,quarter,baseRate,received)
      }

    render() {
        ClientWatcher.initiateWatch('PAYROLL')
        let exchangeRates = ClientWatcher.currentRates
        let user = this.props.user 
        let data = ClientWatcher.PayrollData
        const { selectedMonth,quarter,baseRate,received } = this.state;

        return (
            <div className="dashboard-content">
                <div className="payroll-content-div">
                    <div className="dashboard-top">
                        <h3 className="table-name">Available salary</h3>
                    </div>
                    <div className="dahsboard-card-container">
                        <div className="card-col-4">
                            <div className="card-white-div">
                                <div className="card-white">
                                    <div className="card-white-content">
                                        <div className="card-label">Time since last salary</div>
                                        <div className="card-main-info-div">
                                            <div className="card-main-info">{data ? `${moment(data.startDate).format('MMM DD')}-${moment(data.endDate).format('DD')}` : '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col-4">
                            <div className="card-white-div">
                                <div className="card-white">
                                    <div className="card-white-content">
                                        <div className="card-label">Expected Salary</div>
                                        <div className="card-main-info-div">
                                        <div className="card-main-info green">₱{data && exchangeRates?.rates ? ClientWatcher.perHourCalc(this.state.baseRate ?this.state.baseRate:user.profile?.baseRate, data?.totalTracked,  this.state.modExcangeRate ? this.state.modExcangeRate :  exchangeRates?.rates).expected:""}</div>
                                            {/* <div className="card-main-info green">+ $6,245.52</div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col-4">
                            <div className="card-white-div">
                                <div className="card-white">
                                    <div className="card-white-content">
                                        <div className="card-label">base monthly salary</div>
                                        <div className="card-main-info-div">
                                            <div className="card-main-info">${user.profile?.baseRate && (user.profile?.baseRate*9*20).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col-4">
                            <div className="card-white-div">
                                <div className="card-white">
                                    <div className="card-white-content">
                                        <div className="card-label">your yearly salary</div>
                                        <div className="card-main-info-div">
                                            <div className="card-main-info">${user.profile?.baseRate && (user.profile?.baseRate*9*261).toFixed(2)  }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="table-container">
                        <h3 className="table-name">Compute Salary</h3>
                        <div className="card-white">
                                    <div className="card-white-content">
                        <div className="date-range-container">
                            <div className="date-range-label">Month</div>
                            <div className="date-range-div">
                            <select name='selectedMonth' value={selectedMonth} onChange={this.handleMonthChange} style={{marginRight:'10px'}}>
                                <option value="">Select a month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </div>
                        <div className="date-range-label">Quarter</div>
                            <div className="date-range-div">
                            <select name='quarter' value={quarter} onChange={this.handleMonthChange} style={{marginRight:'10px'}}>
                                <option value="">Select a month</option>
                                <option value="First">First</option>
                                <option value="Second">Second</option>
                            </select>
                        </div>
                        <div className="date-range-label">Current Exchange ₱</div>
                            <div className="date-range-div">
                                <input type='number' value={this.state.modExcangeRate ? this.state.modExcangeRate : exchangeRates?.rates} style={{width:'60px',marginRight:'10px'}} onChange={(e)=>this.setState({modExcangeRate: e.target.value})} />
                            </div>
                        <div className="date-range-label">Base Rate</div>
                            <div className="date-range-div">
                            <input type='number' value={baseRate? baseRate : user.profile?.baseRate} style={{width:'60px',marginRight:'10px'}} onChange={(e)=>this.setState({baseRate:e.target.value})}/>
                            </div>
                        <div className="date-range-label">Payment Received $</div>
                            <div className="date-range-div">
                            <input type='number' value={received} style={{width:'60px',marginRight:'10px'}} onChange={(e)=>this.setState({received:e.target.value})}/>
                            </div>
                            <button onClick={this.handleSubmit.bind(this)} style={{marginLeft:'10px'}}>Submit</button>
                            <button onClick={()=>ClientWatcher.resetData()} style={{marginLeft:'10px'}}>Reset</button>
                        </div>
                        </div>
                        </div>
                        <div className="user-attendance-table show">
                            <div className="div-block">
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
                                                <div>Total hours</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Average hours per day</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Expected Amount (USD)</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Received Amount (USD)</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Exchange Rate</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Expected Amount (PHP)</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-hd-content-div">
                                                <div>Received Amount (PHP)</div>
                                            </div>
                                        </div>
                                </div>
                                {data && 
                                <div className="table-content">
                                    <div className="table-row gray">
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>{data && moment(data.startDate).format('MMM')} {moment(data.startDate).format('DD')}-{moment(data.endDate).format('DD')}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>{data ? convertSecondsToHoursAndMinutes(data?.totalTracked).total : "-"}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>{convertSecondsToHoursAndMinutes(data?.totalTracked/data?.days).total}</div>
                                                <div className="percentage-div">
                                                    <div className="percentage-icon">
                                                        <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645276841b872006888e98d4_Asset%2012.svg" loading="lazy" alt="" />
                                                    </div>
                                                    <div>{convertSecondsToHoursAndMinutes(data?.totalTracked/data?.days).average.toFixed(2)}%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>${ClientWatcher.perHourCalc(this.state.baseRate ?this.state.baseRate:user.profile?.baseRate,data?.totalTracked).total}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>${this.state.received}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>{exchangeRates?.rates ? exchangeRates.rates : "-"}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>₱{exchangeRates?.rates ? ClientWatcher.perHourCalc(this.state.baseRate ?this.state.baseRate:user.profile?.baseRate, data?.totalTracked,  this.state.modExcangeRate ? this.state.modExcangeRate :  exchangeRates?.rates).expected:"-"}</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>₱{this.state.received ?(this.state.received * (this.state.modExcangeRate ? this.state.modExcangeRate :  exchangeRates?.rates)).toFixed(2) :"-"}</div> 
                                            </div>
                                        </div>
                                    </div>
                                   
                                    {/* <div className="table-row">
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>10/03/23</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div className="tag-completed">Completed</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>45h &nbsp;39m</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>9h 05m</div>
                                                <div className="percentage-div">
                                                    <div className="percentage-icon">
                                                        <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645276841b872006888e98d4_Asset%2012.svg" loading="lazy" alt="" />
                                                    </div>
                                                    <div>0.4%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>$200</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>55.3620</div>
                                            </div>
                                        </div>
                                        <div className="table-col">
                                            <div className="table-content-div">
                                                <div>₱11,063.80</div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                  } 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withTracker(() => {
    ClientWatcher.initiateWatch('PAYROLL')
    const isReady = ClientWatcher.getSubscribeUser()
    return {
        user: ClientWatcher.user(),
        loading: !isReady,
    };
})(Payroll);