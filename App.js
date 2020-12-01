/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import {PanGestureHandler, State} from 'react-native-gesture-handler';

import Animated, {
  useCode,
  add,
  sub,
  cond,
  concat,
  set,
  eq,
  and,
  greaterThan,
  lessThan,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import {
  usePanGestureHandler,
  useValue,
  useClock,
  clamp,
  timing,
  spring,
  minus,
  snapPoint,
} from 'react-native-redash/lib/module/v1';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

const snapPoints = [-200, 0];
const cards = [
  {id: 1, name: 'Visa', color: 'gold'},
  {id: 2, name: 'MasterCard', color: 'blue'},
  {id: 3, name: 'American Express', color: 'red'},
];
const {width} = Dimensions.get('window');

const Card = ({card, offset, offsets}) => {
  const {gestureHandler, translation, velocity, state} = usePanGestureHandler();
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const translateY = useValue(0);
  const offsetY = useValue(0);
  const rotate = useValue(0);
  const zIndex = useValue(card.id);
  const cardsNum = useValue(cards.length);
  const clock = useClock();
  const xclock = useClock();
  const secondClock = useClock();
  const scaleClock = useClock();
  const rotateClock = useClock();

  const scale = useValue(1);
  const to = snapPoint(translateY, velocity.Y, snapPoints);
  const toScale = snapPoint(scale, velocity.Y, snapPoints);

  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translateY, clamp(translation.y, -2200, 320)),
        cond(lessThan(translateY, -120), [
          set(zIndex, sub(zIndex, cardsNum)),
          set(offsets[0], timing({from: offsets[0], to: 230})),
          set(offsets[1], timing({from: offsets[1], to: 260})),
        ]),
        //cond(greaterThan(translateY, 150), set(zIndex, (add ))),
        set(
          translateX,
          interpolate(translation.y, {
            inputRange: [-500, 0],
            outputRange: [150, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        ),
        set(
          scale,
          interpolate(translation.y, {
            inputRange: [-100, 0],
            outputRange: [0.8, 1],
            extrapolate: Extrapolate.CLAMP,
          }),
        ),
        set(
          rotate,
          concat(
            interpolate(translation.y, {
              inputRange: [-200, 0],
              outputRange: [20, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
            'deg',
          ),
        ),
      ]),

      cond(eq(state, State.END), [
        set(translateY, timing({from: translateY, to: 0})),
        set(offsets[2], timing({from: offsets[2], to: 200})),
        set(scale, timing({from: scale, to: 1})),
        cond(lessThan(translateY, -200), set(zIndex, 0)),
        cond(greaterThan(translateY, 200), set(zIndex, 2)),
        set(rotate, 0),
        set(translateX, timing({from: translateX, to: 0})),
      ]),

      // cond(and(eq(state, State.END), lessThan(translateY, -200)), [
      //   set(translateY, timing({from: translateY, to: 100})),
      //   //
      //   //set(rotate, timing({from: rotate, to: '0deg'})),
      //   // set(scale, timing({from: scale, to: 1})),
      //   // set(zIndexYellow, 0),
      // ]),

      // cond(eq(state, State.END), [
      //   set(offsetY, translateY),
      //   set(
      //     translateY,
      //     timing({
      //       clock,
      //       from: translateY,
      //       to,
      //       easing: Easing.out(Easing.cubic),
      //     }),
      //   ),
      //   set(scale, timing({clock: scaleClock, from: scale, to: 1})),
      //
      //   set(zIndexYellow, 0),
      // ]),

      //   cond(eq(state, State.END), [
      //     set(
      //       translateX,
      //       timing({
      //         clock,
      //         from: translateX,
      //         to,
      //         easing: Easing.out(Easing.cubic),
      //       }),
      //     ),
      //     set(offsetX, translateX),
      //     // cond(eq(to, -width), set(shouldRemove, 1)),
      //   ]),
    ],
    [],
  );

  return (
    <PanGestureHandler {...gestureHandler} key={card.id}>
      <Animated.View
        style={{
          zIndex,
          width: 300,
          height: 200,
          top: offset,
          left: width / 2 - 150,
          borderRadius: 10,
          position: 'absolute',
          backgroundColor: card.color,
          transform: [{translateX, translateY}, {scale}, {rotate}],
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', margin: 20}}>
          {card.name}
        </Text>
        <Image
          source={require('./pngegg.png')}
          style={{width: 50, height: 50, marginLeft: 20}}
          resizeMode="contain"
        />
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 22,
            margin: 20,
          }}>
          0412 2341 9872 1312
        </Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const App = () => {
  const offsets = [useValue(200), useValue(230), useValue(260)];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Animated.View
            style={{
              flex: 1,
              width,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {cards.map((card, index) => {
              return (
                <Card
                  card={card}
                  key={card.id}
                  offset={offsets[index]}
                  offsets={offsets}
                />
              );
            })}
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },

  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
