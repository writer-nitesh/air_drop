import { Link } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRef, useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    interpolateColor,
    Easing,
    SlideInDown
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Home() {
    // Animation values
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(-20);
    const buttonScale = useSharedValue(0.9);
    const sendButtonX = useSharedValue(-width);
    const receiveButtonX = useSharedValue(width);
    const cardElevation = useSharedValue(5);

    // Animated styles
    const titleAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: titleOpacity.value,
            transform: [
                { translateY: titleTranslateY.value }
            ]
        };
    });

    const cardAnimatedStyle = useAnimatedStyle(() => {
        return {
            elevation: cardElevation.value,
            shadowOpacity: cardElevation.value / 20,
            transform: [
                {
                    scale: withSequence(
                        withDelay(900, withSpring(1.05, { damping: 2 })),
                        withSpring(1, { damping: 12 })
                    )
                }
            ]
        };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: buttonScale.value }
            ]
        };
    });

    const sendButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: sendButtonX.value }
            ]
        };
    });

    const receiveButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: receiveButtonX.value }
            ]
        };
    });

    // Handlers for button press animations
    const onPressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 150 });
    };

    const onPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };

    // Start animations when component mounts
    useEffect(() => {
        // Animate title
        titleOpacity.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        titleTranslateY.value = withTiming(0, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

        // Animate buttons
        sendButtonX.value = withDelay(300, withSpring(0, {
            damping: 15,
            stiffness: 120
        }));

        receiveButtonX.value = withDelay(500, withSpring(0, {
            damping: 15,
            stiffness: 120
        }));

        // Card elevation animation
        cardElevation.value = withDelay(600, withTiming(15, { duration: 600 }));

        // Pulse animation for the card
        const interval = setInterval(() => {
            cardElevation.value = withSequence(
                withTiming(10, { duration: 1500 }),
                withTiming(15, { duration: 1500 })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.card, cardAnimatedStyle]}>
                <LinearGradient
                    colors={['#4e54c8', '#8f94fb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                >
                    <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                        Air Drop
                    </Animated.Text>

                    <View style={styles.buttonContainer}>
                        <Animated.View style={[styles.buttonWrapper, sendButtonAnimatedStyle]}>
                            <Link href="/send" asChild>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    activeOpacity={0.8}
                                >
                                    <Animated.View style={[buttonAnimatedStyle, styles.buttonInner]}>
                                        <Ionicons name="arrow-up-circle" size={24} color="#4e54c8" />
                                        <Text style={styles.buttonText}>Send</Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            </Link>
                        </Animated.View>

                        <Animated.View style={[styles.buttonWrapper, receiveButtonAnimatedStyle]}>
                            <Link href="/receive" asChild>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    activeOpacity={0.8}
                                >
                                    <Animated.View style={[buttonAnimatedStyle, styles.buttonInner]}>
                                        <Ionicons name="arrow-down-circle" size={24} color="#4e54c8" />
                                        <Text style={styles.buttonText}>Receive</Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            </Link>
                        </Animated.View>
                    </View>
                </LinearGradient>
            </Animated.View>

            <Animated.View
                style={styles.footerText}
                entering={SlideInDown.delay(800).springify()}
            >
                <Text style={styles.infoText}>Easily share files between devices</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafc',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    cardGradient: {
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonWrapper: {
        margin: 10,
        width: '40%',
    },
    button: {
        overflow: 'hidden',
    },
    buttonInner: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e54c8',
        marginTop: 8,
    },
    footerText: {
        marginTop: 40,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    }
});