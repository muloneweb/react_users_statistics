import '../index.css';
import FlipMove from 'react-flip-move';
import React, { forwardRef } from "react"
import Wartable from './Wartable.js';
import { Selectwar } from './Selectwar.js';
import { useState, useEffect } from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { BarChart } from './BarChart';
import { Barwars } from './Barwars';
import { Barshours } from './Barshours.js';
import { PlayersPD } from './PlayersPD';
import { Heathours } from './Heathours.js'
import { Names } from './Names.js'
import { timeStamps } from './timeStamps.js'
import { timeLineData } from './timeLineData.js'
import { msToTime } from './mstime.js'
import { Rankslist, Rankarray } from './Rankslist.js'
import { Warsduration } from './Warsduration.js';
import { Timelines } from './Timeline.js';
import { Heatmapchart } from './Heatmap.js';
import { RankHours } from './RankHours.js';

let clicks = {}
let num;
let warsStats
let warCounter
let currentWarId


const Stats = (p) => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [wars, setWars] = useState({
    labels: [],
    datasets: []
  });
  const [timesp, setTimesp] = useState({
    labels: [],
    datasets: []
  });
  const [hours, setHours] = useState({
    labels: [],
    datasets: []
  });
  const [warslength, setWarslength] = useState({
    labels: [],
    datasets: []
  });
  const [playerstime, setPlayersTime] = useState({
    labels: [],
    datasets: []
  });
  const [dailyranks, setDailyRanks] = useState({
    labels: [],
    datasets: []
  });
  const [heat, setHeat] = useState(() => [])
  const [player, setPlayer] = useState([])
  const [tabs, setTabs] = useState(false);
  const [sortTime, setsortTime] = useState(() => "true");
  const [sortOrder, setSortOrder] = useState(() => "true");
  const [sortJoin, setSortJoin] = useState(() => "true");
  const [sortRanks, setSortRanks] = useState(() => "true");
  const [names, setNames] = useState(() => false);
  const [warnum, setWarNum] = useState();

  let serverData
  let timespans
  let resp
  let target
  let url = "https://wardennavy.com/data/stats/current"


  useEffect(() => {
    const reRender = async () => {
      serverData = await updatePage()
    }
    reRender()
  }, [serverData, p.click.target.innerText])


  async function firstTimeLanding() {
    if (clicks.current == undefined) {
      let data = await fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })
      resp = await data.json()
      clicks.current = resp
      num = "current"
      if (resp[0].stats != undefined) {
        setWarNum([resp[0]._id, resp[0].stats])
      }
    } else {
      resp = clicks[num]
    }
  }

  async function changeWar(e) {
    url = `https://wardennavy.com/data/wars/${e.target[e.target.selectedIndex].text}`
    if (clicks[e.target[e.target.selectedIndex].text] == undefined) {
      let data = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
      resp = await data.json()
      num = e.target[e.target.selectedIndex].text
      clicks[e.target[e.target.selectedIndex].text] = resp
      resp = clicks[e.target[e.target.selectedIndex].text]
    } else {
      num = e.target[e.target.selectedIndex].text
      resp = clicks[e.target[e.target.selectedIndex].text]
    }
  }


  let updatePage = async (e) => {
    if (e == undefined || num == undefined) {
      await firstTimeLanding()
    } else {
      if (e == "uncheck") {
        resp = clicks[num]
      } else {
        if (e.target[e.target.selectedIndex].text == clicks.current[0]._id) {
          resp = clicks.current
          num = "current"
        } else {
          changeWar(e)
        }
      }
      try { target = e.target[e.target.selectedIndex].text } catch (e) { target = warnum[0] }
    }

    currentWarId = resp[0]._id
    warsStats = resp[0].stats
    timespans = resp[0].time


    try {
      setWars({
        labels: warsStats.map((user) => user.warn),
        datasets: [
          {
            label: "Recr - Ens",
            color: '#FFFFFF',
            data: warsStats.map((user) => user.recr),
            backgroundColor: "#c9d65d",
            stack: 'Stack 0',
          },
          {
            label: "Petty - Midship",
            data: warsStats.map((user) => user.officer),
            backgroundColor: "#13b3ee",
            stack: 'Stack 0',
          },
          {
            label: "Lieutenant +",
            data: warsStats.map((user) => user.highranks),
            backgroundColor: "#2c61e2",
            stack: 'Stack 0',
          },
          {
            label: "🕒 Playtime in Days",
            color: '#FFFFFF',
            data: warsStats.map((user) => user.tottime / 86400000),
            backgroundColor: "#49526ef0",
            stack: 'Stack 1',
          }
        ]
      })
    } catch (e) {
      console.log(e)
    }


    try {
      if ((e != undefined && target != warnum[0]) || (e == "uncheck" && num != "current")) {
        resp = [resp[0].obj]
      } else if (e == "uncheck" && num == "current") {
        resp = clicks.current
      } else if (e == undefined && num != undefined) {
        if (num == "current") {
          resp = clicks.current
        } else {
          resp = [resp[0].obj]
        }
      }
    } catch (e) { console.log(e) }

    let playersUserList = []
    for (let i in resp[0]) {
      if (i.length > 8) {
        playersUserList.push(resp[0][i])
      }
    }
    playersUserList.sort((a, b) => b.total - a.total)
    playersUserList.forEach((e, i) => {
      e.ind = i + 1
      if (e.total == null) e.total = 10
    })

    playersUserList[0].ind += " 🏆"

    try {
      setHours({
        labels: [],
        datasets: [
          {
            label: "Select a Player...",
            color: '#FFFFFF',
            data: [],
            backgroundColor: "#d1d1d1"
          },
        ]
      })

      setWarslength({
        labels: warsStats.map((user) => user.warn),
        datasets: [
          {
            label: "",
            color: '#FFFFFF',
            data: warsStats.map((user) => user.dayslength),
            backgroundColor: warsStats.map((user) => user.winner == "C" ? "#65875f" : "#2d6ca1"),
          },
        ]
      })

      if (p.click.target.innerText == "Timeline") {
        if (currentWarId > 89) {
          let timeResult = timeLineData(timespans)
          let calcTime = timeResult[0]
          let calcPlayers = timeResult[1]
          let heatData = Heathours(timeResult)
          setHeat(heatData)
          setPlayersTime({
            labels: calcTime,
            datasets: [{
              label: `Players Activity`,
              data: calcPlayers,
              borderColor: "#329fff",
              borderWidth: 0.5,
              pointRadius: 0,
            }]
          })
          setTabs(true)
          try {
            //ranks per day on Timeline page click
            let ranksPerDay = timeStamps(timespans, playersUserList)
            setDailyRanks({
              labels: ranksPerDay[1],
              datasets: [
                {
                  label: "Recr - Ens",
                  color: '#FFFFFF',
                  data: ranksPerDay[3],
                  backgroundColor: "#c9d65d",
                  stack: 'Stack 0',
                },
                {
                  label: "Petty - Midship",
                  data: ranksPerDay[4],
                  backgroundColor: "#13b3ee",
                  stack: 'Stack 0',
                },
                {
                  label: "Lieutenant +",
                  data: ranksPerDay[5],
                  backgroundColor: "#2c61e2",
                  stack: 'Stack 0',
                }
              ]
            })
          } catch (e) {
            console.log(e)
          }

        } else {
          setPlayersTime({
            labels: [0],
            datasets: [{
              label: `No data recorded before war 90`,
              data: [0],
              backgroundColor: "#a3a3a3",
            }]
          })
        }
      } else {
        setTabs(false)
      }

    } catch (e) {
      console.log(e)
    }

    if (timespans != undefined) {
      if (currentWarId > 89) {
        warCounter = currentWarId
        let calltimeStamps = timeStamps(timespans)
        setTimesp({
          labels: calltimeStamps[1],
          datasets: [{
            label: `Max Concurrent Players per Day War ${warCounter}`,
            data: calltimeStamps[0],
            backgroundColor: calltimeStamps[2].map((user) => user == "Sunday" || user == "Monday" ? "#f99500" : "#d1d1d1"),
          }]
        })
      }
    } else {
      setTimesp({
        labels: [0],
        datasets: [{
          label: `No data recorded before war 90`,
          data: [0],
          backgroundColor: "#a3a3a3",
        }]
      })
    }

    /// ALL ticked
    if (e != undefined) {
      if (p.click.target.innerText == "Recruits") {
        setPlayer(playersUserList.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058"
        ))
      } else {
        setPlayer(playersUserList)
      }
    } else {
      if (p.click.target.innerText == "Recruits") {
        setPlayer(playersUserList.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058"
        ))
      } else if (p.click.target.innerText == "Timeline") {

        if (currentWarId < 90) {

          setDailyRanks({
            labels: [0],
            datasets: [{
              label: `No data recorded before war 90`,
              data: [0],
              backgroundColor: "#a3a3a3",
            }]
          })

          setPlayersTime({
            labels: [0],
            datasets: [{
              label: `No data recorded before war 90`,
              data: [0],
              backgroundColor: "#a3a3a3",
            }]
          })
        } else {
          setPlayer(e => playersUserList)
          try {

            /////////////////////// all ticked ranks
            let ranksPerDay = timeStamps(timespans, playersUserList)
            setDailyRanks({
              labels: ranksPerDay[1],
              datasets: [
                {
                  label: "Recr - Ens",
                  color: '#FFFFFF',
                  data: ranksPerDay[3],
                  backgroundColor: "#c9d65d",
                  stack: 'Stack 0',
                },
                {
                  label: "Petty - Midship",
                  data: ranksPerDay[4],
                  backgroundColor: "#13b3ee",
                  stack: 'Stack 0',
                },
                {
                  label: "Lieutenant +",
                  data: ranksPerDay[5],
                  backgroundColor: "#2c61e2",
                  stack: 'Stack 0',
                }
              ]
            })
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        setPlayer(e => playersUserList)
      }
    }
  } //end updatePage()



  const allWars = async () => {

    let getdb = await fetch('https://wardennavy.com/data/wars/allWars', {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })

    let resp = await getdb.json()
    let playersUserList = []
    let prevwars = resp[1].concat(clicks.current[0].stats)

    for (let i in resp[0][0]) {
      if (i.length > 8) {
        playersUserList.push(resp[0][0][i])
      }
    }

    playersUserList.sort((a, b) => b.total - a.total)
    playersUserList.forEach((e, i) => { e.ind = i + 1; if (!e.total) e.total = 10 })
    playersUserList[0].ind += " 🏆"
    setPlayer(playersUserList)

    try {
      let allWarsData = [warsStats.reduce((a, b) => a + b.recr, 0),
      warsStats.reduce((a, b) => a + b.officer, 0),
      warsStats.reduce((a, b) => a + b.highranks, 0)
      ]

      setWars({
        labels: ["All Wars"],
        datasets: [{
          label: "Recruits ⟶ Ensign",
          color: '#FFFFFF',
          data: [allWarsData[0]],
          backgroundColor: "#c9d65d",
          stack: 'Stack 0',
        },
        {
          label: "Petty officer ⟶ Midshipman",
          data: [allWarsData[1]],
          backgroundColor: "#13b3ee",
          stack: 'Stack 0',
        },
        {
          label: "Lieutenant +",
          data: [allWarsData[2]],
          backgroundColor: "#2c61e2",
          stack: 'Stack 0',
        },
        {
          label: "🕒 Playtime in Days",
          color: '#FFFFFF',
          data: [warsStats.reduce((a, b) => a + b.tottime, 0) / 86400000],
          backgroundColor: "#49526ef0",
          stack: 'Stack 1',
        },
        ]
      })

      setWarslength({
        labels: prevwars.map((user) => user.warn),
        datasets: [
          {
            label: "",
            color: '#FFFFFF',
            data: prevwars.map((user) => user.dayslength),
            backgroundColor: prevwars.map((user) => user.winner == "C" ? "#65875f" : "#2d6ca1"),
          },
        ]
      })

    } catch (e) {
      console.log(e)
    }
  }

  const sortgraph = (a) => {
    setChartData({                                        //a.filter(e => e.ind == "1 🏆" || e.ind < 60 ).map((user) => user.name),
      labels: a.length < 130 ? a.map((user) => user.name) : a.filter(e => Number(e.total) > 16600000).map((user) => user.name),
      datasets: [{
        label: "Hours: ",
        data: a.length < 130 ? a.map((user) => user.total / 3600000) : a.filter(e => Number(e.total) > 16600000).map((user) => user.total / 3600000),
        backgroundColor: a.length < 130 ? a.map((user) => Rankslist[user.rank[0]][2]) : a.filter(e => Number(e.total) > 16600000).map((user) => Rankslist[user.rank[0]][2])
      }]
    })

  }
  //"486623117335330846","486622426000785418","486962967720493058"
  const recruits = () => {
    let onlyRecruits = player.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058")
    setPlayer(onlyRecruits);
  }

  useEffect(() => {
    sortgraph(player);
  }, [player]);

  const sortUsers = () => {
    if (sortTime == "true") {
      setPlayer((prevplayer) => [...prevplayer].sort((a, b) => a.total - b.total))
      setsortTime("false")
    } else {
      setPlayer((prevplayer) => [...prevplayer].sort((a, b) => b.total - a.total))
      setsortTime("true")
    }
  }

  const sortName = () => {
    if (sortOrder == "true") {
      setPlayer([...player].sort((a, b) => a.name.localeCompare(b.name)))
      setSortOrder("false")
    } else {
      setPlayer([...player].sort((a, b) => b.name.localeCompare(a.name)))
      setSortOrder("true")
    }
  }


  const sortJoined = () => {
    if (sortJoin == "true") {
      setPlayer([...player].sort((a, b) => a.joined - b.joined))
      setSortJoin("false")
    } else {
      setPlayer([...player].sort((a, b) => b.joined - a.joined))
      setSortJoin("true")
    }
  }

  const sortCreated = () => {
    if (sortJoin == "true") {
      setPlayer([...player].sort((a, b) => Number(a.UID) - Number(b.UID)))
      setSortJoin("false")
    } else {
      setPlayer([...player].sort((a, b) => Number(b.UID) - Number(a.UID)))
      setSortJoin("true")
    }

  }
  const checkClick = (e) => {
    e.target.checked ? allWars() : updatePage("uncheck")
  }
  const sortRank = () => {
    if (sortRanks == "true") {
      setPlayer([...player].sort((a, b) => Rankarray.indexOf(a.rank[0]) - Rankarray.indexOf(b.rank[0])))
      setSortRanks("false")
    } else {
      setPlayer([...player].sort((a, b) => Rankarray.indexOf(b.rank[0]) - Rankarray.indexOf(a.rank[0])))
      setSortRanks("true")
    }
  }

  const GetNames = async (e) => {
    let fetchallNames
    let urlnames = "https://wardennavy.com/data/stats/allnames"
    if (clicks.allnames == undefined) {
      let getallNames = await fetch(urlnames, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })
      fetchallNames = await getallNames.json()
      clicks.allnames = fetchallNames
    }
  }

  const FindNames = async (e) => {
    let userInput = new RegExp(e.target.value, "gi")
    let matches = []

    if (e.target.value.length > 1) {
      for (let i in clicks.allnames) {
        if (userInput.test(clicks.allnames[i].name)) {
          matches.push([clicks.allnames[i].name, clicks.allnames[i].UID])
        }
      }
      setNames(matches)
    } else {
      setNames(false)
    }
  }

  const getPlayer = async (e, key) => {

    let srvrData = await fetch(`https://wardennavy.com/data/player/id/${key}`, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    let userIdData = await srvrData.json()

    let updateUserGraph = [...warsStats]
    updateUserGraph.push({ warn: updateUserGraph[updateUserGraph.length - 1].warn + 1 })
    setHours({
      labels: updateUserGraph.map((user) => user.warn),
      datasets: [
        {
          label: userIdData[1] + " Hours",
          color: '#FFFFFF',
          data: userIdData[0].map((user) => user / 3600000),
          backgroundColor: userIdData[2].map((user) => user != 0 ? Rankslist[user][2] : null),
        },
      ]
    })

    document.getElementById("Input_field").value = userIdData[1]
    setNames(false)
  }
  const clearInput = async (e, key) => {
    document.getElementById("Input_field").value = ''
    setNames(false)
  }

  const DISCORD_EPOCH = 1420070400000;
  function convertSnowflakeToDate(snowflake) {
    let discdate = new Date(snowflake / 4194304 + DISCORD_EPOCH).toDateString().split(' ').slice(1)
    return `${discdate[0]} '${discdate[2].slice(2)}`
  }
  function convertJoined(snowflake) {

    let discdate = new Date(Number(snowflake)).toDateString().split(' ').slice(1)//.join(' ')
    return `${discdate[0]} ${discdate[1]} '${discdate[2].slice(2)}`
  }


  return (
    <>
      <div className="row" >
        <div className="columnleft">
          {warnum ? <Selectwar num={warnum} unclick={checkClick} change={updatePage} /> : []}
          {/* <Selectwar num={warnum} unclick={checkClick} change={test} /> */}
        </div>
        <div className="columnright">
          <div className="topDiv">
            <PlayersPD timespa={timesp} war={warCounter} />
            <div className="search_bar">
              <div className="look_glass"></div>
              <input id="Input_field" onKeyUp={FindNames} onClick={GetNames} className="search_input" type="text" placeholder="Search Name.." />
              <div className="x_cancel"><p onClick={clearInput} style={{ margin: "0px", cursor: "context-menu" }}>x</p></div>
            </div>
            {names ? <Names nameslist={names} getPlayer={getPlayer} /> : null}
            <table className="fixed" style={{ borderRadius: "5px", borderSpacing: "2px", height: "min-content", marginTop: "8px", fontSize: "12px", backgroundColor: "#000000e0" }}>
              {/* render the thead tag  first in the FlipMove container enterAnimation="accordionVertical" */}
              <FlipMove style={{ position: "initial" }} staggerDelayBy="0" staggerDurationBy="20" easing="ease-in-out" delay="0" leaveAnimation="none" duration={500}>
                <thead style={{ borderRadius: "5px" }}>
                  <tr style={{ height: "31px", cursor: "pointer", backgroundColor: "#00000085", fontSize: "14px", borderRadius: "5px", }}>
                    <th onClick={sortUsers} className="PlayersLength" style={{ fontSize: "20px", paddingBlock: "4px", textAlign: "center", padding: "0px", color: "#585858" }}>{player.length}</th>
                    <th onClick={sortUsers} style={{ padding: "0px", color: "#c9c9c9" }}>Time</th>
                    <th onClick={sortName} style={{ padding: "0px", color: "#c9c9c9" }}>Name</th>
                    <th onClick={sortRank} style={{ padding: "0px", color: "#c9c9c9" }}>Rank</th>
                    <th onClick={sortJoined} style={{ padding: "0px", color: "#c9c9c9" }}>Joined</th>
                    <th onClick={sortCreated} style={{ padding: "0px", color: "#c9c9c9" }}>Disc</th>
                  </tr>
                </thead>

                {player.map((user) => (
                  <tr key={user.UID} className="tr_user" onClick={e => getPlayer(e, user.UID)}>
                    <td style={{ color: "#bbbbbb", fontWeight: 'bold' }}>{user.ind}</td>
                    <td style={{ color: "#9f9c9c" }}>{msToTime(user.total)}</td>
                    <td style={user.rank[1] == "923937298838585364" ? { color: "#525252", fontSize: "14px", fontStyle: "bold" } : { color: "#d1d1d1", fontSize: "14px", fontStyle: "bold" }}>{user.name.slice(0, -5).length > 18 ? user.name.slice(0, -5).slice(0, -5) : user.name.slice(0, -5)}</td>
                    <td style={{ color: Rankslist[user.rank[0]][2] }} >{Rankslist[user.rank[0]][0]}</td>
                    <td ><code style={{ color: "#afafaf" }}>{convertJoined(user.joined)}</code></td>
                    <td ><code style={{ color: "#6a6a6a" }}>{convertSnowflakeToDate(Number(user.UID))}</code></td>
                  </tr>
                ))}
              </FlipMove>
            </table>
          </div>
          <div className="wrapper_col_right">

            {tabs ? <div className="wrapperRanks"><Timelines timespa={playerstime} /> <RankHours chartDatab={dailyranks} /></div> : tabs}
            {tabs ? <div className="wrapper_bottom"><Heatmapchart timespans={heat} /> <Barwars chartDatab={wars} onlydiv={true} /></div> : tabs}
            {!tabs ? <> <BarChart chartData={chartData} /> <div className="wrapper"><Barshours charthours={hours} /> <Barwars chartDatab={wars} /> <Warsduration duration={warslength} /></div></> : !tabs}

          </div>
        </div>
      </div>
    </>
  );
}

export default Stats;
