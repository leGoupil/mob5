import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import { getToken } from '../../auth';

export default class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      title: null,
      description: null,
      private: null,
      userList: [],
      pictureUrl: null,
      putOrPost: 'POST'
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
      return this.setState({
        id: editCalendar.id,
        title: editCalendar.title,
        description: editCalendar.description || null,
        userList: editCalendar.userList || [],
        pictureUrl: editCalendar.pictureUrl || null,
        private: editCalendar.private,
        putOrPost: 'PUT',
      });
    }
  }

  _onPressButton = () => {
  if(!this.state.title || !this.state.description){
    alert('Merci de préciser un titre et une description');
    return null;
  }
  this.setState({
    isLoading: true,
  });
  return getToken()
  .then((bulkAccess) => {
    const objAccess = JSON.parse(bulkAccess);
    return fetch('http://another-calendar.herokuapp.com/api/v1/user/calendars/3', {
      method: this.state.putOrPost,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          uid: objAccess.uid,
          client: objAccess.client,
          expiry: objAccess.expiry,
          access_token: objAccess.access_token
        },
        body: JSON.stringify({
          title: this.state.title,
          // description: this.state.description,
          private: true,
          id: 4
        })
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
  })
  .catch((error) => {
    alert(JSON.stringify(error));
    console.error(error);
  });
};

  userList = {
    "123":"Tom",
    "124":"Michael",
    "125":"Christin"
  }

  render() {
    const { navigate } = this.props.navigate;
    // const { calendar } = this.props.calendar || this.state.calendar;
    // this.setState({calendar})
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <TextInput
        placeholder="titre"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="next"
        onSubmitEditing={() => this.passwordInput.focus()}
        value={this.state.title}
        onChangeText={(title) => this.setState({title})}
        keyboardType="email-address"
        disabled={this.state.isLoading}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        />
        <TextInput
        placeholder="Description"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="go"
        disabled={this.state.isLoading}
        value={this.state.description}
        onChangeText={(description) => this.setState({description})}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        ref={(input) => this.passwordInput = input}
        />
        <CustomMultiPicker
          options={this.userList}
          search={true}
          multiple={true}
          placeholder={"Ajouter des amis a ce calendrier"}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
          returnValue={"label"} // label or value
          callback={(res)=>{ console.log(res) }} // callback, array of selected items
          rowBackgroundColor={"#eee"}
          rowHeight={40}
          value={this.state.userList}
          callback={(userList) => this.setState({userList})}
          rowRadius={5}
          iconColor={"#00a2dd"}
          iconSize={30}
          selectedIconName={"ios-checkmark-circle-outline"}
          unselectedIconName={"ios-radio-button-off-outline"}
          scrollViewHeight={130}
          selected={[1,2]} // list of options which are selected by default
        />

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
