import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Rate, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../MovieTable/MovieTable.css'
import axios from 'axios';
import { getAllMovie } from '../../helpers/api_helpers/MovieAPI';


const getRatingApi = 'http://localhost:5000/api/Movie/getrating/'
const deleteApi = 'http://localhost:5000/api/Movie/delete/'

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
          <Button onClick={()=>navigate(`/create-edit/${record.id}`)}  icon={<EditFilled />} />
          <Popconfirm
            title="Видалення фільму"
            description={`Ви впевненні що бажаєте видалити фільм "${record.name}" ?`}
            onConfirm={() => deleteMovie(record)}
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
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const result = await getAllMovie();
      setMovies(await setRating(result));
    })();
  }, []);

  async function deleteMovie(movie) {
    return await axios.delete (deleteApi + movie.id)
      .catch((response) => {
        if (response.status === 200) {
          setMovies(movies.filter(x => x.id !== movie.id));
          message.success(`Фільм "${movie.name}" успішно видалено `)
        }
        else
          message.error(`${response.status} ${response.error}` )
        
      })
  }

  async function setRating(data) {
    for (let index = 0; index < data.length; index++) {
      const res = await fetch(getRatingApi + data[index].id);
      data[index].rating = await res.json();
    }
    return data;
  }
  return (
    <>
      <Button className='add-button' type="primary" onClick={()=>navigate('/create-edit/create')} icon={<PlusOutlined />}>Додати фільм</Button>
      <Table dataSource={movies} rowKey="id" columns={columns} />
    </>
   
  )
}

