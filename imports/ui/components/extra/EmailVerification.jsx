import React from "react";
import { withTracker } from "meteor/react-meteor-data";


import ClientWatcher from "../../../api/classes/client/ClientWatcher";
import withRouter from "./WithRouter";
import { Toast } from "./Toast";


class EmailVerification extends React.Component {
    constructor(props) {
        super(props);
        ClientWatcher.setWatcher(this, "EMAILVERIFICATIONWATCHER");
    }

    componentDidMount() {
        this.verifyEmail();
    }

    verifyEmail = async () => {
        const { token } = this.props.params;
        try {
            await ClientWatcher.verifyEmail(token);
            Toast({text:"Email verified successfully.",type:'success'})
            setTimeout(()=>{
                window.location.href = "/login";
            },3000)
        } catch (err) {
            Toast({text:"Email verification failed",type:'danger'})
            setTimeout(()=>{
                window.location.href = "/login";
            },3000)
        }
    };

    render() {
        return <div>Loading...</div>
    }
}

export default withRouter(
    withTracker(() => {
        ClientWatcher.initiateWatch("EMAILVERIFICATIONWATCHER");
    })(EmailVerification)
);
