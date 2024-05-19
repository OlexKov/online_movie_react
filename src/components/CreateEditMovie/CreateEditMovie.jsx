import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Image, Upload, TimePicker, message, Transfer, Table, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, DeleteFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { dataService } from '../../services/DataService';
import { movieService } from '../../services/MovieService';
import { stafService } from '../../services/StafService';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import defImage from '../../images/nophoto.jpg'
import axios from 'axios';
import { dateFormat, dateTimeFormat, timeFormat } from '../../helpers/constants';
import { ComboBoxData } from '../../helpers/ComboBoxData';
import { dummyRequest } from '../../helpers/methods';
import useToken from 'antd/es/theme/useToken';
dayjs.extend(customParseFormat);



export const CreateEditMovie = () => {
    const id = useParams().id;
    const [countries, setCountries] = useState([]);
    const [stafs, setStafs] = useState([]);
    const [movieStafs, setMovieStafs] = useState([]);
    const [genres, setGenres] = useState([]);
    const [roles, setRoles] = useState([]);
    const [movie, setMovie] = useState([]);
    const [premiums, setPremiums] = useState([]);
    const [qualities, setQualities] = useState([]);
    const [previewPoster, setPreviewPoster] = useState('');
    const [posterFile, setPosterFile] = useState()
    const [screensFiles, setScreensFiles] = useState()
    const themeToken = useToken()[1]


    useEffect(() => {
        if (posterFile) {
            (async () => {
                if (!posterFile.url && !posterFile.preview) {
                    posterFile.preview = await getBase64(posterFile.originFileObj);
                }
                setPreviewPoster(posterFile.url || posterFile.preview);
            })()

        }
        else
            setPreviewPoster(null);
        form.setFieldsValue({
            posterFile: posterFile?.originFileObj
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posterFile])

    useEffect(() => {
        (async () => {
            await axios.all(
                [
                    dataService.getCountries(),
                    stafService.getAllStaf(),
                    dataService.getGenres(),
                    dataService.getPremiums(),
                    dataService.getQualities(),
                    dataService.getRoles()
                ])
                .then(axios.spread(async (...res) => {
                    setCountries(res[0].data?.map(item => new ComboBoxData(item.id, item.name)));
                    await stafService.setRoles(res[1].data);
                    setStafs(res[1].data);
                    setGenres(res[2].data?.map(item => new ComboBoxData(item.id, item.name)));
                    setPremiums(res[3].data?.map(item => new ComboBoxData(item.id, item.name)));
                    setQualities(res[4].data?.map(item => new ComboBoxData(item.id, item.name)));
                    setRoles(res[5].data);
                }));
            if (id !== 'create') {
                const movie = (await movieService.getMovie(id)).data
                if (movie) {
                    await axios.all(
                        [
                            movieService.getMovieGenres(id),
                            movieService.getMovieScreens(id),
                            movieService.getMovieStafs(id)
                        ])
                        .then(axios.spread(async (...res) => {
                            movie.genres = res[0].data;
                            movie.screenShots = res[1].data;
                            await stafService.setMovieRoles(res[2].data, movie.id);
                            const tempMovieStafs = res[2].data.map(x => ({ stafId: x.id, movieRoles: x.movieRoles.map(z => z.id) }));
                            movie.stafs = tempMovieStafs;
                            setMovieStafs(tempMovieStafs)
                            setTargetKeys(tempMovieStafs.map(x => x.stafId))
                        }));
                    setMovie(movie)
                    setFormValues(movie, form)
                }
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const setFormValues = (data, form) => {
        const scrns = data.screenShots?.map(x => { return { uid: x.id, name: x.name, status: 'done', url: x.name } })
        setScreensFiles(scrns)
        form.setFieldsValue({
            name: data.name,
            originalName: data.originalName,
            date: data.date ? dayjs(data.date, dateFormat) : null,
            duration: data.duration ? dayjs(data.duration, timeFormat) : null,
            qualityId: data.qualityId,
            countryId: data.countryId,
            genres: data.genres?.map(x => x.id),
            description: data.description,
            premiumId: data.premiumId,
            poster: data.poster,
            movieUrl: data.movieUrl,
            trailerUrl: data.trailerUrl,
            screens: scrns
        });
    }

    const [form] = Form.useForm();

    const onFinish = async () => {
        let newmovie = form.getFieldsValue();
        newmovie.id = movie.id || 0
        let formData = new FormData();

        const durationDate = dayjs(newmovie.date)
            .set('hour', newmovie.duration.get('hour'))
            .set('minute', newmovie.duration.get('minute'))
            .format(dateTimeFormat)
        console.log(durationDate)    
        formData.append('dateDuration', durationDate)
        movieStafs.map(x=>({stafId:x.stafId,movieRoles:x.movieRoles.length?[...x.movieRoles] : [x.movieRoles]}))
                  .forEach(x => formData.append('stafs', JSON.stringify(x)))
        Object.keys(newmovie).forEach(function (key) {
            if (key !== 'date' && key !== 'duration' && key!=='stafs') {
                if (key === 'genres')
                    newmovie[key].forEach(x => formData.append(key, x))
                else if (key === 'screens') {
                    const scrns = newmovie[key].fileList ? newmovie[key].fileList : newmovie[key]
                    scrns.forEach(x => {
                        if (x.originFileObj)
                            formData.append(key, x.originFileObj)
                        else
                            formData.append('screenShots', x.uid)
                    })
                }
                else
                   formData.append(key, newmovie[key]);
            }
        });
       
        if (newmovie.id === 0) {
            await movieService.createMovie(formData)
                .then(response => {
                    if (response.status === 200) {
                        message.success(`Фільм "${newmovie.name}" успішно додано до бази даних`);
                        window.history.back()
                    }
                })

        }
        else {
            formData.append('poster', movie.poster);
            await movieService.updateMovie(formData)
                .then(response => {
                    if (response.status === 200) {
                        message.success(`Інформація про фільм "${newmovie.name}" успішно змінена`);
                        window.history.back()
                    }
                }).catch(error => { console.log(error) });
        }

    }

    const onReset = () => {
        setFormValues(movie, form);
        setPosterFile(null);
        setMovieStafs(movie.stafs)
        setTargetKeys(movie.stafs.map(x => x.id))
    }

    const handleChange = async ({ file: newFile }) => {
        if (newFile.status === 'removed')
            newFile = null
        setPosterFile(newFile);
    };

    const handleChangeScreens = async ({ fileList: newFileList }) => {
        setScreensFiles(newFileList);
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <button style={{ border: 0, background: 'none', color: themeToken.colorText }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Завантажити</div>
        </button>
    );

    //---------------------------------------------------------------------------------------------------------
    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
        <Transfer {...restProps}>
            {({
                direction,
                filteredItems,
                onItemSelect,
                onItemSelectAll,
                selectedKeys: listSelectedKeys,

            }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;
                const rowSelection = {

                    onChange(selectedRowKeys) {
                        onItemSelectAll(selectedRowKeys, 'replace');
                    },
                    selectedRowKeys: listSelectedKeys,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                };
                return (
                    <Table
                        pagination={pagination}
                        rowSelection={direction === 'left' && rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"

                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || direction !== 'left') {
                                    return;
                                }
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );


    const leftColumns = [
        {
            title: 'Фото',
            dataIndex: 'imageName',
            key: 'imageName',
            render: (text) => <Popover placement="right" content={<img style={{ width: 120 }} src={text} alt='Staf' />}><img style={{ width: 30 }} src={text} alt='Staf' /></Popover>,
            filters:roles.map(x=>({text:x.name,value:x.id})),
            onFilter: (value, record) => record.roles.some(x=>x.id===value),
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

    ];
    const rightColumns = [
        {
            title: 'Фото',
            dataIndex: 'imageName',
            render: (text) => <Popover placement="right" content={<img style={{ width: 120 }} src={text} alt='Staf' />}><img style={{ width: 30 }} src={text} alt='Staf' /></Popover>,
            width: '15%',
            filters:roles.map(x=>({text:x.name,value:x.id})),
            onFilter: (value, record) => record.roles.some(x=>x.id===value),
            align:'center'
        },
        {
            title: "Ім'я",
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name ? 1 : -1,
            render: (_, record) => (<span>{record.name} {record.surname}</span>),
            width: '20%'
        },

        {
            title: 'Ролі',
            dataIndex: 'roles',
            render: (data, record) => <Select
                placeholder="Оберіть ролі"
                mode="multiple"
                maxTagCount={'responsive'}
                defaultValue={movieStafs.find(x => x.stafId === record.id)?.movieRoles || stafs.find(x => x.id === record.id).roles[0].id}
                options={data?.map(item => new ComboBoxData(item.id, item.name))}
                onChange={(e) => onSelectedChange(e, record.id)}
                
            />
        },
        {
            key: 'action',
            render: (_, record) => <Button onClick={() => deleteSelectedStaf(record.id)} type="primary" danger icon={<DeleteFilled />} />,
            width: '10%'
        },
    ];
    const [targetKeys, setTargetKeys] = useState([]);
    const onChange = (nextTargetKeys) => {
        const stafsId = nextTargetKeys.filter(x=>!movieStafs.map(z=>z.stafId).includes(x))
        if(stafsId){
            const newStafs = stafsId.map((id)=>{
                const defaultRoleId = stafs.find(x => x.id === id)?.roles[0].id;
                return {stafId:id,movieRoles:defaultRoleId}
            })
            setMovieStafs(movieStafs=>[...movieStafs,...newStafs])
        }
        setTargetKeys(nextTargetKeys);
    };

    const deleteSelectedStaf = (id) => {
        setTargetKeys(targetKeys.filter(x => x !== id))
        setMovieStafs(movieStafs.filter(x => x.stafId !== id))
    }

    const onSelectedChange = (e, stafId) => {
       const stafIndex = movieStafs.indexOf(movieStafs.find(x=>x.stafId === stafId))
       const tempMovieStafs = [...movieStafs];
       tempMovieStafs[stafIndex].movieRoles = e.length > 0 ? e : stafs.find(x => x.id === stafId).roles[0].id;
       setMovieStafs(tempMovieStafs)
    }

    const pagination = {
        defaultPageSize: 5,
        defaultCurrent: 1
    }
    //---------------------------------------------------------------------------------------------------------
    return (
        <>
            <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />

            <div className='w-75 mx-auto'>
                <Divider className='fs-3  mb-5' orientation="left">{id === 'create' ? 'Новий фільм' : 'Редагування'}</Divider>
                <Form layout='vertical' form={form} name="control-hooks" onFinish={onFinish}
                    className='mx-auto d-flex flex-column gap-2'>
                    <div className="d-flex gap-5">
                        <Form.Item name="posterFile" label="Постер" >
                            <div style={{ width: 290 }}>
                                <Image
                                    style={{ objectFit: 'cover' }}
                                    width={290}
                                    height={430}
                                    fallback={movie.poster || defImage}
                                    src={previewPoster}
                                    preview={false}
                                    className=' rounded-3'
                                />
                                <Upload
                                    listType="text"
                                    onChange={handleChange}
                                    customRequest={dummyRequest}
                                    maxCount={1}
                                >
                                    <Button style={{ width: 290, marginTop: 25 }} type="primary" icon={<UploadOutlined />}>
                                        Завантажити постер
                                    </Button>
                                </Upload>
                            </div>
                        </Form.Item>
                        <div className='form-grid w-100'>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item name="name" label="Назва"
                                        hasFeedback
                                        rules={[
                                            {
                                                pattern: '^[A-Z А-Я].*',
                                                message: "Назва фільму повинна починатися з великої букви"
                                            },
                                            {
                                                required: true,
                                                message: "Введіть назву фільму"
                                            },
                                        ]}
                                    >
                                        <Input showCount minLength={3} maxLength={100} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="originalName" label="Оригінальна назва"
                                        hasFeedback
                                        rules={[
                                            {
                                                pattern: '^[A-Z А-Я].*',
                                                message: "Оригінальна назва фільму повинна починатися з великої букви"
                                            },
                                            {
                                                required: true,
                                                message: 'Введіть оригінальну назву фільму'
                                            },
                                        ]}
                                    >
                                        <Input showCount minLength={3} maxLength={100} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={12}>
                                    <Form.Item
                                        hasFeedback
                                        name="date"
                                        label="Дата прем'єри"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Оберіть дату прем'єри"
                                            },
                                        ]}
                                    >
                                        <DatePicker className='w-100' disabledDate={d => !d || d.isAfter(new Date(Date.now()))} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        hasFeedback
                                        name="countryId"
                                        label="Країна"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Оберіть країну'
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Оберіть країну"
                                            allowClear
                                            options={countries}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>


                            <Row gutter={15}>
                                <Col span={8}>
                                    <Form.Item
                                        hasFeedback
                                        name="duration"
                                        label="Тривалість"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Оберіть тривалість"
                                            },
                                        ]}
                                    >
                                        <TimePicker className='w-100' />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        hasFeedback
                                        name="qualityId"
                                        label="Якість"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Оберіть якість відео'
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Оберіть якість відео"
                                            allowClear
                                            options={qualities}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        hasFeedback
                                        name="premiumId"
                                        label="Преміум"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Оберіть преміум аккаунт для перегляду відео'
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Оберіть преміум аккаунт"
                                            allowClear
                                            options={premiums}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>


                            <Row gutter={15}>
                                <Col span={24}>
                                    <Form.Item
                                        hasFeedback
                                        name="genres"
                                        label="Жанри"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Оберіть жанри'
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Оберіть жанри фільму"
                                            allowClear
                                            mode="multiple"
                                            maxTagCount={'responsive'}
                                            options={genres}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item name="movieUrl" label="Посилання на відео"
                                        hasFeedback
                                        rules={[
                                            {
                                                url: true,
                                                message: "Не вірний url відео"
                                            },
                                            {
                                                required: true,
                                                message: "Введіть url відео"
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item name="trailerUrl" label="Посилання на трейлер"
                                        hasFeedback
                                        rules={[
                                            {
                                                url: true,
                                                message: "Не вірний url трейлера"
                                            },
                                            {
                                                required: true,
                                                message: 'Введіть url трейлера'
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                hasFeedback
                                label="Актори"
                                name="stafs"
                                rules={[
                                    () => ({
                                        validator() {
                                            if (targetKeys.length !== 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Оберіть як мінімум одиного актора'));
                                        },
                                    })
                                ]}
                            >
                                <TableTransfer
                                    dataSource={stafs}
                                    targetKeys={targetKeys}
                                    showSearch
                                    onChange={onChange}
                                    oneWay
                                    rowKey={(record) => record.id}
                                    filterOption={(inputValue, item) =>
                                        item.name.indexOf(inputValue) !== -1 || item.surname.indexOf(inputValue) !== -1
                                    }
                                    leftColumns={leftColumns}
                                    rightColumns={rightColumns}
                                    selectAllLabels={[
                                        ({ selectedCount, totalCount }) => (
                                          <div className='d-flex gap-3'>
                                           <span> {selectedCount} із {totalCount}</span>
                                            <span>Всі</span>
                                          </div>
                                        ), ({ selectedCount, totalCount }) => (
                                            <div className='d-flex gap-3'>
                                            <span>{totalCount}</span>
                                             <span>Приймали участь у фільмі</span>
                                           </div>
                                        )
                                      ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                hasFeedback
                                name="description"
                                label="Інформація"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введіть інформацію про фільм'
                                    },
                                    {
                                        min: 20,
                                        message: 'Опис має містити не менше 20 символів'
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Коротка інформація про фільм"
                                    rows={7}
                                    showCount
                                    maxLength={3000}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={24}>
                            <Form.Item
                                hasFeedback
                                name="screens"
                                label="Скріншоти фільму "
                                rules={[
                                    () => ({
                                        validator() {
                                            if (screensFiles.length !== 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Завантажте як мінімум один скріншот'));
                                        },
                                    })
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={screensFiles}
                                    maxCount={15}
                                    onChange={handleChangeScreens}
                                    multiple={true}
                                    beforeUpload={() => false}
                                >
                                    {screensFiles?.length >= 15 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className=' align-self-end'>
                        <Space>
                            <Button style={{ width: 200 }} type="primary" htmlType="submit">
                                Зберегти
                            </Button>
                            <Button style={{ width: 200 }} htmlType="button" onClick={onReset}>
                                Відмінити зміни
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}
