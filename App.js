import React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { Appbar } from 'react-native-paper';
import { isEmpty } from 'lodash';
import SegmentedControlTab from "react-native-segmented-control-tab";
import axios from 'axios';


const App = () => {
  const [locationIndex, setLocationIndex] = useState(0);
  const [worldData, setWorldData] = useState({});
  const [usData, setUSData] = useState({});

  useEffect(() => {
    axios.all([
      axios.get('https://api.covid19api.com/summary'),
      axios.get('https://api.covid19api.com/total/country/united-states')
    ])
      .then(axios.spread((res1, res2) => {
        setWorldData(res1.data);
        setUSData(res2.data);
      }));
  }, []);

  const handleLocationChange = (index) => {
    setLocationIndex(index);
  };

  const DataSection = () => {
    return (
      <>
        <Text style={styles.bottom}>Confirmed cases</Text>
        <Text style={[styles.bottom, { fontSize: 24 }]}>{locationIndex == 0 ? worldData.Global.TotalConfirmed : usData[usData.length - 1].Confirmed}</Text>
        <Text style={styles.bottom}>Total deaths</Text>
        <Text style={[styles.bottom, { color: 'red', fontSize: 24 }]}>{locationIndex == 0 ? worldData.Global.TotalDeaths : usData[usData.length - 1].Deaths}</Text>
        <Text style={styles.bottom}>Total recovered</Text>
        <Text style={[styles.bottom, { color: 'green', fontSize: 24 }]}>{locationIndex == 0 ? worldData.Global.TotalRecovered : usData[usData.length - 1].Recovered}</Text>
        <SegmentedControlTab
          values={["World", "US"]}
          selectedIndex={locationIndex}
          onTabPress={handleLocationChange}
          tabsContainerStyle={{ alignSelf: 'center', width: 125 }}
          activeTabTextStyle={{ color: 'grey' }}
          activeTabStyle={{ backgroundColor: 'white' }}
          tabTextStyle={{ color: 'white' }}
          tabStyle={{ backgroundColor: 'grey', borderColor: 'grey' }}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="lightgrey" />
      <Appbar style={styles.appBar}>
        <Appbar.Content title="COVID-19 Totals" />
      </Appbar>
      {isEmpty(worldData) ?
        <ActivityIndicator style={styles.activityIndicator} /> :
        <SafeAreaView style={styles.container}>
          <DataSection />
        </SafeAreaView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  appBar: {
    backgroundColor: 'lightgrey',
  },
  bottom: {
    marginBottom: 30,
  },
  activityIndicator: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;