import React, {useState, useMemo} from 'react';
import {DatePickerIOS} from 'react-native';
import {format} from 'date-fns';

import PropTypes from 'prop-types';

import {Container, DateButton, DateText, Picker} from './styles';

export default function DateInput({date, onChange}) {
  const [opened, setOpened] = useState(false);

  const dateFormatted = useMemo(() => format(date, 'MMMM dd'), [date]);

  return (
    <Container>
      <DateButton onPress={() => setOpened(!opened)}>
        <DateText>{dateFormatted}</DateText>
      </DateButton>

      {opened && (
        <Picker>
          <DatePickerIOS
            date={date}
            onDateChange={onChange}
            minimumDate={new Date()}
            minuteInterval={60}
            mode="date"
          />
        </Picker>
      )}
    </Container>
  );
}

DateInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
