export function formatTime(timeInMilliseconds: number) {
    return new Date(timeInMilliseconds).toISOString().substr(11, 8).replace(/^[0:]+/, "")
}