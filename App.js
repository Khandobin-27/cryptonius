
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, FlatList } from 'react-native';
import SafeViewAndroid from './components/SafeView'
import ListItems from './components/ListItems';
import {
  BottomSheetModal,
  BottomSheetModalProvider
 } from '@gorhom/bottom-sheet';
 import Chart from './components/Chart'
 import { getMarketData } from './API/cryptoAPI';
 import StatusBar from './components/StatusBar'

 //static currencies for the first development
// import {SAMPLE_DATA} from './assets/data/sampleData'

const STATUS_BAR_COLOR = '#131313';
const appTitle = '{ Crypto currencies }'

const ListHeader = () => {
  return (
    <>
    <View style={styles.titleWrapper}>
        <Text style={styles.largeTitle}>{appTitle}</Text>
      </View>
      {/* <View style={styles.divider} /> */}
    </>
  )
  
}
export default function App() {
  //calling the data from the cryptoService.js with following state and useEffect
  const [data, setData] = useState([]);

  //obataining data from API (follow cryptoService.js)
  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    }

    fetchMarketData();
  }, [])
  
  //state to store actual data for the Chart component
  const [selectedCoinData, setSelectedCoinData] = useState(null)

  //from the library botom sheet react native
  // ref  
  const bottomSheetModalRef = useRef(null);
  // variables  
  const snapPoints = useMemo(() => ['50%'], []);

  const openModal = (item) => {
    setSelectedCoinData(item)
    bottomSheetModalRef.current.present();
  }


  
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <StatusBar backgroundColor={STATUS_BAR_COLOR} barStyle="light-content" />
          <FlatList 
            keyExtractor={item => item.id}
            data={data}
            renderItem={({item}) => {
              return (
                <ListItems 
                  name={item.name}
                  symbol={item.symbol}
                  currentPrice={item.current_price}
                  priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
                  logoUrl={item.image}

                  onPress={() => openModal(item)}
                />
              )
            }}
            ListHeaderComponent={<ListHeader />}
          />
      </SafeAreaView>
        <BottomSheetModal          
        ref={bottomSheetModalRef}         
        index={0}          
        snapPoints={snapPoints}
        style={styles.bottomSheet}         
        > 
        {/*if selectedCoin exists, then show chart component, if not then null*/}
        {    selectedCoinData ? (   
          <Chart  
          currentPrice={selectedCoinData.current_price}
          logoUrl={selectedCoinData.image}
          name={selectedCoinData.name}
          priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
          sparkLine={selectedCoinData.sparkline_in_7d.price}
          symbol={selectedCoinData.symbol}
          />
        ) : null
        }             
        </BottomSheetModal> 
  </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  largeTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: 'white',
    textTransform: 'uppercase',
    marginBottom: 10,
    // textAlign: 'center'
  },
  titleWrapper: {
    paddingHorizontal: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee7e7',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    borderTopWidth: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
