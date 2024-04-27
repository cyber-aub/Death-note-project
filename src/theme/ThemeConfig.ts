import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const darkAlgorithm  = theme.darkAlgorithm;
export const lightAlgorithm = theme.defaultAlgorithm;

const appTheme: ThemeConfig = {
  token : {
    fontFamily: 'DeathNote',
    fontSize: 20,
    fontSizeHeading1: 24,
  },
  components:{
    Card:{
      headerFontSize : 24
    },
    
    List:{
      fontSize : 30,
      descriptionFontSize : 25,
    },
    Slider:{
      fontSize:24
    }
  }

}

export default appTheme;

export const getTheme = (darkTheme:boolean) :ThemeConfig => {
  return {
    ...appTheme,
    algorithm: darkTheme ? darkAlgorithm : lightAlgorithm   ,

  }
}