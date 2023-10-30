import { loadAudioFilesPath, loadExportedAudioFilesPath } from "../services/audio.manager"
//import { initData } from "./global.state"


export const initialize = () => {

    //initData()

    loadAudioFilesPath()
    loadExportedAudioFilesPath()
    
}