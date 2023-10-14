export function formatTime(timeInMilliseconds: number) {
    return new Date(timeInMilliseconds).toISOString().substring(11, 19).replace(/^[0:]+/, "")
}