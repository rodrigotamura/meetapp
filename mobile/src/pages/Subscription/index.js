import React, {useEffect, useState, useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showMessage} from 'react-native-flash-message';
import {parseISO, format} from 'date-fns';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Background from '../../components/Background';
import Header from '../../components/Header';
import MeetupCardShimmer from '../../components/MeetupCardShimmer';
import Empty from '../../components/Empty';
import MeetupCard from '../../components/MeetupCard';

import {Container, MeetupList} from './styles';

export default function Subscription({navigation}) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  useEffect(() => {
    async function loadSubs() {
      setLoading(true);
      const response = await api.get('subscriptions');

      const data = response.data.map(sub => ({
        ...sub,
        meetup: {
          loading: false,
          ...sub.meetup,
          formattedDate: format(parseISO(sub.meetup.date), "MMMM dd 'at' hh a"),
        },
      }));

      console.tron.log(data);

      setSubs(data);
      setLoading(false);
    }

    loadSubs();
  }, []);

  async function handleCancel(id) {
    try {
      setSubs(
        subs.map(s =>
          s.id !== id ? s : {...s, meetup: {...s.meetup, loading: true}},
        ),
      );

      await api.delete(`subscriptions/${id}`);

      setSubs(subs.filter(sub => sub.id !== id));
    } catch (error) {
      setSubs(
        subs.map(s =>
          s.id !== id ? s : {...s, meetup: {...s.meetup, loading: false}},
        ),
      );
      showMessage({
        message: 'Error on unsubscription',
        description: 'You are not able to cancel this subscription',
        type: 'danger',
        icon: 'info',
      });
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    const response = await api.get('subscriptions');

    const data = response.data.map(sub => ({
      ...sub,
      meetup: {
        loading: false,
        ...sub.meetup,
        formattedDate: format(parseISO(sub.meetup.date), "MMMM dd 'at' hh a"),
      },
    }));

    setRefreshing(false);
    setSubs(data);
  }

  const handleViewableChanged = useCallback(({viewableItems}) => {
    setViewable(viewableItems.map(({item}) => item.id));
  }, []);

  if (loading) {
    return (
      <Background>
        <Header />
        <MeetupCardShimmer />
      </Background>
    );
  }

  return (
    <Background>
      <Header />

      <Container>
        <MeetupList
          data={subs}
          keyExtractor={sub => String(sub.id)}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onViewableItemsChanged={handleViewableChanged}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 10}}
          renderItem={({item}) => (
            <MeetupCard
              mainButton="CANCEL"
              onPress={() => handleCancel(item.id)}
              meetup={item.meetup}
              shouldLoad={viewable.includes(item.id)}
              navigation={navigation}
              subId={item.id}
            />
          )}
          ListEmptyComponent={
            <Empty>There is no subscriptions to futures meetups</Empty>
          }
        />
      </Container>
    </Background>
  );
}

Subscription.navigationOptions = {
  tabBarIcon: ({tintColor}) => (
    <Icon name="beenhere" size={30} color={tintColor} />
  ),
};

Subscription.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
