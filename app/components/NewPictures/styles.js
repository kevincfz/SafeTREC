import { StyleSheet, Dimensions } from 'react-native';
const PHOTO_HEIGHT = 230;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#ededed',
  },

  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },

  picture: {
    height: PHOTO_HEIGHT
  }

});

export {styles, PHOTO_HEIGHT};