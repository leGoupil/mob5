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
      id: null,
      userList: [],
      selectedUserList: [],
      dataList: {},
      putOrPost: 'POST'
    }
  }

  componentDidMount() {
    let editGroup = null;
    const ids = [];
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            editGroup = nav.state.params.data;
          }
        }
      }
    }
    if(editGroup){
      if(editGroup.contacts){
        editGroup.contacts.forEach((obj) => {
          // uglyArray[obj.user.id] = obj.user.email;
          ids.push(obj.id.toString())
        })
      }
      // console.log('idfisqjdiq', ids);
      this.setState({
        id: editGroup.id,
        title: editGroup.title,
        putOrPost: 'PUT',
        selectedUserList: ids
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

      const uglyObject = {}
      selectedUser = [];
      if (responseBody){
        responseBody.forEach((obj) => {
          uglyObject[obj.user.id] = obj.user.email;
        })
      }
      if (ids.length > 0){
        responseBody.forEach((obj) => {
          ids.forEach((id) => {
            if(id === obj.user.id){
              selectedUser.push(obj.user.id.toString())
            }
          })
        })
      }
      // console.log('kikoo', ids);
      // console.log('kikoo', uglyObject);
      // console.log('selectedUser', selectedUser);
      return this.setState({
        isLoading: false,
        dataList: uglyObject,
        // userList: selectedUser
        // selectedUser: ids,
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
  let dirtyCheck = '';
  if(this.state.putOrPost === 'PUT'){
    dirtyCheck = `/${this.state.id}`;
  }
  let uglyyyGlobal = null;
  return getToken()
  .then((bulkAccess) => {
    const objAccess = JSON.parse(bulkAccess);
    uglyyyGlobal = objAccess;
    return fetch(`http://another-calendar.herokuapp.com/api/v1/user/groups${dirtyCheck}`, {
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
        })
      })
  })
  .then((response) => {
    console.log('response after submitting group', response);
    const responseHeaders = response.headers.map;
    const responseBody = JSON.parse(response._bodyText);
    // console.log('responsresponseHeaderskdkqidjiqeBody', responseHeaders);
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
    const userIds = this.state.userList;
    console.log('userIds', userIds);
    // userIds.shift();
    const promises = [];
    if(userIds.length > 0){
      userIds.forEach((id) => {
        console.log('COUCOU FDP');
        // let userId =
        let func = new Promise((resolve, reject) => {
          return fetch(`http://another-calendar.herokuapp.com/api/v1/user/groups/${responseBody.id}/contact`, {
            method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                uid: uglyyyGlobal.uid,
                client: uglyyyGlobal.client,
                expiry: uglyyyGlobal.expiry,
                access_token: uglyyyGlobal.access_token
              },
              body: JSON.stringify({
                contact_id: parseInt(id,10)
              })
            })
            .then((addMember)=>{
              console.log('addMember reuslt', addMember);
              resolve(addMember);
            })
          });
        promises.push(func)
      });
      return Promise.all(promises);
    }
  })
  .then((truc) => {
    // alert(JSON.stringify(error));
    console.log('response from add/edit group', truc);
  })
  .catch((error) => {
    alert(JSON.stringify(error));
    console.error(error);
  });
};

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
        keyboardType="email-address"
        disabled={this.state.isLoading}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        />
        <CustomMultiPicker
          options={this.state.dataList}
          search={true}
          multiple={true}
          placeholder={"Ajouter des amis a ce calendrier"}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
          returnValue={"value"} // label or value
          rowBackgroundColor={"#eee"}
          rowHeight={40}
          selected={this.state.selectedUserList}
          callback={(userList) => this.setState({userList})}
          rowRadius={5}
          iconColor={"#00a2dd"}
          iconSize={30}
          selectedIconName={"ios-checkmark-circle-outline"}
          unselectedIconName={"ios-radio-button-off-outline"}
          scrollViewHeight={130}
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
// value={this.state.userList}
// callback={(userList)=>{ console.log(userList) }}
// callback={(userList) => this.setState({userList})}
//selected={[1,2]} // list of options which are selected by default
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
