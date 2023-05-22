import React from 'react';
import ClientWatcher from '../api/classes/client/ClientWatcher';
import { withNavigation } from './components/extra/withNavigation';

class RedirectUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    ClientWatcher.setWatcher(this,'REDIRECTUR')
  }

  componentDidMount() {
    this.getCode()
  } 

  getCode = async () =>{
    const userId = localStorage.getItem('id')
    const searchParams = new URLSearchParams(window.location.search);
    // Extract the code and state parameters
    const code = searchParams.get('code');
    const res = await ClientWatcher.generateToken(code,userId)
    if(res){
      this.props.navigate('/login')
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h1>Loading</h1>
          <p>...</p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Success</h1>
          <p>You have been successfully authenticated.</p>
        </div>
      );
    }
  }
}

export default withNavigation(RedirectUrl);