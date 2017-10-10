// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   text: {
//     marginLeft: 12,
//     fontSize: 16,
//   },
//   photo: {
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//   },
// });
//
//
// // export default Row;
//
// export default class Row extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dataSource: props,
//     };
//     // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     // this.state = {
//     //   dataSource: ds.cloneWithRows(['row 1', 'row 2']),
//     // };
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <Image source={{ uri: dataSource.picture.large}} style={styles.photo} />
//         <Text style={styles.text}>
//           {`${dataSource.name.first} ${dataSource.name.last}`}
//         </Text>
//       </View>
//     );
//   }
// }

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

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
});

export default Row = (props) => (
  <View style={styles.container}>
    <Image source={{ uri: props.picture.large}} style={styles.photo} />
    <Text style={styles.text}>
      {`${props.name.first} ${props.name.last}`}
    </Text>
  </View>
);

// export default Row;
