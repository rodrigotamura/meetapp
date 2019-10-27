import styled from 'styled-components/native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export const ShimmerList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})``;

export const Container = styled.View`
  background: #fff;
  border-radius: 4px;
  margin: 15px 0;
`;

export const Banner = styled(ShimmerPlaceHolder)`
  height: 150px;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const Meetup = styled.View`
  padding: 20px;
`;

export const Title = styled(ShimmerPlaceHolder)`
  height: 20px;
  width: 65%;
  margin-bottom: 10px;
`;

export const Info = styled(ShimmerPlaceHolder)`
  width: 50%;
  margin: 5px 0;
`;

export const Actions = styled.View`
  flex-direction: column;
  margin-top: 20px;
`;

export const Button = styled(ShimmerPlaceHolder)`
  height: 46px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const ButtonDown = styled(ShimmerPlaceHolder)`
  height: 46px;
  width: 100%;
  border-radius: 4px;
`;
