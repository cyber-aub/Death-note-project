import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";



export const selectThemeMode = (state: RootState) => state.settings.isDarkTheme
