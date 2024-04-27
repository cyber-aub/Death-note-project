import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ProfileState {
    isDarkTheme:boolean,
    
}

const initialState: ProfileState = {
    isDarkTheme : true,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setDarkTheme: (state) => {
         
            state.isDarkTheme = true
        },
        setLightTheme : (state) => {
           
            state.isDarkTheme = false
        },
        toggleTheme : (state) => {
            state.isDarkTheme = !state.isDarkTheme
        },
        

    },
})

export const { setDarkTheme,setLightTheme,toggleTheme } = settingsSlice.actions

export default settingsSlice.reducer