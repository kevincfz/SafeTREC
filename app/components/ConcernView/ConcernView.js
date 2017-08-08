import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ActionSheetIOS
} from 'react-native'
import { navigatorStyle, styles} from './styles'
import { connect } from 'react-redux';
//TODO: using https://github.com/ahmed3mar/react-native-swiper/tree/proptypes because original package broke
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {ASPECT_RATIO} from '../../constants/screen';
import { getConcernImages } from '../../actions/images';
import { deleteConcern } from "../../actions/concerns";
const LATITUDE_DELTA = 0.001;


const mapStateToProps= state => {
  return {
    images: state.images.concernImages,
    imagesPending: state.images.concernImagesPending
  }
};

const mapDispatchToProps = {
  getConcernImages,
  deleteConcern
};

class ConcernView extends Component {


  dismissModal() {
    this.props.navigator.dismissModal();
  }

  openDeleteActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
        options: [
          'Delete',
          'Cancel',
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        tintColor: 'darkorange',
    },

      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.props.deleteConcern(this.props.concern.id);
            this.dismissModal();
            break;
        }
      })
  }

  loadImages() {
    return this.props.images.map(image => {
      return <Image key={image.key}
                    style={styles.imageSlide}
                    source={{uri: image.uri}}
                    // defaultSource={{uri:require('../../images/image-placeholder.png')}} //FIXME:not working
      />
    })
  }

  loadSwiper() {
    if (this.props.imagesPending) {
      return (
        <ActivityIndicator
          animating = {true}
          color = 'darkorange'
          size = "large"
          style = {styles.activityIndicator}
        />
      )
    } else {
      return (
        <Swiper
          height={280}
          activeDotColor='orange'
          loop={false}
        >
          {this.loadImages()}
        </Swiper>
      )
    }
  }

  componentWillMount() {
    this.props.getConcernImages(this.props.concern.id, this.props.concern.numberOfImages || 0);
  }

  render() {

    return (
      <View style={styles.container}>


        {this.loadSwiper()}

        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>
            {this.props.concern.title || 'Concern Title'}
          </Text>
          <Text style={styles.descriptionText}>
            {this.props.concern.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
          </Text>
          <Text style={styles.descriptionText}>
            <Icon name='ios-thumbs-up' style={styles.detailsIcon}/>
            {' ' + Math.floor(Math.random() * 200)} people agree with this!
          </Text>
          <Text style={styles.addressText}>
            <Icon name='ios-pin' style={styles.detailsIcon}/>
            {' ' + this.props.concern.address || '2715 Dwight Way, CA 94704'}
          </Text>
        </View>

        <MapView
          style={styles.mapviewContainer}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: this.props.concern.coordinate.latitude,
            longitude: this.props.concern.coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
          }}
          mapType={'standard'}
          showsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <MapView.Marker coordinate={this.props.concern.coordinate}/>
        </MapView>


        <TouchableOpacity
          style={styles.dismissButton}
          onPress={()=> this.dismissModal()}
        >
          <Icon name='ios-close-circle-outline' style={styles.dismissIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={()=> this.openDeleteActionSheet()}
        >
          <Icon name='ios-more-outline' style={styles.moreIcon} />
        </TouchableOpacity>

      </View>
    )
  }
}

ConcernView.navigatorStyle = navigatorStyle;

export default connect(mapStateToProps, mapDispatchToProps)(ConcernView);
