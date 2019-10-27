import React, {useState, useCallback} from 'react';
import {ActivityIndicator, Animated, PanResponder} from 'react-native';
import PropTypes from 'prop-types';

import MeetupCard from '../MeetupCard';
import Empty from '../Empty';

import {Wrapper, Container} from './styles';

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default function MeetupList({
  meetups,
  handleEndReached,
  handleRefresh,
  refreshing,
  loadingPage,
  handleSubscription,
  navigation,
  handleAddDate,
  handleSubDate,
}) {
  const [viewable, setViewable] = useState([]);

  const xAxis = new Animated.Value(0);

  const _panResponder = PanResponder.create({
    onPanResponderTerminationRequest: () => false,
    onMoveShouldSetPanResponder: (evt, {dx, dy}) => {
      const isClick = dx < 2 && dy < 2 && dx > -2 && dy > -2;
      return !isClick;
    },

    onPanResponderMove: Animated.event([
      null,
      {
        dx: xAxis,
      },
    ]),

    onPanResponderRelease: () => {
      if (xAxis._value <= -180) {
        handleAddDate();
        return;
      }

      if (xAxis._value >= 180) {
        handleSubDate();
        return;
      }

      Animated.spring(xAxis, {
        toValue: 0,
        bounciness: 10,
      }).start();
    },

    onPanResponderTerminate: () => {
      Animated.spring(xAxis, {
        toValue: 0,
        bounciness: 10,
      }).start();
    },
  });

  const handleViewableChanged = useCallback(({viewableItems}) => {
    setViewable(viewableItems.map(({item}) => item.id));
  }, []);

  return (
    <Wrapper {..._panResponder.panHandlers}>
      <AnimatedContainer
        style={[
          {
            transform: [
              {
                translateX: xAxis,
              },
            ],
          },
          {
            opacity: xAxis.interpolate({
              inputRange: [-120, 0, 120],
              outputRange: [0, 1, 0],
              extrapolate: false,
            }),
          },
        ]}
        data={meetups}
        keyExtractor={m => String(m.id)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 10}}
        ListFooterComponent={
          loadingPage && <ActivityIndicator color="#999" size={30} />
        }
        renderItem={({item}) => (
          <MeetupCard
            {..._panResponder.panHandlers}
            onPress={() => handleSubscription(item.id)}
            mainButton="SUBSCRIBE"
            meetup={item}
            shouldLoad={viewable.includes(item.id)}
            navigation={navigation}
          />
        )}
        ListEmptyComponent={<Empty>There is no meetup on this day</Empty>}
      />
    </Wrapper>
  );
}

MeetupList.propTypes = {
  meetups: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleEndReached: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  loadingPage: PropTypes.bool.isRequired,
  handleSubscription: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  handleAddDate: PropTypes.func.isRequired,
  handleSubDate: PropTypes.func.isRequired,
};
