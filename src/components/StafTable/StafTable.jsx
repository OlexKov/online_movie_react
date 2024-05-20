import { CrownFilled, DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../StafTable/StafTable.css'
import { stafService } from '../../services/StafService';
import { paginatorConfig } from '../../helpers/constants';

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
            render: (text) => <Popover placement="right" content={<img style={{width:120}} src={text} alt='Staf' />}><img src={text} alt='Staf' /></Popover>,
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
   
    const [tableParams, setTableParams] = useState(paginatorConfig);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {await setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent) })();
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
        if(total!==0 && stafs.length === 0 )
            (async () => { await setData(paginatorConfig.pagination.defaultPageSize,paginatorConfig.pagination.defaultCurrent) })();
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
        setLoading(false)
        if (result?.elements){
            setStafs(result.elements);
            setTotal(result.totalCount)
        }
    }

    const handleTableChange = async (pagination) => {
        await setData(pagination.pageSize, pagination.current)
    };

    return (
        <>
            <Button className='free-button' type="primary" onClick={() => navigate('/create-edit-staf/create')} icon={<PlusOutlined />}>Додати актора</Button>
            <Table
                pagination={tableParams.pagination}
                dataSource={stafs}
                rowKey={(record) => record.id}
                columns={columns}
                loading={loading}
                onChange={handleTableChange}/>

        </>

    )
}
