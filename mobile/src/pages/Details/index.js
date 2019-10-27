import React, {useEffect, useState} from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {parseISO, format} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showMessage} from 'react-native-flash-message';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Background from '../../components/Background';
import LazyImage from '../../components/LazyImage';

import {
  Container,
  Meetup,
  Description,
  Info,
  Text,
  SubmitButton,
} from './styles';

let back = 'Dashboard';

export default function Details({navigation}) {
  const id = navigation.getParam('id');
  const mainButton = navigation.getParam('mainButton');
  const subId = navigation.getParam('subId');

  back = mainButton === 'CANCEL' ? 'Subscription' : 'Dashboard';

  const [meetup, setMeetup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetup() {
      const response = await api.get(`meetups/${id}`);

      const {meetup: info, amount} = response.data;

      console.tron.log(info);

      const data = {
        ...info,
        formattedDate: format(parseISO(info.date), "dd MMMM yyyy 'at' hh a"),
        amount,
      };

      setMeetup(data);
      setLoading(false);
    }

    loadMeetup();
  }, [id, subId]);

  async function handleSubmit() {
    if (mainButton === 'CANCEL') {
      await api.delete(`subscriptions/${subId}`);
    } else {
      try {
        await api.post('subscriptions', {
          meetup_id: id,
        });
        showMessage({
          message: 'Sucess 👍',
          description: `You've been subscribed`,
          type: 'success',
          icon: 'info',
        });
        navigation.navigate(back);
      } catch (error) {
        showMessage({
          message: 'Error on subscription',
          description: `${error.response.data.error}`,
          type: 'danger',
          icon: 'info',
        });
      }
    }
  }

  if (loading) {
    return (
      <Background>
        <Container>
          <ActivityIndicator color="rgba(255,255,255,0.7)" size="small" />
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <Container>
        <LazyImage url={meetup.banner.url} shouldLoad />

        <Meetup>
          <Description>{meetup.desc}</Description>

          <Info>
            <Icon name="event" size={18} color="rgba(153, 153, 153, 0.7)" />
            <Text>{meetup.formattedDate}</Text>
          </Info>

          <Info>
            <Icon name="place" size={18} color="rgba(153, 153, 153, 0.7)" />
            <Text>{meetup.localization}</Text>
          </Info>

          <Info>
            <Icon name="person" size={18} color="rgba(153, 153, 153, 0.7)" />
            <Text>{meetup.organizer.name}</Text>
          </Info>

          <Info>
            {meetup.amount > 0 && (
              <>
                <Icon
                  name="event-seat"
                  size={18}
                  color="rgba(153, 153, 153, 0.7)"
                />
                <Text>{meetup.amount} users subscribed</Text>
              </>
            )}
          </Info>

          <SubmitButton onPress={handleSubmit}>{mainButton}</SubmitButton>
        </Meetup>
      </Container>
    </Background>
  );
}

Details.navigationOptions = ({navigation}) => ({
  headerTitle: navigation.getParam('title'),
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate(back)}>
      <Icon name="chevron-left" size={30} color="#fff" />
    </TouchableOpacity>
  ),
});

Details.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  }).isRequired,
};
