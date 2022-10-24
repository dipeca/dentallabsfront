import React, { useState } from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Login from "./components/login";
import BottomBar from "./components/bottombar";


// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  const [language] = React.useState('pt')

  const [user, setUser] = useState(null);
  const [page, setPage] = useState(0);
  const [idRecord, setIdRecord] = useState(-1);

  function changeUser(user, page, idRecord) {
    console.error("login user:" + user + " page:"+page)
    setUser(user);
    setPage(page);
    setIdRecord(idRecord);
  }

  const renderCenas = () => {
    console.log("dpca page" + page + " user:" + user);
    if (page ==1 && user != null) {
      return <RecordList user={user} navigateTo={(user, page, idRecord) => changeUser(user, page, idRecord)}/>
    } else  if (page ==2 && user != null) {
      return <Edit user={user} language={language} navigateTo={(user, page) => changeUser(user, page)} idRecord={idRecord} isEdit={true}/>
    } else  if (page ==3 && user != null) {
      return <Edit user={user} language={language} navigateTo={(user, page) => changeUser(user, page)} isEdit={false}/>
    }
    return <Login language={language} user={user} onLogin={(user, page) => changeUser(user, page)} />
  }

  return (
    <div>
      <Navbar user={user} navigateTo={(user, page) => changeUser(user, page)}/>
      {renderCenas()}
      <BottomBar user={user} navigateTo={(user, page) => changeUser(user, page)}/>
    </div>
  );
};

export default App;