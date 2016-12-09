import React from 'react'
import store from 'store'
import { browserHistory, Link } from 'react-router'
import styles from 'assets/styles/drawer.css'
import 'font-awesome/css/font-awesome.css'
import Logo from 'assets/images/cg-logo.png'
import { getMessageUsers } from 'api/getMessages'
import { getConvo } from 'api/getConvo'
import MessagingView from './MessagingView'
import {logout} from 'api/users'



const DrawerContainer = React.createClass ({
  getInitialState: function() {
    return {
      messageUsers:[],
      myconvo:[],
      fromId:null
    }
  }, 
  componentWillMount: function(){
    getMessageUsers()
    this.unsubscribe = store.subscribe(()=>{
      const appState = store.getState()
      this.setState({
        messageUsers: appState.messageUsers,
        myconvo: appState.myconvo,
        fromId: appState.fromId
      })
    })
  },
  componentWillUnmount: function() {
    this.unsubscribe()
  },
  render: function() {
    return (
      <DrawerView messageUsers={this.state.messageUsers} fromId={this.state.fromId} myconvo={this.state.myconvo}/>
    )
  }
})

const DrawerView = React.createClass({
  getInitialState: function() {
    return {
      hidden:true
    }
  },
  toggleMenu: function() {
    var that = this;
    this.setState({
      hidden:!that.state.hidden
    })
  },
  selectUser: function(e) {
    e.preventDefault()
    var id = e.currentTarget.id
    id = Number(id.substr(7))
    getConvo(id)
  },
  logout: function(e) {
    e.preventDefault()
    logout(browserHistory.push('/'))
  },
  render: function () {
    return ( 
        <div className="layout">
          <div className="header">
              <h1><img className="logo_cg" src={Logo}/></h1>
          </div>
          <div className='iconColumn'> 
            <Link to="/dashboard">
              <button className="messageButton">
               <i className="fa fa-home" aria-hidden="true"></i>
              </button>
              <label className="labelHome">Home</label>
            </Link>
            <button onClick={this.toggleMenu} className="messageButton">
              <i className="fa fa-comments" aria-hidden="true"></i>   
            </button>
            <label className="labelMessages">Messages</label> 
            <Link to="/profile">
              <button  className="messageButton">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
              </button>
              <label className="labelProfile">Profile</label>
            </Link>         
              <button className="messageButton" onClick={this.logout}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </button>
              <label className="labelLogout">Logout</label>
          </div>
          <div className="movingParts">
            <div className={this.state.hidden ? "hidden messageColumn" : "messageColumn"}>
                <h4 className="myConvo">My Conversations
                 
                </h4>
                 <ul className="chatList">                            
                     {this.props.messageUsers.map((user, i) =>{
                      return (
                        <li className="userList" id={'msguser' + user.id} onClick={this.selectUser} key={'messagesUser' + user.id}>
                            <img src={user.avatar}/> {user.first_name} {user.last_name}
                        </li>
                      )
                    })}
                </ul>
           <MessagingView fromId={this.props.fromId} myconvo={this.props.myconvo} />
            </div> 
          </div>
        </div>
    )            
  }
})

export default DrawerContainer


