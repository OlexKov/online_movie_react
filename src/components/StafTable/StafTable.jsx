import { CrownFilled, DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../StafTable/StafTable.css'
import { stafService } from '../../services/StafService';


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
            sorter: (a, b) => a.birthdate > b.birthdate ? 1 : -1,
            render: (text) => new Date(text).toLocaleDateString()

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
                    <Button onClick={() => navigate(`/create-edit-staf/${record.id}`)} icon={<EditFilled />} />
                    <Popconfirm
                        title="Видалення актора"
                        description={`Ви впевненні що бажаєте видалити астора "${record.name} ${record.surname}" ?`}
                        onConfirm={async () => await stafDelete(record)}
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
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const startPage = 1;
    const startPageSize = 5;
    const [tableParams, setTableParams] = useState({
        pagination: {
            defaultPageSize: startPageSize,
            defaultCurrent: startPage,
            pageSizeOptions: [5, 10, 15, 20],
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]} - ${range[1]}  з  ${total} `
        },
    });
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {await setData(startPageSize, startPage) })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: total,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    async function stafDelete(staf) {
        return await stafService.deleteStaf(staf.id)
            .then((response) => {

                if (response.status === 200) {
                    setStafs(stafs.filter(x => x.id !== staf.id));
                    message.success(`Актор "${staf.name} ${staf.surname}" успішно видалений `)
                    setTotal(total-1)
                }
            })
    }

    const setData = async (pageSize, pageIndex) => {
        setLoading(true)
        const result = (await stafService.getStafsWithPagination(pageSize, pageIndex)).data;
        if (result.stafs)
            setStafs(result.stafs);
        setLoading(false)
        setTotal(result.totalCount)
    }

    const handleTableChange = async (pagination) => {
        await setData(pagination.pageSize, pagination.current)
    };

    return (
        <>
            <Button className='add-button' type="primary" onClick={() => navigate('/create-edit-staf/create')} icon={<PlusOutlined />}>Додати актора</Button>
            <Table
                pagination={tableParams.pagination}
                dataSource={stafs}
                rowKey={(record) => record.id}
                columns={columns}
                loading={loading}
                onChange={handleTableChange} />

        </>

    )
}
