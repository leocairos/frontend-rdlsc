import React from 'react';

import PageContainer from '../../components/common/PageContainer';

const Home: React.FC = () => {
  return (
    <PageContainer>
      Home
      <div
        style={{
          right: 10,
          border: 0,
          height: 500,
          width: 350,
          bottom: -30,
          position: 'fixed',
          overflow: 'hidden',
        }}
      >
        <iframe
          width="350"
          height="430"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/3b7c0131-7c7d-4c80-a30d-d85b5186f9c7"
        />
      </div>
    </PageContainer>
  );
};

export default Home;
