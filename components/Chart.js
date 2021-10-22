import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import {ChartDot, ChartPath, ChartPathProvider, ChartYLabel} from '@rainbow-me/animated-charts'
import { useSharedValue } from 'react-native-reanimated';

export const {width: SIZE} = Dimensions.get('window');

export default function Chart({currentPrice, logoUrl, name, priceChangePercentage7d, sparkLine, symbol  }) {
    //crearing latestCurrent price and the useEffect to share the value between the 
    //UI and the javascript
    const latestCurrentPrice = useSharedValue(currentPrice);
    //useShare value is used to create the reference to a JavaScript
    //that can be shared with the worklets (reanimated documentation, code formatUSD below)
    const [chartReady, setChartReady] = useState(false);
    const priceChangeColor = priceChangePercentage7d > 0 ? '#34c759' : '#ff3b30'

    useEffect(() => {
        latestCurrentPrice.value = currentPrice;
        //if you close the first currency and open second, the chart will be not shown
        //common issue for the chart library and was fixed with the forum
        //adding fake delay for the loading so the chart can be rendered
        setTimeout(() => {
          setChartReady(true);
        }, 0)
    
      }, [currentPrice])

      //formatting data to USD currency 
      const formatUSD = value => {
        'worklet';
        //if there is no acively selected number on the chart
        if (value === '') {
            const formattedValue = `$${latestCurrentPrice.value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
            return formattedValue;
        }
        //if the number is selected on the chart
        const formattedValue =`€${parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
        return formattedValue
      };
      

    return (
        <ChartPathProvider data={{ points: sparkLine, smoothingStrategy: 'bezier' }}>
            <View style={styles.chartWrapper}>
                <View style={styles.titlesWrapper}>
                    <View style={styles.upperTitles}>
                        <View style={styles.upperLeftTitle}>
                            <Image source={{ uri: logoUrl }} style={styles.image} />
                            <Text style={styles.subtitle}>{name} ({symbol.toUpperCase()})</Text>
                        </View>
                        <Text style={styles.subtitle}>7d</Text>
                    </View>
                    <View style={styles.lowerTitles}>
                      {/*ChartYLabel from the library to display price at every point of the chart line*/}
                        <ChartYLabel
                        format={formatUSD}
                        style={styles.boldTitle}
                        />
                        <Text style={[styles.title, {color: priceChangeColor}]}>{priceChangePercentage7d.toFixed(2)}%</Text>
                    </View>
                </View>   
            </View>
            { chartReady ? (
                <View style={styles.chartLineWrapper}>
                    <ChartPath height={SIZE / 2.05} stroke="black" width={SIZE} />
                    <ChartDot style={{ backgroundColor: 'black' }} />
                </View>
            ) : null}
            
        </ChartPathProvider>
    )
}

const styles = StyleSheet.create({
    chartWrapper: {
      marginVertical: 16
    },
    titlesWrapper: {
      marginHorizontal: 16
    },
    upperTitles: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    upperLeftTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 24,
      height: 24,
      marginRight: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#A9ABB1',
    },
    lowerTitles: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    boldTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 18,
    },
    chartLineWrapper: {
      marginTop: 40,
    },
    chartLineWrapper: {
        marginTop: 40,
    }
  });