import React, { createContext, useCallback, useState, useContext } from 'react';
import { formatedData } from '../pages/MylimsSamples/MylimsSamplesUtil';
import { apiXiloliteCQ } from '../services/api';
import { IDataSample as ISample } from '../pages/MylimsSamples/MylimsSampleTypes';

interface IMylimsState {
  samples: ISample[];
}

interface IMylimsContextData {
  samples: ISample[];
  loadInital(defaultPage?: number): Promise<void>;
  loadMore(pageNum: number): Promise<void>;
}

const MylimsContext = createContext<IMylimsContextData>(
  {} as IMylimsContextData,
);

const MylimsProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IMylimsState>({} as IMylimsState);

  const getDataApi = useCallback(async (pageNum: number, pageSize: number) => {
    const urlGet = `/samples/samplesHeader?page=${pageNum}&pageSize=${pageSize}`;

    const response = await apiXiloliteCQ.get(urlGet);
    return response.data;
  }, []);

  const loadMore = useCallback(
    async (pageNum: number) => {
      const dataAPI = await getDataApi(pageNum, 50);
      const dataLoaded = await formatedData(dataAPI.samples);
      setData({ samples: [...data.samples, ...dataLoaded] });
    },
    [data.samples, getDataApi],
  );

  const loadInital = useCallback(
    async (defaultPage?: number) => {
      const dataAPI = await getDataApi(defaultPage || 1, 50);
      const dataLoaded = await formatedData(dataAPI.samples);
      setData({ samples: dataLoaded });
    },
    [getDataApi],
  );

  return (
    <MylimsContext.Provider
      value={{ samples: data.samples, loadInital, loadMore }}
    >
      {children}
    </MylimsContext.Provider>
  );
};

function useMylims(): IMylimsContextData {
  const context = useContext(MylimsContext);

  if (!context) {
    throw new Error('Mylims must be used within an MylimsProvider');
  }

  return context;
}

export { MylimsProvider, useMylims };
