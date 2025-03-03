import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function FilePicker({ onFileSelect }: { onFileSelect: (file: DocumentPicker.DocumentPickerResult) => void }) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Accept all file types, change if needed (e.g., 'image/*', 'application/pdf')
            });

            if (result.canceled) return;

            const file = result.assets[0]; // Get the selected file
            setSelectedFile(file.name);
            onFileSelect(result);
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={pickFile}>
                <Text style={styles.buttonText}>Select File</Text>
            </TouchableOpacity>
            {selectedFile && <Text style={styles.fileName}>Selected: {selectedFile}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    fileName: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
});
