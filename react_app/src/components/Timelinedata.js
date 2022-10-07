export const timeLineData = (timespans) => {

    let playersPermin = []
    let days = []
    
    for (let i = 0; i < timespans.length; i++) {
        if (i == timespans.length - 1) {
            break
        }
        if ((timespans[i + 1][0] - timespans[i][0]) > 363000) {
            for (let j = 360000; j < (timespans[i + 1][0] - timespans[i][0]); j += 360000) {
                days.push(new Date(timespans[i][0] + j).getHours())
                playersPermin.push(0)
            }
        } else {
            playersPermin.push(timespans[i][1].length)
            days.push(new Date(timespans[i][0]).getHours())
        }
    }

    if (playersPermin.length > days.length) {
        playersPermin.pop()
    }

    return [days, playersPermin]

}