import React from 'react';
import PropTypes from 'prop-types';

import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MeetupCardShimmer from '../../../components/MeetupCardShimmer';
import DateContainer from '../../../components/DateContainer';

import {Container} from '../styles';

export default function Loading({handleSubDate, date, setDate, handleAddDate}) {
  return (
    <Background>
      <Header />

      <Container>
        <DateContainer
          handleAddDate={handleAddDate}
          date={date}
          setDate={setDate}
          handleSubDate={handleSubDate}
        />

        <MeetupCardShimmer />
      </Container>
    </Background>
  );
}

Loading.propTypes = {
  handleSubDate: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  setDate: PropTypes.func.isRequired,
  handleAddDate: PropTypes.func.isRequired,
};
