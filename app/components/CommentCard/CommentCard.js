import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  TextInput,
  SegmentedControlIOS,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import _ from 'underscore';
import StarRating from 'react-native-star-rating';
import styles from './styles';
import { uploadConcern } from '../../actions/concerns';
import { getConcernsInRegion } from '../../actions/map';
import SpinnerOverlay from '../SpinnerOverlay/SpinnerOverlay';

const types = ['Speeding', 'Visibility', 'Right of way', 'Violation'];

const mapStateToProps = state => ({
  submissionStatus: state.concerns.newConcernSubmissionStatus,
  newConcern: state.concerns.newConcern,
  newImages: state.images.newConcernImages,
  mapRegion: state.map.mapRegion,
  predictions: state.images.newConcernImagePredictions,
  predictionStatus: state.images.imagePredictionStatus,
});

const mapDispatchToProps = {
  uploadConcern,
  getConcernsInRegion,
};


class CommentCard extends Component {
  /* eslint react/prop-types: 1 */
  static propTypes = {
  };

  static navigatorButtons = {
    rightButtons: [{
      title: 'Submit',
      id: 'submit',
      buttonFontWeight: '900',
    }],
  };

  static getCategoryIndex(category) {
    return types.indexOf(category);
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  state = {
    reportCategory: this.props.reportCategory,
    concernDescription: '',
    rating: 1,
    ratingText: 'Alert',
  };


  componentDidUpdate(prevProps) {
    const popToRoot = () => {
      this.props.navigator.popToRoot({
        animated: true,
        animationType: 'fade',
      });
    };

    if (prevProps.submissionStatus.pending) {
      if (this.props.submissionStatus.failed) {
        Alert.alert(
          'Failed Submission',
          'Sorry about that', // TODO: should show error msg
          [
            { text: 'OK', onPress: () => popToRoot() },
          ],
        );
      } else if (this.props.submissionStatus.success) {
        this.props.getConcernsInRegion(this.props.mapRegion);
        Alert.alert(
          'Successful Submission',
          'Thank you',
          [
            { text: 'OK', onPress: () => popToRoot() },
          ],
        );
      }
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'submit') {
        this.props.navigator.setStyle({
          navBarHidden: true,
        });

        const details = {
          address: this.props.newConcern.address,
          coordinate: this.props.newConcern.coordinate,
          title: `${this.props.reportCategory} concern`,
          description: this.state.concernDescription,
        };

        this.props.uploadConcern(details, this.props.newImages);
      }
    }
  }

  onRatingPressed(rating) {
    switch (rating) {
      case 1:
        this.setState({ ratingText: 'Alert' });
        break;
      case 2:
        this.setState({ ratingText: 'Warning' });
        break;
      case 3:
        this.setState({ ratingText: 'Dangerous' });
        break;
      case 4:
        this.setState({ ratingText: 'Disaster' });
        break;
      case 5:
        this.setState({ ratingText: 'Hell' });
        break;
      default:
    }

    this.setState({ rating });
  }

  getPredictions() {
    /* eslint react/no-array-index-key: 0 */
    if (this.props.predictionStatus.pending) {
      return (
        <ActivityIndicator
          animating={this.props.predictionStatus.pending}
          color="darkorange"
        />
      );
    } else if (this.props.predictionStatus.failed) {
      return (
        <Text style={styles.predictionTagText}>
          Failed to Get Prediction
        </Text>
      );
    }
    return (
      this.props.predictions.map((prediction, index) => ( // FIXME: append this.props.
        <TouchableOpacity
          key={index}
          style={styles.predictionTag}
          onPress={() => {
            this.appendConcernDescription(prediction.description);
          }}
        >
          <Text style={styles.predictionTagText}>
            {prediction.description}
          </Text>
        </TouchableOpacity>
      ))
    );
  }

  appendConcernDescription(text) {
    const concernDescription = _.clone(this.state.concernDescription).concat(text);
    this.setState({ concernDescription });
  }


  render() {
    return (
      <View style={styles.container}>

        <SpinnerOverlay visible={(this.props.submissionStatus.pending)} />

        <View style={styles.card}>
          <SegmentedControlIOS
            style={styles.categorySelection}
            tintColor="darkorange"
            values={types}
            selectedIndex={CommentCard.getCategoryIndex(this.state.reportCategory)}
            onValueChange={(value) => {
              this.setState({ reportCategory: value });
            }}
          />

          <View style={styles.ratingBox}>
            <View style={styles.ratingIcons}>
              <StarRating
                disabled={false}
                emptyStar={'ios-alert-outline'}
                fullStar={'ios-alert'}
                iconSet={'Ionicons'}
                maxStars={5}
                rating={this.state.rating}
                selectedStar={rating => this.onRatingPressed(rating)}
                starColor={'darkorange'}
                emptyStarColor={'darkorange'}
              />
            </View>
            <Text style={styles.ratingText}> {this.state.ratingText} </Text>
          </View>
          <ScrollView style={styles.predictionBox} horizontal >
            {this.getPredictions()}
          </ScrollView>

          <TextInput
            style={styles.commentBox}
            placeholder={'What are you concerned about at this location?'}
            multiline
            editable
            placeholderTextColor={'orange'}
            onChangeText={concernDescription => this.setState({ concernDescription })}
            value={this.state.concernDescription}
          />
        </View>


      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);

