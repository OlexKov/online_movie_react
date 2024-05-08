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
    const [tableParams, setTableParams] = useState({
        pagination: {
            defaultPageSize: 5,
            defaultCurrent: 1,
            pageSizeOptions: [5, 10, 15, 20],
            showSizeChanger: true
        },
    });
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {await setData(tableParams.pagination?.defaultPageSize, tableParams.pagination?.defaultCurrent) })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => { await setData(tableParams.pagination?.pageSize, tableParams.pagination?.current) })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    async function stafDelete(staf) {
        return await stafService.deleteStaf(staf.id)
            .then((response) => {

                if (response.status === 200) {
                    setStafs(stafs.filter(x => x.id !== staf.id));
                    message.success(`Актор "${staf.name} ${staf.surname}" успішно видалений `)
                }
            })
    }

    const setData = async (pageSize, pageIndex) => {
        setLoading(true)
        const result = (await stafService.getStafsWithPagination(pageSize, pageIndex)).data;
        console.log(pageSize, pageIndex)
        console.log(result)
        if (result.stafs)
            setStafs(result.stafs);
        setLoading(false)
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: result.totalCount,
                showTotal: (total) => <span className=' fw-bold'>Кількість:  <span className=' fw-light'>{total}</span></span>
            },
        });
    }


    const handleTableChange = async (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
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
