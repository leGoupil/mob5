import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { FontAwesome } from "react-native-vector-icons";
import { getToken } from '../../auth';

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
          objAccess: objAccess,
          isOwner: true
        });
      }
      return this.setState({
        isLoading: false,
        leftIcon: 'remove',
        leftBackgroundColor: 'red',
        rightIcon: 'info',
        rightBackgroundColor: 'green',
        objAccess: objAccess,
        isOwner: false
      });
    })
  }

  render(){
    const {currentlyOpenSwipeable} = this.state;
    const { navigate } = this.props.navigate;
    const { data } = this.props;
    const { onOpen, onClose, deleteCalendar } = this.props.itemProps;
    if(data.user.name && data.user.nickname){
      displayName = `${data.user.name} ${data.user.nickname}`
    }
    const infosOrEditGroup = () => {
      if(this.state.isOwner) { return navigate('EditCalendar', {data}); }
      // navigate('calendarInfos', {data});
    };
    const destroyOrLeaveGroup = () => {
      if(this.state.isOwner) {
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.props.data.id}`, {
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
            console.log('this.props.data.id', this.props.data.id);
            deleteCalendar(this.props.data.id);
          });
        })
        .catch((error) => {
          console.error(error);
        });
      }
    };
    return(
      <Swipeable
        rightButtons={[
          <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: this.state.leftBackgroundColor}]}
            onPress={destroyOrLeaveGroup}
          >
            <FontAwesome name="trash-o" size={30} color={'white'} />
          </TouchableOpacity>,
          <TouchableOpacity
            onPress={infosOrEditGroup}
            style={[styles.rightSwipeItem, {backgroundColor: this.state.rightBackgroundColor}]}>
            <FontAwesome name="edit" size={30} color={'white'} />
          </TouchableOpacity>
        ]}
      >

        <View style={styles.container}>
          <Image source={{ uri: data.picture || 'https://www.broomfield.org/images/pages/N1446/blue%20heading%20icons_calendar.png'}} style={styles.photo} />
          <Text style={styles.text}>
            {displayName}
          </Text>
        </View>
      </Swipeable>
    )
  }
}

// {`${data.title} ${data.name.last}`}
