import React, { Component } from 'react'
import { Outlet } from "react-router-dom";
import TopNav from './TopNav';
import SideNav from './SideNav';
import { withNavigation } from './components/extra/withNavigation';
import ClientWatcher from '../api/classes/client/ClientWatcher';
import { withTracker } from "meteor/react-meteor-data";

 class MainContent extends Component {
    constructor(props){
        super(props)
        ClientWatcher.setWatcher(this,'MAINCONTENT')
    }
    render() {
        ClientWatcher.initiateWatch("MAINCONTENT");
        let authUser = this.props.authUser

        if (authUser && authUser.includes('admin') || authUser && authUser.includes('user')) {
        return (
            <div className="page-wrapper">
                <SideNav auth={authUser}/>
                <div className='main-container'>
                    <TopNav />
                    <div className='main-content'>
                        <Outlet />
                    </div>
                </div>
            </div>
        )
          } else {
            return this.props.navigate("/login")
        }
    }
}
export default withTracker(() => {
    ClientWatcher.initiateWatch("MAINCONTENT");
    let authUser;
    let user = ClientWatcher.init();
    if (user[0]?.profile.roles) {
        authUser = user[0]?.profile.roles
    }
    return { authUser }
})(withNavigation(MainContent))
