import styled from 'styled-components/native';
import Button from '../../components/Button';

export const Container = styled.SafeAreaView`
  margin-top: 60px;
  align-items: center;
  flex: 1;
`;

export const Meetup = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px;
  align-self: flex-start;
`;

export const Description = styled.Text`
  color: #fff;
  font-size: 20px;
  line-height: 18px;
  margin: 0 0 20px;
`;

export const Info = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: rgba(153, 153, 153, 0.7);
  margin-left: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 30px;
`;
