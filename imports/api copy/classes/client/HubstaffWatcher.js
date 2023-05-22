
import moment from "moment";
import { DASHBOARD, HUBSTAFF } from "../../const";
import Utilities from "../Utilities";
import Watcher from "../Watcher";
import ClientWatcher from "./ClientWatcher";



class HubstaffWatcher extends Watcher {
    #activityData="";
    #attendanceData="";
    loading = false
    constructor(parent) {
        super(parent);

    }

    get activityData(){
        return this.#activityData;
    }

    get TotalTrack(){
       let track = 0;
       let idle = 0;
       let average = 0;
       let percent = 0;
        if(this.#activityData.length){
            this.#activityData.map(x=>{
                track = track + x.tracked
                idle = idle + x.idle
            } );
            average = track/this.#activityData.length
            percent = (average - 32400)/32400 * 100    
        }
        return {track,idle,average,percent}
    }


    get attendanceData(){
        return this.#attendanceData;
    }

    reset(type){
        switch(type){
            case 'dashboard':
                this.#activityData=""
                break;
            case 'attendance':
                this.#attendanceData=""
                break;
        }
    }

    get Loading(){
        return this.loading
    }

    setLoading(flag){
        this.loading = flag
        this.activateWatcher()
    }

    getMe() {
        this.Parent.callFunc(DASHBOARD.Me).then((data) => {
            console.log(data)
        }).catch((err) => {
            console.log(err);
        })
    }

    getActivity(start,end,currentBaseRate,userId) {
        this.setLoading(true)
        this.Parent.callFunc(DASHBOARD.getActivity,{start,end,currentBaseRate,userId}).then((data) => {
            if(data && data.length){
                    data.sort((a, b) => a - b);
                    data.reverse();
                    this.#activityData = data;
                  } 
            this.setLoading(false)
            this.activateWatcher()
        }).catch((err) => {
            this.setLoading(false)
            console.log(err);
        })
    }


    
    getAttendance(newstart,newend,userId) {
        let start = moment(newstart).format('YYYY-MM-DD')
        let end = moment(newend).format('YYYY-MM-DD')
        this.Parent.callFunc(DASHBOARD.getActivityAttendance,{start,end,userId}).then((data) => {
            if(data && data.daily_activities && data.daily_activities.length){
                this.filterDate(newstart,newend,data.daily_activities)
            }
        }).catch((err) => {
            console.log(err);
        })
    }


    filterDate(start,end,data){
        const datas =[];
        const selectedDates = [];
        const sample1Values = data.map(obj => obj.date);

        for (let date = moment(start); date <= end; date.add(1, 'days')) {
            selectedDates.push(date.format('YYYY-MM-DD'));
            }
            for(const i in selectedDates){
                if(sample1Values.includes(selectedDates[i])){
                    data.map(item=>{
                        if(item.date === selectedDates[i]){
                            datas.push(item)
                        }   
                    })
                }else{
                    let newdate = moment(selectedDates[i])
                    if (newdate.day() === 6 || newdate.day() === 0) {
                        datas.push({date:selectedDates[i],status:'weekends'})
                      } else if(moment(newdate).valueOf() >= moment().valueOf() || moment().day() == moment(newdate).day()){
                        datas.push({date:selectedDates[i],status:'onprogress'})
                      }else{
                        datas.push({date:selectedDates[i],status:'absent'})
                      }
                }
            }

            if (datas && datas.length > 0) {
              // Sort the array in ascending order based on the 'user' property
              datas.sort((a, b) => a - b);
            
              // Reverse the sorted array to get the desired order
              datas.reverse();
            
              this.#attendanceData = datas;

              this.activateWatcher();
            } else {
              Utilities.showError("Array is empty or undefined", Utilities.errorMsg(error));
            }

     
    //     const absentDates = selectedDates.filter(date => !apiDates.includes(date));
    //    this.setState({filterdate:absentDates})
    }


    getOrganization(){
        console.log('exec')
        this.Parent.callFunc(HUBSTAFF.getOrganization).then((data) => {
            console.log(data)
        }).catch((err) => {
            console.log(err);
        })
    }

    // getUser(orgId){
    //     this.Parent.callFunc(HUBSTAFF.getUser,orgId).then((data) => {
    //         console.log(data)
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // }


} 

export default new HubstaffWatcher(ClientWatcher);
