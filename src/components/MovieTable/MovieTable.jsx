import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Popconfirm, Rate, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import '../MovieTable/MovieTable.css'
const allMovieApi = 'http://localhost:5000/api/Movie/getall'
const getRatingApi = 'http://localhost:5000/api/Movie/getrating/'

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
                    <Button icon={<EditFilled />}/>
                    <Popconfirm
                        title="Видалення фільму"
                        description = {`Ви впевненні що бажаєте видалити фільм "${record.name}" ?`}
                        onConfirm={() => confirm(record.id)}
                        okText="Так"
                        cancelText="Ні"
                        onOpenChange={() => console.log('open change')}
                    >
                    <Button type="primary" danger icon={<DeleteFilled />}/>
                    </Popconfirm>
                </Space>
            ),
        }
      ];
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        (async () => {
            const result = await fetch(allMovieApi);
            const data = await result.json();
            setMovies( await setRating(data));
        })();
    }, []);

    const  confirm = ()=>
      new Promise((resolve) => {
        setTimeout(() => resolve(null), 3000);
      });
    

    async function setRating(data)
    {
        for (let index = 0; index < data.length; index++) {
          const res = await fetch(getRatingApi + data[index].id);
          data[index].rating = await res.json();
        }
        return data;
    }
    return (
        <Table dataSource={movies} rowKey="id"  columns={columns} />
    )
}

