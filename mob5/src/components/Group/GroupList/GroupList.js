import React from 'react';
import { View, StyleSheet, ListView, Text } from 'react-native';
import Row from './Row';
import Header from './Header';
import SectionHeader from './SectionHeader';
import Footer from './Footer';
import { getToken } from '../../../auth';

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


export default class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyOpenSwipeable: null,
      dataList: [],
      needRefresh: false
    }
  }
  formatData() {
    const data = this.state.dataList
    , alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    , dataBlob = {}
    , sectionIds = []
    , rowIds = [];

    if(data.length > 0 && this.state.objAccess) {
      // for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
      //   const currentChar = alphabet[sectionId];
      //   const calendars = data.filter((calendar) => calendar.title.toUpperCase().indexOf(currentChar) === 0);
      //   if (calendars.length > 0) {
      //     sectionIds.push(sectionId);
      //     dataBlob[sectionId] = { character: currentChar };
      //     rowIds.push([]);
      //     for (let i = 0; i < calendars.length; i++) {
      //       const rowId = `${sectionId}:${i}`;
      //       rowIds[rowIds.length - 1].push(rowId);
      //       dataBlob[rowId] = calendars[i];
      //     }
      //   }
      // }
      for (let sectionId = 0; sectionId < 1; sectionId++) {
        const ownerOrNot = sectionId ? `Groupes auxquels j'appartient` : 'Mes groupes' ;
        // console.log('test : ', this.state.objAccess.id);
        // console.log('test 2 : ', sectionId);
        // const groups = data.filter((calendar) => calendar.title.toUpperCase().indexOf(currentChar) === 0);
        const groups = data.filter((group) => {
          // console.log('group', group);
          if(!sectionId){
            // console.log('sectionId 0', group.owner.id === this.state.objAccess.id)
             return group.owner.id === this.state.objAccess.id
          }
          // console.log('sectionId 1', group.owner.id !== this.state.objAccess.id)
          return  group.owner.id !== this.state.objAccess.id
        });
        // console.log('groups by sectionId', sectionId, ownerOrNot, groups);
        if (groups.length > 0) {
          sectionIds.push(sectionId);
          dataBlob[sectionId] = { text: ownerOrNot };
          // console.log('dataBlob', dataBlob);
          rowIds.push([]);
          for (let i = 0; i < groups.length; i++) {
            const rowId = `${sectionId}:${i}`;
            rowIds[rowIds.length - 1].push(rowId);
            dataBlob[rowId] = groups[i];
          }
        }
      }
    }
    return { dataBlob, sectionIds, rowIds };
  }

  getGroups() {
    let tmp = null;
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      tmp = objAccess;
      return fetch('http://another-calendar.herokuapp.com/api/v1/user/groups', {
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
      // console.log('response from group list', response)
      const responseHeaders = response.headers.map;
      const responseBody = JSON.parse(response._bodyText);
      if(responseBody.error){
        return this.setState({
          isLoading: false,
          objAccess: tmp
        }, function () {
          alert(JSON.stringify(responseBody.error));
        });
      }
      // console.log('DATALIST', responseBody);
      return this.setState({
        isLoading: false,
        dataList: responseBody,
        objAccess: tmp
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getGroups();
    // let tmp = null;
    // return getToken()
    // .then((bulkAccess) => {
    //   const objAccess = JSON.parse(bulkAccess);
    //   tmp = objAccess;
    //   return fetch('http://another-calendar.herokuapp.com/api/v1/user/groups', {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       uid: objAccess.uid,
    //       client: objAccess.client,
    //       expiry: objAccess.expiry,
    //       access_token: objAccess.access_token
    //     }
    //   })
    // })
    // .then((response) => {
    //   // console.log('response from group list', response)
    //   const responseHeaders = response.headers.map;
    //   const responseBody = JSON.parse(response._bodyText);
    //   if(responseBody.error){
    //     return this.setState({
    //       isLoading: false,
    //       objAccess: tmp
    //     }, function () {
    //       alert(JSON.stringify(responseBody.error));
    //     });
    //   }
    //   // console.log('DATALIST', responseBody);
    //   return this.setState({
    //     isLoading: false,
    //     dataList: responseBody,
    //     objAccess: tmp
    //   });
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }
  // componentWillUpdate(this.state. nextProps, object nextState);

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  render() {
    const { navigate } = this.props.navigate;
    const {currentlyOpenSwipeable} = this.state;
    const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      getSectionData,
      getRowData,
    });
    const { dataBlob, sectionIds, rowIds } = this.formatData();
    this.state = {
      dataList: [],
      currentlyOpenSwipeable: null,
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
    };
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }
        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: (event, gestureState, swipeable) => {
        this.setState({currentlyOpenSwipeable: null})
      },
      deleteGroup: (id) => {
        this.getGroups();
      },
      editGroup: (calendar) => {
        navigate('EditGroup');
      },
    };

    return (
      <ListView
        style={styles.container}
        onScroll={this.handleScroll}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row
          navigate={this.props.navigate}
          needRefresh={this.state.needRefresh}
          data={data}
          itemProps={itemProps}/>}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        renderHeader={() => <Header navigate={this.props.navigate}/>}
        renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
        />
    );
  }
}
