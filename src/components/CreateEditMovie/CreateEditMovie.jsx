import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Image, Upload, TimePicker, message } from 'antd';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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
    const [genres, setGenres] = useState([]);
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
                    dataService.getQualities()
                ])
                .then(axios.spread((...res) => {
                    setCountries(res[0].data?.map(item => new ComboBoxData(item.id,item.name)));
                    setStafs(res[1].data?.map(item => new ComboBoxData(item.id,`${item.name} ${item.surname}`)));
                    setGenres(res[2].data?.map(item => new ComboBoxData(item.id,item.name)));
                    setPremiums(res[3].data?.map(item => new ComboBoxData(item.id,item.name)));
                    setQualities(res[4].data?.map(item => new ComboBoxData(item.id,item.name)));
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
                        .then(axios.spread((...res) => {
                            movie.genres = res[0].data;
                            movie.screenShots = res[1].data;
                            movie.stafs = res[2].data;
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
            stafs: data.stafs?.map(x => x.id),
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
        formData.append('dateDuration', durationDate)

        Object.keys(newmovie).forEach(function (key) {
            if (key !== 'date' && key !== 'duration') {
               
                if (key === 'genres' || key === 'stafs')
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
        <button style={{ border: 0, background: 'none', color:themeToken.colorText }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Завантажити</div>
        </button>
    );

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
                                <Col span={12}>
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

                                <Col span={12}>
                                    <Form.Item
                                    hasFeedback
                                        name="stafs"
                                        label="Актори"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Оберіть акторів'
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Оберіть акторів які приймав участь у фільмі"
                                            allowClear
                                            mode="multiple"
                                            maxTagCount={'responsive'}
                                            options={stafs}
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
