export const sleep = async (time: number) => {
    return new Promise((resovle) => {
        setTimeout(() => {
            resovle(null)
        }, time)
    })
}