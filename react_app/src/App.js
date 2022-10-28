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

  useEffect(() => {
    if (document.cookie == "") {
      setTab(true)
    } else  {
      click.once = 1
      setTab(false)
      setClickEvent(click)
  }
  }, [])

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
