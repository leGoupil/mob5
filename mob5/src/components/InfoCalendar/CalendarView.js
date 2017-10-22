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
      image: null,
      dataList: {},
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
        id: editCalendar.id,
        title: editCalendar.title,
        userList: editCalendar.participants || [],
        image: editCalendar.image || null,
        putOrPost: 'PUT',
        isPrimary: check
      });
      if(editCalendar.infoMode){
        this.setState({ infoMode: true });
      }
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

      const uglyObject = {}
      if (responseBody){
        responseBody.forEach((obj) => {
          uglyObject[obj.id] = obj.user.email;
        })
      }
      return this.setState({
        isLoading: false,
        dataList: uglyObject,
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
      const userList = this.state.userList;
      const list = [];
      if(userList[0] === undefined) {
        userList.shift();
      }
      userList.forEach((id) => {
        list.push({ participant_id: id });
      });
      const buildBody = {}
      , check = this.state.isPrimary;
      buildBody.title = this.state.title;
      if(!check){
        buildBody.calendar_participants_attributes = list;
        buildBody.events_attributes = [];
        buildBody.image = this.state.image || null;
      }
      const checkPut = this.state.id ? `/${this.state.id}` : ''
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
        alert('votre calendrier a bien été crée');
      });
    })
    .catch((error) => {
      alert(JSON.stringify(error));
      console.error(error);
    });
  };

  IsPrimary = (props) => {
    const isPrimary = props.isPrimary;
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
        options={this.state.dataList}
        search={true}
        multiple={true}
        placeholder={'Ajouter des amis a ce calendrier'}
        placeholderTextColor={'rgba(255,255,255,0.7)'}
        returnValue={"value"}
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
