import { CrownFilled, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Popconfirm, Rate, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import '../StafTable/StafTable.css'
const allStafsApi = 'http://localhost:5000/api/Staf/getall'
const deleteApi = 'http://localhost:5000/api/Staf/delete/'


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
                    <Button icon={<EditFilled />} />
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
    useEffect(() => {
        (async () => {
            const result = await fetch(allStafsApi);
            const data = await result.json();
            setStafs(data);
        })();
    }, []);

    async function deleteStaf(staf) {
        return await fetch(deleteApi + staf.id, { method: 'DELETE' })
            .then((response) => {
                if (response.ok) {
                    setStafs(stafs.filter(x => x.id !== staf.id));
                    message.success(`Актор "${staf.name} ${staf.surname}" успішно видалений `)
                }
                else
                    message.error(`${response.status} ${response.statusText}`)
            })
    }


    return (
        <Table dataSource={stafs} rowKey="id" columns={columns} />
    )
}
