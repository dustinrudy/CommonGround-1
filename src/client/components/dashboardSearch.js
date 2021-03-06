import React from 'react'
import {Link, browserHistory} from 'react-router'
import {getTopics} from 'api/topics'
import {searchUsers} from 'api/search'
import store from 'store'
import 'font-awesome/css/font-awesome.css'
import 'assets/styles/dashboardSearch.css'
import LiveFeed from 'components/livefeed'

const DashboardContainer = React.createClass({
  getInitialState: function(){
    return{
      topics: [],
      profiles: []
    }
  },
  componentWillMount: function(){
    getTopics()
    this.unsubscribe = store.subscribe(()=>{
      const appState = store.getState()
      this.setState({
        topics: appState.topics,
        profiles: appState.profiles
      }) 
    })
  },
  componentWillUnmount: function() {
    this.unsubscribe()
  },
  render: function(){
    return (
      <CommonDashboard topics={this.state.topics} profiles={this.state.profiles}/>
    )
  } 
})

const CommonDashboard = React.createClass({
  getInitialState: function() {
    return {
      id:0
    }
  },
  submitHandle: function(e) {
    e.preventDefault()
    searchUsers(this.state.id)
  },
  handleChange: function(e) {
    var value = e.target.value
    this.setState({
      id:value
    })
  },
  render: function () {
    return(
      <div>
        <div id="dashboard_container">
          <form onSubmit={this.submitHandle}>
            <div className="search--topic--container">
              <select onChange={this.handleChange} className="searchbar">
                <option>Search User's by Topic</option>
                  {this.props.topics.map((item,i) => {
                    return(
                      <option id={"item" + item.id} key={'item' + i} value={item.id}>{item.name}</option>
                    )
                  })}
              </select>
              <button type="submit" className="searchbutton">Search</button>
            </div>
          </form>
          <div className="usersSearch">
            {this.props.profiles.map((user,i) =>{
              return(
                <ul className="user_li" key={'user' + i}>
                <Link className="profile_link" to={`/profile/${user.id}`}>
                  <li className="user_list"  id={'user' + user.id} value={user.id}><img className="user_avatar" src={user.avatar}/><p className="userinfo">{user.first_name}&nbsp;{user.last_name}</p><p className="userinfo">Political Affiliation:&nbsp;{user.political_affiliation}</p></li>
                </Link> </ul>
                )
            })}
          </div>
        </div>
        <LiveFeed />
      </div>
    )
  }
})

export default DashboardContainer
