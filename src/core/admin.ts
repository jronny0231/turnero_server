import { refreshPersistentData, refreshQueueState } from "./global.state"


export const initialize = () => {

    refreshPersistentData()

    refreshQueueState()
    
}