import React, { Component } from 'react'
import ClientWatcher from '../../../api/classes/client/ClientWatcher';
import { withNavigation } from '../extra/withNavigation';

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
        ClientWatcher.setWatcher(this, "ForgotPassword");
    }
    handleSubmit = async (e) => {
            e.preventDefault();
         const res = await  ClientWatcher.forgotPassword(this.state.email);
         if(res) this.props.navigate('/')
    };
    

  render() {
    ClientWatcher.initiateWatch("ForgotPassword")
    let loading = ClientWatcher.UserNameAccount.isLoading
    
    return (
        <div className="rb-page-wrapper-form">
        <div className="rb-sign-up">
            <div className="rb-card">
                <div className="rb-form-card-div">
                    <div className="form-block w-form">
                        <form onSubmit={this.handleSubmit}id="email-form" name="email-form" data-name="Email Form" method="get" aria-label="Email Form">
                            <div className="rb-form-hd">
                                <a href="#" className="brand-name-form w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a474b0877c09be4e337_Asset%208.svg" loading="lazy" alt="" /></a>
                                <p>Type your email to Recover your account</p>
                            </div>
                            <div className="rb-form-row">
                                <label className="rb-field-label">Email address</label>
                                <div className="rb-form-control"><input type="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} className="rb-text-field w-input" maxLength="256" name="field" data-name="Field" placeholder="Your Email Address" id="field" required="" /></div>
                            </div>
                            <div className="rb-form-btn">
                                {!loading ? <button type="submit" className="rb-btn-main wide w-button">Submit</button>: <div>Loading...</div>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
  }
}

export default withNavigation(ForgotPassword)
