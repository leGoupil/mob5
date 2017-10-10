import React from 'react';
import { View, StyleSheet, ListView, Text } from 'react-native';
import Row from './Row';
import Header from './Header';
import SectionHeader from './SectionHeader';
import Footer from './Footer';
import datalist from './data'


export default class CalendarList extends React.Component {
  formatData(data) {
   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

   const dataBlob = {};
   const sectionIds = [];
   const rowIds = [];

   for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
     const currentChar = alphabet[sectionId];
     const users = data.filter((user) => user.name.first.toUpperCase().indexOf(currentChar) === 0);
     if (users.length > 0) {
       sectionIds.push(sectionId);
        dataBlob[sectionId] = { character: currentChar };
        rowIds.push([]);
        for (let i = 0; i < users.length; i++) {
          const rowId = `${sectionId}:${i}`;
          rowIds[rowIds.length - 1].push(rowId);
          dataBlob[rowId] = users[i];
        }
      }
    }
    return { dataBlob, sectionIds, rowIds };
  }

  state = {
      currentlyOpenSwipeable: null
   };
   handleScroll = () => {
     const {currentlyOpenSwipeable} = this.state;

     if (currentlyOpenSwipeable) {
       currentlyOpenSwipeable.recenter();
     }
   };


  render() {
    const { navigate } = this.props.navigate;
    const {currentlyOpenSwipeable} = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }
        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null})
    };
    const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      getSectionData,
      getRowData,
    });
    const { dataBlob, sectionIds, rowIds } = this.formatData(datalist);
    this.state = {
      currentlyOpenSwipeable: null,
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
    };

    return (
      <ListView
        style={styles.container}
        onScroll={this.handleScroll}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row data={data} itemProps={itemProps} />}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        renderHeader={() => <Header navigate={this.props.navigate}/>}
        renderFooter={() => <Footer />}
        renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  marginTop: 20,
  },
  separator: {
  flex: 1,
  height: StyleSheet.hairlineWidth,
  backgroundColor: '#8E8E8E',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
