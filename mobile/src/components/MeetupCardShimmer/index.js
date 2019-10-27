import React from 'react';

import {
  ShimmerList,
  Container,
  Banner,
  Meetup,
  Title,
  Info,
  Actions,
  Button,
  ButtonDown,
} from './styles';

export default function MeetupCardShimmer() {
  const data = [1, 2, 3, 4, 5];

  return (
    <ShimmerList
      data={data}
      keyExtractor={shimmer => String(shimmer)}
      renderItem={() => (
        <Container>
          <Banner />
          <Meetup>
            <Title autoRun />

            <Info autoRun />

            <Info autoRun />

            <Info autoRun />

            <Actions>
              <Button />
              <ButtonDown />
            </Actions>
          </Meetup>
        </Container>
      )}
    />
  );
}
