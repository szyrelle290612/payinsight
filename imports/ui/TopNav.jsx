import React, { Component } from 'react'
import { withNavigation } from './components/extra/withNavigation';
import ClientWatcher from '../api/classes/client/ClientWatcher';
import { withTracker } from "meteor/react-meteor-data";

class TopNav extends Component {
    constructor(props){
        super(props)
        ClientWatcher.setWatcher(this,"TOPNAV")
    }
    handleLogout(e) {
        e.preventDefault()
        ClientWatcher.logoutUser();
        this.props.navigate('/')
    }
    componentDidMount(){
        ClientWatcher.getCurrentExchange()
    }

    render() {
        ClientWatcher.initiateWatch('TOPNAV')
        let exchangeRates = ClientWatcher.currentRates
        return (
            <div className="top-nav">
                <div className="topnav-left-col">
         
                    {/* <h3 className="page-name">Dashboard</h3> */}
                </div>
                <div className="topnav-right-col">
                    {/* <div className="top-nav-icon-div">
                        <div className="top-nav-icon">
                            <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526e45fdafeb2d0e249908_Asset%2010.svg" loading="lazy" alt="" />
                        </div>
                    </div> */}
                    <div className="top-nav-icon-div">
                        <div className="avatar-div"
                        >
                            {/* <div className="avatar-icon">
                                <img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452710e2eebfa4456b6b313_63086fbe0343fa0dd19fb657_video_19.png" loading="lazy" alt="" />
                            </div> */}
                             <div class="avatar-name">Current Exchange Rate: USD:$1  -  PHP:₱{exchangeRates?.rates}</div>
                            <a className="avatar-name" onClick={this.handleLogout.bind(this)}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTracker(() => {
    ClientWatcher.initiateWatch("TOPNAV");
    const isReady = ClientWatcher.getSubscribeUser()
    return {
        user: ClientWatcher.user(),
        loading: !isReady,
    };
})(withNavigation(TopNav));
