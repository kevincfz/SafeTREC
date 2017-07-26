import { StyleSheet } from 'react-native';

const navigatorStyle = {
  navBarTextColor: 'white',
  navBarBackgroundColor: 'darkorange',
  navBarTranslucent: true,
  navBarNoBorder: true,
  navBarHidden: true,

  navBarLeftButtonColor: 'white',
  navBarButtonColor: 'white',
  navBarRightButtonFontSize: 17,
  navBarRightButtonColor: 'white',
  navBarRightButtonFontWeight: '800',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },

  searchBox: {

    zIndex: 1,
    color: 'grey',
    backgroundColor: '#ffffff',
    height: 35,
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 60,

    shadowOffset:{
      width: 5,
      height: 4,
    },

    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,

    fontSize: 18,

    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 3
  },

  newReportButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  },

  sideMenuContainer: {

    position:'absolute',

    left: 20,
    top: 30,

    width: 30,
    height: 20,
    backgroundColor:'transparent',
    zIndex: 5
  },

  sideMenuIcon: {
    fontSize: 30,
    height: 30,
    color: 'black'
  }
});

export {navigatorStyle, styles};

