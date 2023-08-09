

export const prismaTodayFilter = () => {

    const now: Date = new Date(Date.now()); // Otiene la fecha actual
    const first: string = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0).toString()
    const last: string = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59).toString()
    
    return  {
        lte: last,
        gte: first,
    }
}