
export const timestamps = (timespans, arg2) => {

    let player;
    if (arg2 != undefined) {
        player = [...arg2]
    }


    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let ids = []
    let recruits = []
    let midrank = []
    let highrank = []
    let filtered = []
    let playersPerDay = []
    let days = []
    let weekdays = []
    let firstday = timespans[0][0]
    let now = timespans[timespans.length - 1][0]


    while (firstday < now) {
        days.push(new Date(firstday).getDate())
        firstday += 86400000
        weekdays.push(new Date(firstday).toLocaleDateString(undefined, options).split(",")[0])

    }
    timespans.forEach((user, i, arr) => {

        let currentday = new Date(arr[i][0]).getDate()
        let nextday
        if (i == arr.length - 1) {
            nextday = false
        } else {
            nextday = new Date(arr[i + 1][0]).getDate()
        }

        if (currentday == nextday) {
            arr[i][1][0] == undefined ? filtered.push(0) : filtered.push(arr[i][1].length)
            ids.push(arr[i][1])
        } else {
            arr[i][1][0] == undefined ? filtered.push(0) : filtered.push(arr[i][1].length)
            let flatten = ids.flat()
            let set = new Set(flatten)
            set = [...set]
            let bufferRecruits = 0
            let bufferMidranks = 0
            let bufferHighranks = 0

            if (player != undefined) {

                set.forEach(e => {
                    if (player[player.findIndex(a => a.UID == e)] != undefined) {

                        if (player[player.findIndex(a => a.UID == e)].rank[0] == "486623117335330846" || player[player.findIndex(a => a.UID == e)].rank[0] == "486622426000785418"
                            || player[player.findIndex(a => a.UID == e)].rank[0] == "486962967720493058") {
                            bufferRecruits++

                        } else if (player[player.findIndex(a => a.UID == e)].rank[0] == "486622477179551745" || player[player.findIndex(a => a.UID == e)].rank[0] == "486622480333537290"
                            || player[player.findIndex(a => a.UID == e)].rank[0] == "513883237144330242" || player[player.findIndex(a => a.UID == e)].rank[0] == "485524025167314944"
                            || player[player.findIndex(a => a.UID == e)].rank[0] == "485524025146081280") {
                            bufferMidranks++

                        } else {
                            bufferHighranks++

                        }
                    }
                })
            }
            ids = []
            recruits.push(bufferRecruits)
            midrank.push(bufferMidranks)
            highrank.push(bufferHighranks)
            filtered.sort((a, b) => b - a)

            playersPerDay.push(filtered[0])
            filtered = []
            if (nextday != false && ((nextday - currentday) > 1)) {
                for (let i = 1; i < (nextday - currentday); i++) {
                    playersPerDay.push(0)
                }
            }
        }
    })
    let adjusted
    if (playersPerDay.length > days.length) {
        playersPerDay.pop()
    }
    return [playersPerDay, days, weekdays, recruits, midrank, highrank]

}