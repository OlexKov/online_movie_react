import { CrownFilled, DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm,  Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../StafTable/StafTable.css'
import { getAllStaf } from '../../helpers/api_helpers/StafAPI';

export const StafTable = () => {
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: 'Фото',
            dataIndex: 'imageName',
            key: 'imageName',
            render: (text) => <img src={text} alt='Staf' />
        },
        {
            title: "Ім'я",
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name > b.name ? 1 : -1
        },
        {
            title: 'Прізвище',
            dataIndex: 'surname',
            key: 'surname',
            sorter: (a, b) => a.surname > b.surname ? 1 : -1
        },
        {
            title: "Дата народження",
            dataIndex: 'birthdate',
            key: 'birthdate',
            sorter: (a, b) => a.birthdate > b.birthdate ? 1 : -1
        },

        {
            title: "Країна",
            dataIndex: 'countryName',
            key: 'countryName',
            sorter: (a, b) => a.countryName > b.countryName ? 1 : -1
        },
        {
            title: "Оскар",
            dataIndex: 'isOscar',
            key: 'isOscar',
            sorter: (a, b) => a.isOscar ? 1 : b.isOscar ? -1 : 0,
            render: (isOcar) => isOcar ? <CrownFilled className='fs-3 text-warning' /> : <></>
        },

        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={()=>navigate(`/create-edit-staf/${record.id}`)} icon={<EditFilled />} />
                    <Popconfirm
                        title="Видалення актора"
                        description={`Ви впевненні що бажаєте видалити астора "${record.name} ${record.surname}" ?`}
                        onConfirm={() => deleteStaf(record)}
                        okText="Так"
                        cancelText="Ні"
                    >
                        <Button type="primary" danger icon={<DeleteFilled />} />
                    </Popconfirm>
                </Space>
            ),
        }
    ];
    const [stafs, setStafs] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            setStafs((await getAllStaf()).data);
        })();
    }, []);

    async function deleteStaf(staf) {
        return  await deleteStaf(staf.id)
            .then((response) => {
                if (response.status === 200) {
                    setStafs(stafs.filter(x => x.id !== staf.id));
                    message.success(`Актор "${staf.name} ${staf.surname}" успішно видалений `)
                }
            })
    }

    return (
        <>
           <Button className='add-button' type="primary" onClick={()=>navigate('/create-edit-staf/create')}  icon={<PlusOutlined />}>Додати актора</Button>
           <Table dataSource={stafs} rowKey="id" columns={columns} />
        </>
       
    )
}
