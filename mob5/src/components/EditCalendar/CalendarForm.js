import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";

export default class CalendarForm extends Component {
  logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
  }
  userList = {
    "123":"Tom",
    "124":"Michael",
    "125":"Christin"
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
        onSubmitEditing={() => this.passwordInput.focus()}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        />
        <TextInput
        placeholder="Description"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="go"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        ref={(input) => this.passwordInput = input}
        />
        <CustomMultiPicker
          options={this.userList}
          search={true} // should show search bar?
          multiple={true} //
          placeholder={"Ajouter des amis a ce calendrier"}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
          returnValue={"label"} // label or value
          callback={(res)=>{ console.log(res) }} // callback, array of selected items
          rowBackgroundColor={"#eee"}
          rowHeight={40}
          rowRadius={5}
          iconColor={"#00a2dd"}
          iconSize={30}
          selectedIconName={"ios-checkmark-circle-outline"}
          unselectedIconName={"ios-radio-button-off-outline"}
          scrollViewHeight={130}
          selected={[1,2]} // list of options which are selected by default
        />

        <TouchableOpacity style={styles.buttonContainer}
          onPress={() => {
            onSignIn().then(() => navigate("SignedIn"));
          }}>
          <Text style={styles.buttonText}> LOGIN </Text>
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
