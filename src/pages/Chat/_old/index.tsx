import React from 'react';

import ChatBot from 'react-simple-chatbot';
import PageContainer from '../../../components/common/PageContainer';

const Chat: React.FC = () => {
  return (
    <PageContainer>
      Chat
      <ChatBot
        headerTitle="Speech Synthesis"
        recognitionEnable
        speechSynthesis={{ enable: true, lang: 'pt-br' }}
        steps={[
          {
            id: '1',
            message: 'Qual o seu nome?',
            trigger: '2',
          },
          {
            id: '2',
            user: true,
            trigger: '3',
          },
          {
            id: '3',
            message: 'Olá {previousValue}, prazer em conhecê-lo!',
          },
        ]}
      />
    </PageContainer>
  );
};

export default Chat;
