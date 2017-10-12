import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: '#8E8E8E',
  },
});

export default class Header extends Component {
  render() {
    const { navigate } = this.props.navigate;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigate("EditCalendar")}>
          <Text style={styles.text}>Ajouter un calendrier</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
