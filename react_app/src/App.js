import React from "react"
import Navbar from './components/Navbar.js';
import Stats from './components/Stats.js';
import Logindiv from './components/Logindiv.js';
import './App.css';
import './index.css';
import { useState, useEffect } from 'react'

let click = {
  target: {
    innerText: "Stats"
  },
  once: 0
}

function App(p) {
  const [login, setLogin] = useState();
  const [clickEvent, setClickEvent] = useState(click);

  function triggerLogin() {
    setLogin(true)
  }

  if (document.cookie == "") {

    useEffect(() => {
      const logDiv = async () => {
        triggerLogin()
      }
      logDiv()
    }, [])

  } else {

    if (click.once == 0) {
      click.once = 1
      setClickEvent(click)
      setLogin(false)
    }

  }

  let stats = (e) => {
    click.once = 1
    setClickEvent(e)
  }

  return (
    <>
      <Navbar stats={stats} recr={stats} timeline={stats} />
      <div className="App">
        {login ? <><Logindiv /> </> : <Stats click={clickEvent} />}
      </div>
    </>
  );
}

export default App;