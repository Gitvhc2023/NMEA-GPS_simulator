export function simulateRoute(state, route) {
    let i = 0

    setInterval(() => {
        if (i >= route.length) i = 0

        state.lat = route[i].lat
        state.lon = route[i].lon

        i++
    }, 1000)
}