import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { FontAwesome } from "react-native-vector-icons";
import { getToken } from '../../../auth';


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


  render(){
    const {currentlyOpenSwipeable} = this.state;
    const { navigate } = this.props.navigate;
    const { data } = this.props;
    let displayName = data.user.email;
    const { onOpen, onClose, deleteFriend } = this.props.itemProps;
    if(data.user.name && data.user.nickname){
      displayName = `${data.user.name} ${data.user.nickname}   -   ${data.user.email}`
    }
    const removeFriend = () => {
      return getToken()
      .then((bulkAccess) => {
        const objAccess = JSON.parse(bulkAccess);
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/contacts/${this.props.data.id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            uid: objAccess.uid,
            client: objAccess.client,
            expiry: objAccess.expiry,
            access_token: objAccess.access_token
          }
        })
      })
      .then((response) => {
        const responseHeaders = response.headers.map;
        const responseBody = JSON.parse(response._bodyText);
        if(responseBody.error){
          return this.setState({
            isLoading: false
          }, function () {
            alert(JSON.stringify(responseBody.error));
          });
        }
        return this.setState({
          isLoading: false
        }, function(){
          deleteFriend();
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }

    return(
      <Swipeable
        rightButtons={[
          <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: 'red'}]}
            onPress={removeFriend}
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
