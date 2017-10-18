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
      isOpen: null,
      leftIcon: 'trash-o',
      leftBackgroundColor: 'red',
      rightIcon: 'edit',
      rightBackgroundColor: 'orange',
      crownIcon: ''
    };
  }

  componentDidMount() {
    const { data } = this.props;
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      if(data.owner.id === objAccess.id){
        return this.setState({
          isLoading: false,
          leftIcon: 'trash-o',
          leftBackgroundColor: 'red',
          rightIcon: 'edit',
          rightBackgroundColor: 'orange',
          objAccess: objAccess
        });
      }
      return this.setState({
        isLoading: false,
        leftIcon: 'remove',
        leftBackgroundColor: 'red',
        rightIcon: 'info',
        rightBackgroundColor: 'green',
        objAccess: objAccess
      });
    })
  }

  removeGroup = () => {
    console.log('muhahaha');
  };

  render(){
    const {currentlyOpenSwipeable} = this.state;
    const { navigate } = this.props.navigate;
    const { data } = this.props;
    const { onOpen, onClose, deleteGroup } = this.props.itemProps;

    const infosOrEditGroup = () => {
      // currentlyOpenSwipeable.recenter();
      navigate('EditGroup', {data});
    };
    const destroyOrLeaveGroup = () => {
      // console.log('this;jaoiefji', this.props.data);
      // console.log('this;jaoiefji', this.state.objAccess);
      return fetch(`http://another-calendar.herokuapp.com/api/v1/user/groups/${this.props.data.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: this.state.objAccess.uid,
          client: this.state.objAccess.client,
          expiry: this.state.objAccess.expiry,
          access_token: this.state.objAccess.access_token
        }
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
          deleteGroup(this.props.data.id);
          // navigate('Group');
        });
      })
      .catch((error) => {
        console.error(error);
      });
    };


    return(
      <Swipeable
        rightButtons={[
          <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: this.state.leftBackgroundColor}]}
            onPress={destroyOrLeaveGroup}
          >
            <FontAwesome name={this.state.leftIcon} size={30} color={'white'} />
          </TouchableOpacity>,
          <TouchableOpacity
            onPress={infosOrEditGroup}
            style={[styles.rightSwipeItem, {backgroundColor: this.state.rightBackgroundColor}]}>
            <FontAwesome name={this.state.rightIcon} size={30} color={'white'} />
          </TouchableOpacity>
        ]}
      >
        <View style={styles.container}>
          <Image source={{ uri: data.picture || 'https://image.freepik.com/free-icon/multiple-users-silhouette_318-49546.jpg'}} style={styles.photo} />
          <Text style={styles.text}>
            {`${data.title}`}
          </Text>
        </View>
      </Swipeable>
    )
  }
}
