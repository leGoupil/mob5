import React, {Component} from 'react';
import { StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StatusBar,
  ListView } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { getToken } from '../../auth';
import ParticipantView from './participantView';

export default class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyOpenSwipeable: null,
      dataList: [],
      isLoading: false,
      title: null,
      userList: [],
      eventList: [],
      image: null,
      putOrPost: 'POST',
      isOwner: false,
      date:"21-10-2017"
    }
  }

  formatData() {
    const data = this.state.dataList
    , alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    , dataBlob = {}
    , sectionIds = []
    , rowIds = [];

    if(data.length > 0) {
      for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
        const currentChar = alphabet[sectionId];
        const users = data.filter((user) => user.user.email.toUpperCase().indexOf(currentChar) === 0);
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
    }
    return { dataBlob, sectionIds, rowIds };
  }

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  componentDidMount() {
    let editEvent = null
    , calendar = null
    , event = null
    , title = '';
    if(this.props.navigate){
      const nav = this.props.navigate;
      if(nav.state){
        if(nav.state.params){
          if(nav.state.params.data){
            editEvent = nav.state.params.data;
            calendar = editEvent.calendar;
            event = editEvent.item;
            title = event.name;
          }
        }
      }
    }
    return getToken()
    .then((bulkAccess) => {
      const objAccess = JSON.parse(bulkAccess);
      let isOwner = false;
      if(editEvent){
        if(objAccess.id === editEvent.calendar.owner.id){
          isOwner = true;
        }
      }
      this.setState({
        title,
        objAccess,
        isOwner
      });
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
      let putOrPost = 'POST';
      if(editEvent){
        putOrPost = 'PUT';
      }
      this.setState({
        isLoading: false,
        dataList: uglyObject,
        id: editEvent.id, //calendarId
        eventList: editEvent.events_attributes || [],
        userList: editEvent.calendar_participants_attributes || [],
        image: editEvent.image || null,
        putOrPost
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

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
        list.push(id);
      });
      const buildBody = {}
      , check = this.state.isOwner;
      buildBody.title = this.state.title;
      if(!check){
        buildBody.calendar_participants_attributes = list;
        buildBody.events_attributes = [];
        buildBody.image = this.state.image || null;
      }
      const checkPut = this.state.id ? `/${this.state.id}` : null
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
        body: JSON.stringify(buildBody)
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

  participantView = (props) => {
    return (
      <ListView
        style={styles.container}
        onScroll={this.handleScroll}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row
          navigate={this.props.navigate}
          data={data}
          itemProps={itemProps}/>}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
        />
    );
  }

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
    const isDisable = () => {
      if(!this.state.isOwner || this.state.isLoading){
        return true;
      }
      return false
    }
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
      deleteFriend: (calendar) => {
        navigate('EditFriend');
      }
    };
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          />
        <TextInput
          placeholder="Titre de l'évènement"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          value={this.state.title}
          onChangeText={(title) => this.setState({title})}
          disabled={this.isDisable}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />
        <this.participantView isPrimary={this.state.isPrimary} />
        <TouchableOpacity style={styles.buttonContainer}
          onPress={this._onPressButton}
          disabled={this.state.isLoading}>
          <Text style={styles.buttonText}> Ajouter un évenement </Text>
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

//
// <DatePicker
//   style={{width: 200}}
//   date={this.state.date}
//   mode="date"
//   placeholder={this.state.date}
//   format="DD-MM-YYYY"
//   minDate="21-10-2017"
//   maxDate="21-10-2018"
//   confirmBtnText="Confirm"
//   cancelBtnText="Cancel"
//   customStyles={{
//     dateIcon: {
//       position: 'absolute',
//       left: 0,
//       top: 4,
//       marginLeft: 0
//     },
//       dateInput: {
//         marginLeft: 36
//       }
//
//   }}
// onDateChange={(date) => {this.setState({date: date})}}
// />
