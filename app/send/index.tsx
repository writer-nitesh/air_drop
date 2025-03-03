import FilePicker from '@/components/FilePicker';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    const handleFileSelect = (file: any) => {
        console.log('Selected File:', file);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>File Picker</Text>
            <FilePicker onFileSelect={handleFileSelect} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
