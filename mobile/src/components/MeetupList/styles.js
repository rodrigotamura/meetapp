import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
`;

export const Container = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})`
  margin-top: 15px;
`;
