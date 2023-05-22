import React, { Component } from 'react'
import DateRange from '../extra/DateRange'
import ClientWatcher from '../../../api/classes/client/ClientWatcher'
import { withNavigation } from '../extra/withNavigation'

 class Settings extends Component {
    constructor(props){
        super(props)
        this.state ={
            number: {},
            value:0
        }
        ClientWatcher.setWatcher(this,'SETTINGS')
    }
    componentDidMount(){
        ClientWatcher.getUserlist()
    } 

    handleShow(item, id, e){
        e.preventDefault()
        this.setState({number:{["show"+id]:item}})
        if(!item){
            ClientWatcher.updateBaseRate(id,this.state.value)
        }
    }

    handleSelectUser(id,e){
       ClientWatcher.getPayroll(id)
        this.props.navigate('/payroll-release')
    }


  render() {
    ClientWatcher.initiateWatch('SETTINGS')
    let user = ClientWatcher.Userlist

    return (
      <div className="dashboard-content">
      <div className="dashboard-top">
          <h3 className="sub-page-name">User</h3>
          <form action="/search" className="search w-form">
              <input type="search" className="search-input w-input" maxLength="256" name="query" placeholder="Search…" id="search" required="" />
              <input type="submit" value="Search" className="search-button w-button" />
          </form>
      </div>
      <div className="attendance-conttent-div">
          <div className="w-form">
              <div className="w-form-done" tabIndex="-1" role="region" aria-label="Email Form success">
                  <div>Thank you! Your submission has been received!</div>
              </div>
              <div className="w-form-fail" tabIndex="-1" role="region" aria-label="Email Form failure">
                  <div>Oops! Something went wrong while submitting the form.</div>
              </div>
          </div>
          <div className="attendance-list-div">
              <div className="attendance-user">
                  <div data-w-id="7fdc055c-3ad6-cc47-c0d9-eb4e8093a761" className="attendance-user-top">
                  </div>
                  <div className="user-attendance-table show">
                      <div className="div-block">
                          <form action="/search" className="search w-form">
                              <input type="search" className="search-input w-input" maxLength="256" name="query" placeholder="Search…" id="search" required="" />
                              <input type="submit" value="Search" className="search-button w-button" />
                          </form>
                          {/* <div className="date-range-container">
                              <div className="date-range-label">date range</div>
                                  <DateRange type={"attendance"}/>
                          </div> */}
                      </div>
                      <div className="table-div">
                          <div className="table-heading">
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Name</div>
                                  </div>
                              </div>
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Email</div>
                                  </div>
                              </div>
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Organization</div>
                                  </div>
                              </div>
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Role</div>
                                  </div>
                              </div>
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Base Rate</div>
                                  </div>
                              </div>
                              <div className="table-col">
                                  <div className="table-hd-content-div">
                                      <div>Action</div>
                                  </div>
                              </div>
                          </div>
                          <div className="table-content">
                              {user && user.length && user.map((user,index)=>{
                                  return(
                                      <div key={user._id} onClick={this.handleSelectUser.bind(this,user._id)}className="table-row gray">
                                                 <div className="table-col">
                                          <div className="table-content-div">
                                              <div>{user.profile?.name}</div>
                                          </div>
                                      </div>
                                      <div className="table-col">
                                          <div className="table-content-div">
                                              <div>{user.profile?.email}</div>
                                          </div>
                                      </div>
                                      <div className="table-col">
                                          <div className="table-content-div">
                                              <div>{user.profile?.orgId}</div>
                                          </div>
                                      </div>
                                      <div className="table-col">
                                          <div className="table-content-div">
                                              <div>{user.profile?.roles.map((role)=>{return role})}</div>
                                          </div>
                                      </div>
                                      <div className="table-col">
                                          <div className="table-content-div">
                                             <input onChange={(e)=>this.setState({value:parseInt(e.target.value)})} disabled={!this.state.number["show"+user._id]} defaultValue={"$"+user.profile.baseRate ? user.profile.baseRate : "-" }/>
                                          </div>
                                      </div>
                                      <div className="table-col">
                                          <div className="table-content-div">
                                          {this.state.number["show"+user._id] ? <button onClick={this.handleShow.bind(this, false, user._id)}>save</button> : <button onClick={this.handleShow.bind(this, true, user._id)}>edit</button> }   
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
  </div>
    )
  }
}
export default withNavigation(Settings)