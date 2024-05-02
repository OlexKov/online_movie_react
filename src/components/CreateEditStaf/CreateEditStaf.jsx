/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Image, Upload, Checkbox, message } from 'antd';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { dataService } from '../../services/DataService';
import { movieService } from '../../services/MovieService';
import { stafService } from '../../services/StafService';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import defImage from '../../images/nophoto.jpg'
import axios from 'axios';
import { dateFormat } from '../../helpers/constants';
import { ComboBoxData } from '../../helpers/ComboBoxData';
import { dummyRequest } from '../../helpers/methods';
dayjs.extend(customParseFormat);

export const CreateEditStaf = () => {

  const id = useParams().id;
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [staf, setStaf] = useState([]);
  const [movies, setMovies] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [file, setFile] = useState()

  useEffect(() => {
    if (file) {
      (async () => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
      })()

    }
    else
      setPreviewImage(null);
    form.setFieldsValue({
      imageFile: file?.originFileObj
    })
  }, [file])

  // const normFile = (e) => {
  //   console.log(e.fileList)
  //   if (Array.isArray(e)) {
  //     return e
  //   }
  //   return e && e?.fileList
  // }
  useEffect(() => {
    (async () => {
      await axios.all(
        [
          dataService.getCountries(),
          dataService.getRoles(),
          movieService.getMovies()
        ])
        .then(axios.spread((...res) => {
          setCountries(res[0].data?.map(item => new ComboBoxData(item.id, item.name)));
          setRoles(res[1].data?.map(item => new ComboBoxData(item.id, item.name)));
          setMovies(res[2].data?.map(item => new ComboBoxData(item.id, item.name)));
        }));
      if (id !== 'create') {
        const stf = (await stafService.getStaf(id)).data
        if (stf) {
          await axios.all(
            [
              stafService.getStafMovies(id),
              stafService.getStafRoles(id)
            ])
            .then(axios.spread((...res) => {
              stf.movies = res[0].data;
              stf.roles = res[1].data;
            }));
          setStaf(stf)
          setFormValues(stf, form)
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormValues = (data, form) => {
    form.setFieldsValue({
      name: data.name,
      surname: data.surname,
      countryId: data.countryId,
      birthdate: data.birthdate ? dayjs(data.birthdate, dateFormat) : null,
      movies: data.movies?.map(x => x.id),
      roles: data.roles?.map(x => x.id),
      description: data.description,
      isoscar: data.isOscar
    });
  }

  const [form] = Form.useForm();

  const onFinish = async () => {
    let newstaf = form.getFieldsValue();
    newstaf.id = staf.id || 0
    newstaf.isoscar = newstaf.isoscar ? true : false
    newstaf.birthdate = new Date(Date.parse(newstaf.birthdate)).toLocaleDateString()
    let formData = new FormData();
    Object.keys(newstaf).forEach(function (key) {
      if (key === 'roles' || key === 'movies')
        newstaf[key].forEach(x => formData.append(key, x))
      formData.append(key, newstaf[key]);
    });

    if (newstaf.id === 0) {
      const responce = await stafService.createStaf(formData)
      if (responce?.status === 200) {
        message.success(`Актор "${newstaf.name} ${newstaf.surname}" успішно доданий до бази даних`);
        window.history.back()
      }
    }
    else {
      formData.append('imageName', staf.imageName);
      const responce = await stafService.updateStaf(formData)
      if (responce?.status === 200) {
        message.success(`Інформація актора "${newstaf.name} ${newstaf.surname}" успішно змінена`);
        window.history.back()
      }
    }

  }

  const onReset = () => {
    setFormValues(staf, form);
    setFile(null);
  }

  const handleChange = async ({ file: newFile }) => {
    if (newFile.status === 'removed')
      newFile = null
    setFile(newFile);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  return (
    <>
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />

      <div className='w-75 mx-auto'>
        <Divider className='fs-3  mb-5 text-black-50' orientation="left">{id === 'create' ? 'Новий актор' : 'Редагування'}</Divider>
        <Form layout='vertical' form={form} name="control-hooks" onFinish={onFinish}
          className='mx-auto d-flex flex-column gap-2'>
          <div className="d-flex gap-5">
            <Form.Item name="imageFile"
              label="Фото"
            >
              <div style={{ width: 290 }}>
                <Image
                  style={{ objectFit: 'cover' }}
                  width={290}
                  height={430}
                  fallback={staf.imageName || defImage}
                  src={previewImage}
                  preview={false}
                  className=' rounded-3'
                />
                <Upload
                  listType="text"
                  onChange={handleChange}
                  maxCount={1}
                  customRequest={dummyRequest}
                >
                  <Button style={{ width: 290, marginTop: 25 }} type="primary" icon={<UploadOutlined />}>
                    Завантажити фото
                  </Button>
                </Upload>
              </div>
            </Form.Item>
            <div className='form-grid w-100'>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item name="name" label="Ім'я"
                  hasFeedback
                    rules={[
                      {
                        pattern: '^[A-Z А-Я].*',
                        message: "Ім'я актора повинно починатися з великої букви"
                      },
                      {
                        required: true,
                        message: "Введіть і'мя актора"
                      },
                    ]}
                  >
                    <Input showCount minLength={3} maxLength={100} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="surname" label="Прізвище"
                  hasFeedback
                    rules={[
                      {
                        pattern: '^[A-Z А-Я].*',
                        message: "Прізвище актора повинно починатися з великої букви"
                      },
                      {
                        required: true,
                        message: 'Ведіть прізвище актора'
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
                    name="birthdate"
                    label="Дата народження"
                    rules={[
                      {
                        required: true,
                        message: 'Оберіть дату народження'
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
                      placeholder="Оберіть країну де народився актор"
                      allowClear
                      options={countries}
                    />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item
                  hasFeedback
                    name="roles"
                    label="Ролі"
                    rules={[
                      {
                        required: true,
                        message: 'Оберіть ролі'
                      },
                    ]}
                  >
                    <Select
                      placeholder="Оберіть які ролі викопував актор"
                      allowClear
                      mode="multiple"
                      maxTagCount={'responsive'}
                      options={roles}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                  hasFeedback
                    name="movies"
                    label="Фільми"
                    rules={[
                      {
                        required: true,
                        message: 'Оберіть фільми'
                      },
                    ]}
                  >
                    <Select
                      placeholder="Оберіть фільми в яких приймав участь актор"
                      allowClear
                      mode="multiple"
                      maxTagCount={'responsive'}
                      options={movies}
                    />
                  </Form.Item>
                </Col>

              </Row>
              <Col span={24}>
                <Form.Item
                hasFeedback
                  name="description"
                  label="Інформація"
                  rules={[
                    {
                      required: true,
                      message: 'Введіть інформацію про актора'
                    },
                    {
                      min: 20,
                      message: 'Опис має містити не менше 20 символів'
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Коротка інформація про актора"
                    rows={7}
                    showCount
                    maxLength={3000}
                  />
                </Form.Item>
              </Col>
              <Row>
                <Col span={24}>
                  <Form.Item name='isoscar' hasFeedback valuePropName="checked">
                    <Checkbox >Актор отримав оскар</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
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
