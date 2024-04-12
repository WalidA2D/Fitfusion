import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function Card({ title, image }) {
    return (
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Image source={image} style={styles.cardImage}/>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
        alignItems: 'center',
    },
    cardTitle: {
        color: '#fff',
        marginBottom: 10,
    },
    cardImage: {
        width: 100,
        height: 100,
    },
});

export default Card;
