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

let memory = {}
let warsStats
let warCounter
let currentWarId
let timespans
let resp
let target
let url = "https://wardennavy.com/data/stats/current"


const Stats = React.memo((p) => {
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

    const [heat, setHeat] = useState([]);
    const [player, setPlayer] = useState([]);
    const [tabs, setTabs] = useState();
    const [sortTime, setsortTime] = useState();
    const [sortOrder, setSortOrder] = useState();
    const [sortJoin, setSortJoin] = useState();
    const [sortRanks, setSortRanks] = useState();
    const [names, setNames] = useState(false);
    const [warnum, setWarNum] = useState();
    const [warId, setWarId] = useState("current");

    useEffect(() => {
        const reRender = async () => {
            p.click.target.innerText == "Timeline" ? setTabs(true) : setTabs(false)
            await updatePage()
        }
        reRender()
    }, [warId, p.click.target.innerText])



    async function firstTimeLanding() {
        if (memory.current == undefined) {
            let data = await fetch(url, {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
            resp = await data.json()
            memory.current = resp
            let arr = [...resp[0].stats]
            arr.reverse()
            setWarNum([resp[0]._id, arr])
        }
    }

    async function changeWar(e) {
        url = `https://wardennavy.com/data/wars/${e.target[e.target.selectedIndex].text}`
        if (memory[e.target[e.target.selectedIndex].text] == undefined) {
            let data = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            resp = await data.json()
            setWarId(e.target[e.target.selectedIndex].text)
            memory[e.target[e.target.selectedIndex].text] = resp
            resp = memory[e.target[e.target.selectedIndex].text]
        } else {
            setWarId(e.target[e.target.selectedIndex].text)
            resp = memory[e.target[e.target.selectedIndex].text]
        }
    }


    let updatePage = async (e) => {

        if (memory.current == undefined || e == undefined) {
            await firstTimeLanding()
        } else {

            if (e == "uncheck") {
                resp = memory[warId]
            } else {
                if (e != undefined) {
                    if (e.target[e.target.selectedIndex].text == memory.current[0]._id) {
                        resp = memory.current
                        setWarId(e => "current")
                    } else {
                        changeWar(e)
                    }
                }
            }
            try { target = e.target[e.target.selectedIndex].text } catch (e) { target = warId }
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
            if (e == "uncheck" && warId == "current") {
                resp = memory.current
            } else if (e == undefined && warId != undefined) {
                if (warId == "current") {
                    resp = memory.current
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
                    setHeat(e => heatData)
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
            }
        } catch (e) {
            console.log(e)
        }


        //TOP LEFT CHART
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

        if (e != undefined) {
            if (p.click.target.innerText == "Recruits") {
                setPlayer(e => playersUserList.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058"
                ))
            }
        } else {
            if (p.click.target.innerText == "Recruits") {
                setPlayer(e => playersUserList.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058"
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

                        //all ticked ranks
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
        let previousWars = resp[1].concat(memory.current[0].stats)

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
                    backgroundColor: "#49526ef0",  // warsStats.wars.map((user) =>Rankslist[user.rank[0]][2])
                    stack: 'Stack 1',
                },
                ]
            })

            setWarslength({
                labels: previousWars.map((user) => user.warn),
                datasets: [
                    {
                        label: "",
                        color: '#FFFFFF',
                        data: previousWars.map((user) => user.dayslength),
                        backgroundColor: previousWars.map((user) => user.winner == "C" ? "#65875f" : "#2d6ca1"),
                    },
                ]
            })

        } catch (e) {
            console.log(e)
        }
    }

    const sortgraph = (a) => {

        setChartData({
            labels: a.length < 130 ? a.map((user) => user.name) : a.filter(e => Number(e.total) > 16600000).map((user) => user.name),
            datasets: [{
                label: "Hours: ",
                data: a.length < 130 ? a.map((user) => user.total / 3600000) : a.filter(e => Number(e.total) > 16600000).map((user) => user.total / 3600000),
                backgroundColor: a.length < 130 ? a.map((user) => Rankslist[user.rank[0]][2]) : a.filter(e => Number(e.total) > 16600000).map((user) => Rankslist[user.rank[0]][2])
            }]
        })

    }

    const recruits = () => {
        let onlyRecruits = player.filter(e => e.rank[0] == "486623117335330846" || e.rank[0] == "486622426000785418" || e.rank[0] == "486962967720493058")
        setPlayer(e => onlyRecruits);
    }

    useEffect(() => {
        sortgraph(player);
    }, [player]);

    const sortUsers = () => {
        if (sortTime) {
            setPlayer((prevplayer) => [...prevplayer].sort((a, b) => a.total - b.total))
            setsortTime(e => false)
        } else {
            setPlayer((prevplayer) => [...prevplayer].sort((a, b) => b.total - a.total))
            setsortTime(e => true)
        }
    }

    const sortName = () => {
        if (sortOrder) {
            setPlayer((player) => [...player].sort((a, b) => a.name.localeCompare(b.name)))
            setSortOrder(false)
        } else {
            setPlayer((player) => [...player].sort((a, b) => b.name.localeCompare(a.name)))
            setSortOrder(true)
        }

    }


    const sortJoined = () => {
        if (sortJoin) {
            setPlayer((player) => [...player].sort((a, b) => a.joined - b.joined))
            setSortJoin(false)
        } else {
            setPlayer((player) => [...player].sort((a, b) => b.joined - a.joined))
            setSortJoin(true)
        }

    }

    const sortCreated = () => {
        if (sortJoin) {
            setPlayer((player) => [...player].sort((a, b) => Number(a.UID) - Number(b.UID)))
            setSortJoin(false)
        } else {
            setPlayer((player) => [...player].sort((a, b) => Number(b.UID) - Number(a.UID)))
            setSortJoin(true)
        }

    }
    const checkClick = (e) => {
        e.target.checked ? allWars() : updatePage("uncheck")
    }
    const sortRank = () => {
        if (sortRanks) {
            setPlayer((player) => [...player].sort((a, b) => Rankarray.indexOf(a.rank[0]) - Rankarray.indexOf(b.rank[0])))
            setSortRanks(false)
        } else {
            setPlayer((player) => [...player].sort((a, b) => Rankarray.indexOf(b.rank[0]) - Rankarray.indexOf(a.rank[0])))
            setSortRanks(true)
        }

    }

    const GetNames = async (e) => {
        let fetchallNames
        let urlnames = "https://wardennavy.com/data/stats/allnames"
        if (memory.allnames == undefined) {
            let getallNames = await fetch(urlnames, {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
            fetchallNames = await getallNames.json()
            memory.allnames = fetchallNames
        }

    }

    const FindNames = async (e) => {
        let userInput = new RegExp(e.target.value, "gi")
        let matches = []

        if (e.target.value.length > 1) {
            for (let i in memory.allnames) {
                if (userInput.test(memory.allnames[i].name)) {
                    matches.push([memory.allnames[i].name, memory.allnames[i].UID])
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
                    // stack: `Stack ${playershours.length}`,
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
                    <Selectwar num={warnum} unclick={checkClick} change={updatePage} />
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

                        {tabs ?
                            <>
                                <div className="wrapperRanks">
                                    <Timelines timespa={playerstime} />
                                    <RankHours chartDatab={dailyranks} />
                                </div>
                                <div className="wrapper_bottom">
                                    <Heatmapchart timespans={heat} />
                                    <Barwars chartDatab={wars} onlydiv={true} />
                                </div>
                            </>
                            :
                            <>
                                <BarChart chartData={chartData} />
                                <div className="wrapper">
                                    <Barshours charthours={hours} />
                                    <Barwars chartDatab={wars} />
                                    <Warsduration duration={warslength} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
})

export default Stats;
