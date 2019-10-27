import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import LazyImage from '../LazyImage';

import {
  Container,
  Meetup,
  Title,
  InfoCard,
  Info,
  Text,
  Actions,
  DetailsButton,
  SubButton,
} from './styles';

export default function MeetupCard({
  navigation,
  mainButton,
  meetup,
  onPress,
  subId,
  shouldLoad,
}) {
  return (
    <Container>
      <LazyImage url={meetup.banner.url} shouldLoad={shouldLoad} />
      <Meetup>
        <Title>{meetup.title}</Title>
        <InfoCard>
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
        </InfoCard>

        <Actions>
          <DetailsButton
            onPress={() => {
              navigation.navigate('Details', {
                id: meetup.id,
                onPress,
                mainButton,
                title: meetup.title,
                subId,
              });
            }}>
            DETAILS
          </DetailsButton>
          <SubButton loading={meetup.loading} onPress={onPress}>
            {mainButton}
          </SubButton>
        </Actions>
      </Meetup>
    </Container>
  );
}

MeetupCard.propTypes = {
  mainButton: PropTypes.string.isRequired,
  meetup: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    localization: PropTypes.string,
    formattedDate: PropTypes.string,
    organizer: PropTypes.object,
    banner: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
  subId: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  shouldLoad: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

MeetupCard.defaultProps = {
  subId: null,
};
