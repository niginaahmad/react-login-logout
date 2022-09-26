import React, { Component } from 'react'
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export default class App extends Component {
 constructor(){
  super()
  console.log("constructor");
  this.state = {
    fieldsEmpty: false,
    token: null,
    userName: "",
    userNotFound: false,
  };
 }

 componentDidMount() {
  console.log("inside componentDidMount", sessionStorage.getItem("token"));
  const token = sessionStorage.getItem("token");
  
    if (token) {
     this.setState({ token : token });
   }
 }

 handleFormSubmit = (e) => {
  e.preventDefault();
  
    const emailValue = e.target.email.value;
    const passwordValue = e.target.password.value;
  
  const credentials = {
    email: emailValue,
    password: passwordValue,
  };

  if (emailValue !== "" && passwordValue !== ""){
    //Authenticate user
    this.authenticateUser(credentials);
  } else {
    this.setState({fieldsEmpty: true});
     
     setTimeout(() => {
       this.setState({ fieldsEmpty: false });
     }, 3000);
   }
 };

 authenticateUser = async (creds) => {
  const {email, password} = creds;
   
  const url = 
   "https://6330e31d591935f3c8966db7.mockapi.io/users";

  const response = await fetch(url);
  const data = await response.json();

  const user = data.find((d) => d.email === email && d.password === password);
  
  if (user) {
    const token = "your-token";
     sessionStorage.setItem("token", token)
     this.setState({ token: token, userName: user.fname })
  } else {
    this.setState({ userNotFound: true });

    setTimeout(()=> {
      this.setState({ userNotFound: false })
    }, 3000);
   }
 };

 handleLogout = () => {
  sessionStorage.clear();
   this.setState({ token: null });
 };

  render() {
    const { token, fieldsEmpty, userName, userNotFound} = this.state;
     return ( 
      <div className="App">
        {token ? (
          <Dashboard userName={userName} handleLogout={this.handleLogout}/> 
        ) : (
          <Login 
            handleFormSubmit={this.handleFormSubmit}
            fieldsEmpty={fieldsEmpty}
            userNotFound={userNotFound}
          />
        )}
     </div>
    );
  }
}


