import styled from 'styled-components/native';
import Button from '../Button';

export const Container = styled.View`
  background: #fff;
  border-radius: 4px;
  margin: 0px 0 15px;
`;

export const Image = styled.ImageBackground`
  background: #000;
  width: '100%';
  height: '100%';
`;

export const Meetup = styled.View`
  padding: 20px;
`;

export const Title = styled.Text`
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const InfoCard = styled.View`
  margin-left: 4px;
`;

export const Info = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: rgba(153, 153, 153, 0.7);
  margin: 4px 0 4px 4px;
`;

export const Actions = styled.View`
  flex-direction: column;
  margin-top: 20px;
`;

export const DetailsButton = styled(Button)`
  background: #4dbaf9;
  margin-bottom: 10px;
`;

export const SubButton = styled(Button)``;
