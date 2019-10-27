import React from 'react';
import {Animated} from 'react-native';
import PropTypes from 'prop-types';

import {Small, Banner} from './styles';

const AnimatedBanner = Animated.createAnimatedComponent(Banner);

export default function LazyImage({url, shouldLoad}) {
  const opacity = new Animated.Value(0);

  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Small source={{uri: url}} resizeMode="cover" blurRadius={0.5}>
      {shouldLoad && (
        <AnimatedBanner
          style={{opacity}}
          source={{uri: url}}
          resizeMode="cover"
          onLoadEnd={handleAnimate}
        />
      )}
    </Small>
  );
}

LazyImage.propTypes = {
  url: PropTypes.string.isRequired,
  shouldLoad: PropTypes.bool.isRequired,
};
