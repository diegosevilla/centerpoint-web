import React, {Component} from 'react';

class NotFound extends Component{
    componentWillMount(){
      alert
      //window.location = '/'
    }

    render() {
      return(
        <div className="center">
          <h1> 404 Page Not Found </h1>
          <p> return <a href='/'> Home </a> </p>
        </div>
      )
    }
}

export default NotFound
