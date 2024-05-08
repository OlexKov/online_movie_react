import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Rate, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../MovieTable/MovieTable.css'
import { movieService } from '../../services/MovieService';
import { setRating } from '../../helpers/methods';

export const MovieTable = () => {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Постер',
      dataIndex: 'poster',
      key: 'poster',
      render: (text) => <img src={text} alt='Movie poster' />
    },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      title: 'Оригінальна назва',
      dataIndex: 'originalName',
      key: 'originalName',
      sorter: (a, b) => a.originalName > b.originalName ? 1 : -1
    },
    {
      title: "Дата прем'єри",
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date > b.date ? 1 : -1
    },
    {
      title: "Тривалість",
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.duration > b.duration ? 1 : -1
    },
    {
      title: "Країна",
      dataIndex: 'countryName',
      key: 'countryName',
      sorter: (a, b) => a.countryName > b.countryName ? 1 : -1
    },
    {
      title: "Рейтинг",
      dataIndex: 'rating',
      key: 'rating',
      render: (text) => <Rate disabled allowHalf count={6} defaultValue={text} />,
      sorter: (a, b) => a.rating - b.rating
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/create-edit-movie/${record.id}`)} icon={<EditFilled />} />
          <Popconfirm
            title="Видалення фільму"
            description={`Ви впевненні що бажаєте видалити фільм "${record.name}" ?`}
            onConfirm={() => movieDelete(record)}
            okText="Так"
            cancelText="Ні"
          >
            <Button type="primary" danger icon={<DeleteFilled />} />
          </Popconfirm>
        </Space>
      ),
    }
  ];
  const [movies, setMovies] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      defaultPageSize:2,
      defaultCurrent:1,
      pageSizeOptions:[2,5,10,15,20],
      showSizeChanger: true
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => { await setData(tableParams.pagination?.defaultPageSize,tableParams.pagination?.defaultCurrent) })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => { await setData(tableParams.pagination?.pageSize,tableParams.pagination?.current) })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  async function movieDelete(movie) {
    return await movieService.deleteMovie(movie.id)
      .then((response) => {
        if (response.status === 200) {
          setMovies(movies.filter(x => x.id !== movie.id));
          message.success(`Фільм "${movie.name}" успішно видалено `)
        }
      })
  }
  const handleTableChange = async (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const setData = async (pageSize,pageIndex) => {
    setLoading(true)
    const result = (await movieService.getMoviesWithPagination(pageSize,pageIndex)).data;
    if (result.movies)
      setMovies(await setRating(result.movies));
    setLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: result.totalCount,
        showTotal:(total) => <span className=' fw-bold'>Кількість: <span className=' fw-light'>{total}</span></span>
      },
    });
  }

  return (
    <>
      <Button className='add-button' type="primary" onClick={() => navigate('/create-edit-movie/create')} icon={<PlusOutlined />}>Додати фільм</Button>
      <Table
        pagination={tableParams.pagination}
        dataSource={movies}
        rowKey={(record) => record.id}
        columns={columns}
        loading={loading}
        onChange={handleTableChange} 
        />
    </>

  )
}

