import '../index.css'
import React from "react"
import { useState, useEffect } from 'react'


function Navb(p) {
  const [isActiveStats, setActiveStats] = useState(false);
  const [isActiveRecruit, setActiveRecruit] = useState(false);
  const [isActiveApplic, setActiveApplic] = useState(false);
  const [isActiveTime, setActiveTime] = useState(false);

  const toggleClass = (e) => {
    if (e == 'Stats') {
      setActiveStats(true)
      setActiveRecruit(false)
      setActiveApplic(false)
      setActiveTime(false)
    }
    if (e == 'Recruits') {
      setActiveStats(false)
      setActiveRecruit(true)
      setActiveApplic(false)
      setActiveTime(false)
    }
    // if (e == 'Applications') {
    //   setActiveStats(false)
    //   setActiveRecruit(false)
    //   setActiveApplic(true)
    //   setActiveTime(false)
    // }
    if (e == 'Timeline') {
      setActiveTime(true)
      setActiveStats(false)
      setActiveRecruit(false)
      setActiveApplic(false)
    }
  };

  const handleClick = (evt) => {

    if (['Stats', 'Recruits'].includes(evt.target.textContent)) {
      p.stats(evt);
    } else if (evt.target.textContent === 'Applications') {
      p.appl(evt);
    } else if (evt.target.textContent === 'Timeline') {
      p.stats(evt);
    }
    toggleClass(evt.target.textContent);
  };

  return (

    <div className="navbar" >
      <div style={{ marginLeft: "6px" }} >
        <p className={isActiveStats ? "navbar_button_active" : "navbar_buttons"} onClick={handleClick} >Stats</p>
        <p className={isActiveRecruit ? "navbar_button_active" : "navbar_buttons"} onClick={handleClick} >Recruits</p>
        {/* <p className={isActiveApplic ? "navbar_button_active": "navbar_buttons"}  onClick={handleClick} >Applications</p> */}
        <p className={isActiveTime ? "navbar_button_active" : "navbar_buttons"} onClick={handleClick} >Timeline</p>
      </div >
    </div>
  );
}

export default Navb;
