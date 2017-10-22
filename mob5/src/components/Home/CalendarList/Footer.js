import React from 'react';
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

// export default Footer= (props) => (
//   <View style={styles.container}>
//     <TouchableOpacity style={styles.buttonContainer}
//       onPress={() => navigate("Calendar")}>
//       <Text style={styles.buttonText}> TESTOMGLOL</Text>
//     </TouchableOpacity>
//   </View>
// );

export default class Footer extends React.Component {
  render() {
    const { navigate } = this.props.navigate;
    return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonContainer}
            onPress={() => navigate("Calendar")}>
            <Text style={styles.buttonText}> TESTOMGLOL</Text>
          </TouchableOpacity>
        </View>
    )
  }
}
