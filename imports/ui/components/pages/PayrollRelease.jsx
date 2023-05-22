import React, { Component } from 'react'
import ClientWatcher from '../../../api/classes/client/ClientWatcher'
import moment from 'moment'

function convertSecondsToHoursAndMinutes(seconds) {
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return { total:`${hours}h ${minutes}m`,average:(seconds - 32400)/32400 * 100 };
  }


export default class PayrollRelease extends Component {
    constructor(props){
        super(props)
        ClientWatcher.setWatcher(this,"PAYROLLRELEASE")
    }

    componentDidMount(){
        ClientWatcher.getCurrentExchange()
    }

    handleSubmitRelease(currentExchange,start,end,earn,id,e){
        ClientWatcher.UpdatePayrollRelease(currentExchange,start,end,earn,id)
    }

  render() {
    ClientWatcher.initiateWatch()
    let exchangeRates = ClientWatcher.currentRates
    let data = ClientWatcher.PayrollData
    return (
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
                        <div>Amount (USD)</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-hd-content-div">
                        <div>Exchange Rate</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-hd-content-div">
                        <div>Amount (PHP)</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-hd-content-div">
                        <div>Action</div>
                    </div>
                </div>
        </div>

        <div className="table-content">

        {data && data.map((payroll)=>{
                return(
            <div className="table-row gray">
                <div className="table-col">
                    <div className="table-content-div">
                        <div>{moment(payroll.from).format('MMM')} {moment(payroll.from).format('DD')}-{moment(payroll.to).format('DD')}</div>
                    </div>
                </div>
                <div className="table-col">
                    {payroll.isCompleted ?
                    <div className="table-content-div">
                        <div className="tag-completed">Completed</div>
                    </div>
                    :
                    <div className="table-content-div">
                        <div className="tag-pending">Pending</div>
                    </div>
                    }
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        <div>{convertSecondsToHoursAndMinutes(payroll.total?.tracked).total}</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        <div>{convertSecondsToHoursAndMinutes(payroll.total?.tracked/payroll.total?.totalDays).total}</div>
                        <div className="percentage-div">
                            <div className="percentage-icon">
                                <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/645276841b872006888e98d4_Asset%2012.svg" loading="lazy" alt="" />
                            </div>
                            <div>{convertSecondsToHoursAndMinutes(payroll.total?.tracked/payroll.total?.totalDays).average.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        <div>${(payroll.total?.totalEarnUSD).toFixed(2)}</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        <div>{exchangeRates?.rates ? (exchangeRates.rates).toFixed(2) : "-"}</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        <div>₱{exchangeRates?.rates ? (exchangeRates.rates * payroll.total?.totalEarnUSD).toFixed(2):"-"}</div>
                    </div>
                </div>
                <div className="table-col">
                    <div className="table-content-div">
                        {!payroll.isCompleted ? <button style={{backgroundColor:'#29be60',color:'#fff',borderRadius:'15%'}} onClick={this.handleSubmitRelease.bind(this,exchangeRates?.rates,payroll.from,payroll.to,payroll.total.totalEarnUSD,payroll.userId)}>Release</button> : <button disabled>Completed</button>}
                    </div>
                </div>
            </div>
                )

            })}
           
        </div>
    </div>
    )
  }
}
