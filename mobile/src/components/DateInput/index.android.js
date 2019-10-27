import React, {useMemo} from 'react';
import {DatePickerAndroid} from 'react-native';
import {format} from 'date-fns';

import PropTypes from 'prop-types';

import {Container, DateButton, DateText} from './styles';

export default function DateInput({date, onChange}) {
  const dateFormatted = useMemo(() => format(date, 'MMMM dd'), [date]);

  async function handleOpenPicker() {
    const {action, year, month, day} = await DatePickerAndroid.open({
      mode: 'spinner',
      date,
      minDate: new Date(),
    });

    if (action === DatePickerAndroid.dateSetAction) {
      const selectDate = new Date(year, month, day);

      onChange(selectDate);
    }
  }

  return (
    <Container>
      <DateButton onPress={handleOpenPicker}>
        <DateText>{dateFormatted}</DateText>
      </DateButton>
    </Container>
  );
}

DateInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
