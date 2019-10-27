import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import DateInput from '../DateInput';

import {Container} from './styles';

export default function DateContainer({
  handleSubDate,
  date,
  setDate,
  handleAddDate,
}) {
  return (
    <Container>
      <TouchableOpacity onPress={handleSubDate}>
        <Icon name="chevron-left" size={30} color="#fff" />
      </TouchableOpacity>

      <DateInput date={date} onChange={setDate} />

      <TouchableOpacity onPress={handleAddDate}>
        <Icon name="keyboard-arrow-right" size={30} color="#fff" />
      </TouchableOpacity>
    </Container>
  );
}

DateContainer.propTypes = {
  handleSubDate: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  setDate: PropTypes.func.isRequired,
  handleAddDate: PropTypes.func.isRequired,
};
