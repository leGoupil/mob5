import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { FontAwesome } from "react-native-vector-icons";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25
  }
});

export default class Row extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: null
    };
  }

  removeCalendar = () => {
    console.log('muhahaha');
  };

  render(){
    const {currentlyOpenSwipeable} = this.state;
    const { navigate } = this.props.navigate;
    const { data } = this.props;
    let displayName = data.user.email;
    const { onOpen, onClose } = this.props.itemProps;
    if(data.user.name && data.user.nickname){
      displayName = `${data.user.name} ${data.user.nickname}`
    }
    const deleteFriend = () => {
      //refresh ?
      this.removeCalendar();
    }

    return(
      <Swipeable
        rightButtons={[
          <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: 'red'}]}
            onPress={deleteFriend}
          >
            <FontAwesome name="trash-o" size={30} color={'white'} />
          </TouchableOpacity>,
        ]}
      >
        <View style={styles.container}>
          <Image source={{ uri: data.picture || 'https://d30y9cdsu7xlg0.cloudfront.net/png/55168-200.png'}} style={styles.photo} />
          <Text style={styles.text}>
            {displayName}
          </Text>
        </View>
      </Swipeable>
    )
  }
}
