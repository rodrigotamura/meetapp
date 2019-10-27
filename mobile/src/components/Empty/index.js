import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Container, Message} from './styles';

export default function Empty({children}) {
  return (
    <Container>
      <Icon name="event-busy" size={50} color="rgba(153, 153, 153, 0.7)" />
      <Message>{children}</Message>
    </Container>
  );
}

Empty.propTypes = {
  children: PropTypes.string.isRequired,
};
