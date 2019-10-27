import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const MeetupList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})``;
