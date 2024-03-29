import React from 'react';
import { useTransition } from 'react-spring';

import { IToastMessage } from '../../hooks/toast';
import Toast from './Toast';

import { Container } from './styles';

interface IToastContainerProps {
  messages: IToastMessage[];
}

const ToastContainer: React.FC<IToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { left: '-120%', opacity: 0 },
      enter: { left: '0%', opacity: 1 },
      leave: { left: '-120%', opacity: 0 },
    },
  );
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};

export default ToastContainer;
