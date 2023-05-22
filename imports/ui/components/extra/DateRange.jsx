import moment from 'moment';
import React, { Component } from 'react'

import DatePicker from "react-datepicker";
import DashboardWatcher from '../../../api/classes/client/HubstaffWatcher';


export default class DateRange extends Component {
    constructor(props){
        super(props)
        this.state={
            start:moment().toDate(),
            end:null,
            filterdate:[]
        }
        DashboardWatcher.setWatcher(this,'DATEPICKER')
        this.handleSelect = this.handleSelect.bind(this)
    }



    handleSelect(dates){
        const [start, end] = dates;
        this.setState({start:start});
        this.setState({end:end});
        switch(this.props.type){
            case "dashboard":
                if(end !== null){
                    let newstart = moment(start).format('YYYY-MM-DD')
                    let newend = moment(end).format('YYYY-MM-DD')
                    DashboardWatcher.getActivity(newstart,newend,this.props.user?.profile?.baseRate,this.props.user?.profile?.id)
                }
            break;
            case "attendance":
                if(end !== null){
                    DashboardWatcher.getAttendance(start,end,this.props.user?.profile?.id)
            break;
                }
      }
    }
  render() {
    DashboardWatcher.initiateWatch('DATEPICKER')
      return (
        <DatePicker
        selected={this.state.start}
        onChange={this.handleSelect}
        startDate={this.state.start}
        endDate={this.state.end}
        selectsRange
      />
      )
  }
}


