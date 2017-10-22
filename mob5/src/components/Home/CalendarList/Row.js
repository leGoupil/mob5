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
    let isOwner = false
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      if(data.owner.id === objAccess.id){
        isOwner = true;
        this.setState({
          isLoading: false,
          leftIcon: 'trash-o',
          leftBackgroundColor: data.primary ? 'grey' : 'red',
          rightIcon: 'edit',
          rightBackgroundColor: 'orange',
          objAccess: objAccess,
          isOwner,
          isPrimary: data.primary,
          data
        });
      } else {
        this.setState({
          isLoading: false,
          leftIcon: 'trash-o',
          leftBackgroundColor: 'orange',
          rightIcon: 'info',
          rightBackgroundColor: 'green',
          objAccess: objAccess,
          isOwner,
          isPrimary: data.primary,
          data
        });
      }
    })
  }

  render(){
    const {currentlyOpenSwipeable} = this.state;
    const { navigate } = this.props.navigate;
    const { data } = this.props;
    const { onOpen, onClose, deleteCalendar } = this.props.itemProps;
    const infosOrEdit = () => {
      if(this.state.isOwner){
          return navigate('EditCalendar', {data});
      }
      return navigate('InfoCalendar', {data: this.state.data});
    };
    const openCalendar = () => {
      navigate('Calendar', {data: this.props.data});
    };
    const destroyOrLeave = () => {
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
            deleteCalendar(this.props.data.id);
          });
        })
        .catch((error) => {
          console.error(error);
        });
      }else{
        const calendar = this.state.data;
        return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars/${this.props.data.id}/leave`, {
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
            deleteCalendar(this.props.data.id);
          });
        })
        .catch((error) => {
          console.error(error);
        });
      }
    };
    const leftContent =
    <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'green'}]}
      onPress={openCalendar}>
      <Text> Ouvrir le calendrier </Text>
    </TouchableOpacity>;
    const rightButtons = [
      <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: this.state.leftBackgroundColor}]}
        onPress={destroyOrLeave}
        disabled={this.state.isPrimary}
        >
        <FontAwesome name={this.state.leftIcon} size={30} color={'white'} />
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={infosOrEdit}
        style={[styles.rightSwipeItem, {backgroundColor: this.state.rightBackgroundColor}]}>
        <FontAwesome name={this.state.rightIcon} size={30} color={'white'} />
      </TouchableOpacity>
    ];
    const rightContent = () => {
      return (rightButtons);
    }
    return(
      <Swipeable
        leftActionActivationDistance={125}
        leftContent={leftContent}
        onLeftActionComplete={openCalendar}
        rightButtons={rightButtons}
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
