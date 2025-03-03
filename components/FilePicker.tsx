import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    SlideInUp,
    FadeIn,
    ZoomIn,
    FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Get device width to handle responsive layouts
const { width } = Dimensions.get('window');

// A helper function to get file type icon
const getFileIcon = (fileName: string) => {
    if (!fileName) return 'file-outline';

    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf': return 'file-pdf-box';
        case 'doc':
        case 'docx': return 'file-word-box';
        case 'xls':
        case 'xlsx': return 'file-excel-box';
        case 'ppt':
        case 'pptx': return 'file-powerpoint-box';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'file-image-box';
        case 'mp4':
        case 'mov':
        case 'avi': return 'file-video-box';
        case 'mp3':
        case 'wav': return 'file-music-box';
        case 'zip':
        case 'rar': return 'zip-box';
        default: return 'file-outline';
    }
};

// A helper function to format file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FilePicker({ onFileSelect }: { onFileSelect: (file: DocumentPicker.DocumentPickerResult) => void }) {
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const buttonScale = useSharedValue(1);
    const cardScale = useSharedValue(0.9);
    const cardOpacity = useSharedValue(0);
    const buttonWidth = useSharedValue(width * 0.5); // Start with a wider button
    const iconRotation = useSharedValue(0);

    // Run animation when we have a selected file
    useEffect(() => {
        if (selectedFile) {
            cardScale.value = withSpring(1, { damping: 12 });
            cardOpacity.value = withTiming(1, { duration: 400 });
            buttonWidth.value = withTiming(width * 0.4, { duration: 300 }); // Shrink button when file is selected

            // Start a subtle rotation animation for the icon
            const interval = setInterval(() => {
                iconRotation.value = withSequence(
                    withTiming(-0.05, { duration: 1000 }),
                    withTiming(0.05, { duration: 1000 })
                );
            }, 2000);

            return () => clearInterval(interval);
        } else {
            // Reset animations if file is removed
            buttonWidth.value = withTiming(width * 0.5, { duration: 300 });
        }
    }, [selectedFile]);

    // Animated styles
    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
            width: buttonWidth.value,
        };
    });

    const cardAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: cardOpacity.value,
            transform: [{ scale: cardScale.value }],
        };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${iconRotation.value}rad` }],
        };
    });

    const pickFile = async () => {
        try {
            buttonScale.value = withSequence(
                withTiming(0.9, { duration: 100 }),
                withTiming(1, { duration: 200 })
            );

            setIsLoading(true);

            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            setIsLoading(false);

            if (result.canceled) return;

            const file = result.assets[0];
            setSelectedFile(file);
            onFileSelect(result);
        } catch (error) {
            setIsLoading(false);
            console.error('Error picking file:', error);
        }
    };

    const clearSelection = () => {
        cardOpacity.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        });

        setTimeout(() => {
            setSelectedFile(null);
        }, 300);
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={SlideInUp.springify().delay(300)}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={pickFile}
                    disabled={isLoading}
                >
                    <Animated.View style={[styles.button, buttonAnimatedStyle]}>
                        <LinearGradient
                            colors={['#4776E6', '#8E54E9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradient}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <Animated.View style={iconAnimatedStyle}>
                                        <MaterialCommunityIcons name="file-upload-outline" size={20} color="#fff" />
                                    </Animated.View>
                                    <Text style={styles.buttonText}>
                                        {selectedFile ? 'Change File' : 'Select File'}
                                    </Text>
                                </View>
                            )}
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>

            {selectedFile && (
                <Animated.View style={[styles.fileCard, cardAnimatedStyle]} entering={ZoomIn.delay(200)}>
                    <View style={styles.fileIconContainer}>
                        <MaterialCommunityIcons
                            name={getFileIcon(selectedFile.name)}
                            size={32}
                            color="#4776E6"
                        />
                    </View>
                    <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                            {selectedFile.name}
                        </Text>
                        <Text style={styles.fileInfo}>
                            {formatFileSize(selectedFile.size)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
                        <MaterialCommunityIcons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    button: {
        height: 52,
        borderRadius: 26,
        overflow: 'hidden',
        shadowColor: '#4776E6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginVertical: 16,
    },
    gradient: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    fileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        width: width * 0.85,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    fileIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        width: '95%',
    },
    fileInfo: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
});