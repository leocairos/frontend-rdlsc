import React, { useCallback, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import MUIDataTable, { Responsive, SelectableRows } from 'mui-datatables';

import AddIcon from '@material-ui/icons/Add';
import {
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';

import PageContainer from '../../components/common/PageContainer';
import { apiXiloliteCQ } from '../../services/api';
import { useToast } from '../../hooks/toast';

interface IDataUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
}

const Users: React.FC = () => {
  const { addToast } = useToast();
  const [data, setData] = useState<IDataUser[]>([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterData, setFilterData] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortOrder, setSortOrder] = useState('updated_at desc');
  const rowsPerPage = 50;

  const getDataApi = useCallback(
    async (pageNum: number, pageSize: number, orderby?: string) => {
      let urlGet = `/users?page=${pageNum}&pageSize=${pageSize}`;
      urlGet += `&filters=${filterData}`;
      urlGet += `&orderby=${orderby || sortOrder}`;

      // console.log(urlGet);
      const response = await apiXiloliteCQ.get(urlGet);
      // console.log(response);
      return response.data;
    },
    [filterData, sortOrder],
  );

  const getNewData = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      const dataAPI = await getDataApi(pageNum, rowsPerPage);
      const dataLoaded = dataAPI.users;
      setCount(dataAPI.total);
      setPage(Number(dataAPI.page));
      setIsLoading(false);
      return dataLoaded;
    },
    [getDataApi, rowsPerPage],
  );

  const loadSamples = useCallback(
    async (defaultPage?: number): Promise<void> => {
      try {
        setIsLoading(true);
        const dataAPI = await getDataApi(defaultPage || 1, rowsPerPage);
        const dataLoaded = dataAPI.users;

        setData(dataLoaded);
        setCount(dataAPI.total);
        setPage(Number(dataAPI.page));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        addToast({
          type: 'error',
          title: 'Erro ao carregar registros',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast, getDataApi],
  );

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: false,
        sort: true,
        viewColumns: false,
        // infinite scrolling
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const value = data[dataIndex].id;

          if (rowIndex === data.length - 10) {
            return (
              <>
                <Waypoint
                  onEnter={async () => {
                    const newPage = Number(page) + 1;
                    const newData = await getNewData(newPage);
                    setData([...data, ...newData]);
                  }}
                />
                {value}
              </>
            );
          }
          return <>{value}</>;
        },
      },
    },
    {
      name: 'name',
      label: 'Nome',
      options: {
        filter: true,
        print: false,
      },
    },
    {
      name: 'email',
      label: 'e-mail',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'role',
      label: 'Acesso',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'avatar_ur',
      label: 'Avatar',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          console.log(data[dataIndex].name, data[dataIndex].avatar_url);

          return (
            <Avatar
              alt={data[dataIndex].name}
              src={data[dataIndex].avatar_url}
            />
          );
        },
      },
    },
  ];

  const options = {
    download: true,
    print: true,
    filter: true,
    search: false,
    fixedHeader: true,
    responsive: 'vertical' as Responsive,
    selectableRows: 'single' as SelectableRows,
    selectableRowsHideCheckboxes: true,

    pagination: false,
    tableBodyHeight: `${Math.trunc(Number(window.innerHeight * 0.7))}px`,

    customToolbar: () => {
      return (
        <>
          <Tooltip title="Incluir registro">
            <IconButton onClick={() => console.log('clicked +')}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    },
  };

  const titleTable = (
    <Typography variant="h5">
      Usuários{' '}
      {!isLoading && (
        <span style={{ fontSize: 15, position: 'relative', top: -2 }}>
          ({new Intl.NumberFormat().format(data.length)} de{' '}
          {new Intl.NumberFormat().format(count)} )
        </span>
      )}
      {isLoading && (
        <CircularProgress
          size={24}
          style={{ marginLeft: 15, position: 'relative', top: 4 }}
        />
      )}
    </Typography>
  );

  return (
    <PageContainer>
      <MUIDataTable
        title={titleTable}
        data={data}
        columns={columns}
        options={options}
      />
    </PageContainer>
  );
};

export default Users;
