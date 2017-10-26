import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import { getToken } from '../../auth';

export default class CalendarForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      title: null,
      userList: [],
      selectedC: [],
      image: null,
      contactList: {},
      putOrPost: 'POST',
      isPrimary: false
    }
  }

  componentDidMount() {
    let editCalendar = null;
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            editCalendar = nav.state.params.data;
            console.log('editCalendar', editCalendar);
          }
        }
      }
    }
    if(editCalendar){
      let check = null;
      if(editCalendar.primary){
        check = true;
      }
      this.setState({
        editCalendar,
        id: editCalendar.id,
        title: editCalendar.title,
        userList: editCalendar.participants || [],
        image: editCalendar.image || null,
        putOrPost: 'PUT',
        isPrimary: check
      });
    }

    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      return fetch('http://another-calendar.herokuapp.com/api/v1/user/contacts', {
        method: 'GET',
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
      // "calendar_participants": Array [
      //   Object {
      //     "calendar_id": 10,
      //     "id": 7,
      //     "participant_id": 1,
      //   },
      //   Object {
      //     "calendar_id": 10,
      //     "id": 8,
      //     "participant_id": 2,
      //   },
      // ],
      const uglyObject = {}
      const editCalendar = this.state.editCalendar;
      let jpp = [];
      if(editCalendar){
        if (responseBody){
          responseBody.forEach((obj) => {
            // editCalendar.calendar_participants.forEach((participant) => {
            //   if(participant.participant_id === obj.id){
            //     jpp.push(obj.id.toString());
            //   }
            // })
            const toDisplay = obj.user.name ? `${obj.user.name} ${obj.user.nickname}` : obj.user.email;
            uglyObject[obj.id] = toDisplay;
          })
        }
      } else {
        if (responseBody){
          responseBody.forEach((obj) => {
            const toDisplay = obj.user.name ? `${obj.user.name} ${obj.user.nickname}` : obj.user.email;
            uglyObject[obj.id] = toDisplay;
          })
        }
      }
      return this.setState({
        isLoading: false,
        contactList: uglyObject,
        selectedC :jpp
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _onPressButton = () => {
    if(!this.state.title){
      alert('Merci de préciser un titre');
      return null;
    }
    this.setState({
      isLoading: true,
    });
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      const editCalendar = this.state.editCalendar;
      const userList = this.state.userList;
      const list = [];
      if(userList[0] === undefined) {
        userList.shift();
      }
      userList.forEach((id) => {
        let check = false;
        if(editCalendar){
          editCalendar.calendar_participants.forEach((contact) => {
            if(parseInt(contact.participant_id, 10) === parseInt(id, 10)){
                check = true;
            }
          });
        }
        if(!check){
          list.push({ participant_id: id });
        }
      });
      const buildBody = {}
      , check = this.state.isPrimary;
      buildBody.title = this.state.title;
      if(!check){
        buildBody.calendar_participants_attributes = list;
        buildBody.events_attributes = [];
        buildBody.image = this.state.image || null;
      }
      const checkPut = this.state.id ? `/${this.state.id}` : '';
      return fetch(`http://another-calendar.herokuapp.com/api/v1/user/calendars${checkPut}`, {
        method: this.state.putOrPost,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: objAccess.uid,
          client: objAccess.client,
          expiry: objAccess.expiry,
          access_token: objAccess.access_token
        },
        body: JSON.stringify({calendar: buildBody})
      })
    })
    .then((response) => {
      const responseHeaders = response.headers.map;
      const responseBody = JSON.parse(response._bodyText);
      if(responseBody.error){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseBody.error));
        });
      }
      if(responseBody.errors){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseBody.errors));
        });
      }
      return this.setState({
        isLoading: false,
      }, function () {
        const { navigate } = this.props.navigate
        navigate('Home')
      });
    })
    .catch((error) => {
      alert(JSON.stringify(error));
      console.error(error);
    });
  };


  IsPrimary = (props) => {
    const isPrimary = props.isPrimary;
    const truc = this.state.selectedC;
    if (isPrimary) {
      return(
        <TextInput
          placeholder="Ce calendrier est personnel"
          placeholderTextColor="rgba(255,255,255,0.7)"
          disabled={true}
          style={styles.input}
        />
      );
    }
    return(
      <CustomMultiPicker
        options={this.state.contactList}
        search={true}
        multiple={true}
        selected={truc}
        placeholder={'Ajouter des amis a ce calendrier'}
        placeholderTextColor={'rgba(255,255,255,0.7)'}
        rowBackgroundColor={"#eee"}
        rowHeight={40}
        callback={(userList) => this.setState({userList})}
        rowRadius={5}
        iconColor={"#00a2dd"}
        iconSize={30}
        selectedIconName={"ios-checkmark-circle-outline"}
        unselectedIconName={"ios-radio-button-off-outline"}
        scrollViewHeight={130}
      />
    )
  }

  render() {
    const { navigate } = this.props.navigate;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          />
        <TextInput
          placeholder="titre"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          value={this.state.title}
          onChangeText={(title) => this.setState({title})}
          disabled={this.state.isLoading}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />
        <this.IsPrimary isPrimary={this.state.isPrimary} />
        <TouchableOpacity style={styles.buttonContainer}
          onPress={this._onPressButton}
          disabled={this.state.isLoading}>
          <Text style={styles.buttonText}> Ajouter calendrier </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    color: '#FFF',
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700'
  }
});
