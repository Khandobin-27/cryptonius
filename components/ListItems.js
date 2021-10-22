import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'


const ListItems = ({name, symbol, currentPrice, priceChangePercentage7d, logoUrl, onPress}) => {
    const priceChangeColor = priceChangePercentage7d > 0 ? '#34c759' : '#ff3b30'
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.itemWrapper}>
                {/*Left side of individual box*/}
                <View style={styles.leftWrapper}>
                    <Image 
                    source={{uri: logoUrl}} 
                    style={styles.image}
                    />
                    <View style={styles.titlesWrapper}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>{symbol}</Text>
                    </View>
                </View>

                {/*Right side of the box*/}
                <View style={styles.rightWrapper}>
                    <Text style={styles.title}>${currentPrice.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                    <Text style={[styles.subtitle, {color: priceChangeColor}]}>{priceChangePercentage7d.toFixed(2)}%</Text>
                </View>
                
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemWrapper: {
        paddingHorizontal: 16,
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
      },
      leftWrapper: {
        flexDirection: "row",
        alignItems: 'center',
      },
      image: {
        height: 48,
        width: 48,
      },
      titlesWrapper: {
        marginLeft: 8,
      },
      title: {
        fontSize: 18,
        color: 'white',
      },
      subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#bebebe",
        textTransform: 'uppercase'
      },
      rightWrapper: {
        alignItems: 'flex-end',
      },
})

export default ListItems
