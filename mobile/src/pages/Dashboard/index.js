import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Text} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addDays, subDays, format, parseISO} from 'date-fns';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Background from '../../components/Background';
import Header from '../../components/Header';
import DateContainer from '../../components/DateContainer';
import MeetupList from '../../components/MeetupList';
import Loading from './Loading';

import {Container} from './styles';

export default function Dashboard({navigation}) {
  const [meetups, setMeetups] = useState([]);
  const [date, setDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadPage = useCallback(
    async (pageNumber = page, shouldRefresh = false) => {
      if (!shouldRefresh && total && pageNumber > total) {
        return;
      }

      const response = await api.get('schedule', {
        params: {
          date,
          page,
        },
      });
      const data = response.data.availables.map(meetup => ({
        ...meetup,
        loading: false,
        formattedDate: format(parseISO(meetup.date), "MMMM dd 'at' hh a"),
      }));

      console.tron.log(data);

      setTotal(Math.ceil(response.data.count / 10));
      setMeetups(data);
    },
    [date, page, total],
  );

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);

      await loadPage(1, true);

      setLoading(false);
    }

    loadInitial();
  }, [date]); //eslint-disable-line

  function handleAddDate() {
    setPage(1);
    setDate(addDays(date, 1));
  }

  function handleSubDate() {
    setPage(1);
    setDate(subDays(date, 1));
  }

  async function handleEndReached() {
    setLoadingPage(true);
    setPage(page + 1);
    await loadPage();
    setLoadingPage(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPage();
    setRefreshing(false);
  }

  const pg = useMemo(() => page, [page]);

  async function handleSubscription(id) {
    try {
      setMeetups(meetups.map(m => (m.id !== id ? m : {...m, loading: true})));

      await api.post('subscriptions', {
        meetup_id: id,
      });

      showMessage({
        message: 'Sucess 👍',
        description: `You've been subscribed`,
        type: 'success',
        icon: 'info',
      });

      setMeetups(meetups.filter(m => m.id !== id));
    } catch (error) {
      setMeetups(meetups.map(m => (m.id !== id ? m : {...m, loading: false})));

      showMessage({
        message: 'Error on subscription',
        description: `Unable to subscribe to the meetup. (${error.response.data.error})`,
        type: 'danger',
        icon: 'info',
      });
    }
  }

  return (
    <Background>
      {loading ? (
        <Loading
          handleAddDate={handleAddDate}
          date={date}
          setDate={setDate}
          handleSubDate={handleSubDate}
        />
      ) : (
        <>
          <Header />

          <Container>
            <Text>{pg}</Text>
            <DateContainer
              handleAddDate={handleAddDate}
              date={date}
              setDate={setDate}
              handleSubDate={handleSubDate}
            />

            <MeetupList
              meetups={meetups}
              handleEndReached={handleEndReached}
              handleRefresh={handleRefresh}
              refreshing={refreshing}
              loadingPage={loadingPage}
              handleSubscription={handleSubscription}
              navigation={navigation}
              handleAddDate={handleAddDate}
              handleSubDate={handleSubDate}
            />
          </Container>
        </>
      )}
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarIcon: ({tintColor}) => (
    <Icon name="format-list-bulleted" size={30} color={tintColor} />
  ),
};

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
