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
    // const { onOpen, onClose, editCalendar, deleteCalendar } = this.props.itemProps;
    const { onOpen, onClose } = this.props.itemProps;
    const editCalendar = () => {
      // currentlyOpenSwipeable.recenter();
      navigate('EditCalendar', {data});
    };
    const deleteCalendar = () => {
      // currentlyOpenSwipeable.recenter();
      this.removeCalendar();
    }
    return(
      <Swipeable
        rightButtons={[
          <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: 'red'}]}
            onPress={deleteCalendar}
          >
            <FontAwesome name="trash-o" size={30} color={'white'} />
          </TouchableOpacity>,
          <TouchableOpacity
            onPress={editCalendar}
            style={[styles.rightSwipeItem, {backgroundColor: 'orange'}]}>
            <FontAwesome name="edit" size={30} color={'white'} />
          </TouchableOpacity>
        ]}
      >

        <View style={styles.container}>
          <Image source={{ uri: data.picture || 'https://www.broomfield.org/images/pages/N1446/blue%20heading%20icons_calendar.png'}} style={styles.photo} />
          <Text style={styles.text}>
            {`${data.title}`}
          </Text>
        </View>
      </Swipeable>
    )
  }
}

// {`${data.title} ${data.name.last}`}
