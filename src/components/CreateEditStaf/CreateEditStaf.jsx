import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Image, Upload, Checkbox } from 'antd';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { getCountries, getRoles } from '../../helpers/api_helpers/DataAPI';
import { getMovies } from '../../helpers/api_helpers/MovieAPI';
import { createStaf, getStaf, getStafMovies, getStafRoles } from '../../helpers/api_helpers/StafAPI';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import defImage from '../../images/nophoto.jpg'
import TextArea from 'antd/es/input/TextArea';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

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
      imageFile: file
    })
  }, [file])


  useEffect(() => {
    (async () => {
      const cnts = await getCountries();
      if (cnts)
        setCountries(cnts)
      const rls = await getRoles();
      if (rls)
        setRoles(rls);
      const mvs = await getMovies();
      if (mvs)
        setMovies(mvs);
      if (id !== 'create') {
        const stf = await getStaf(id)
        if (stf) {
          stf.movies = await getStafMovies(id)
          stf.roles = await getStafRoles(id)
          setStaf(stf)
          setFormValues(stf, form)
        }
      }
    })()
  }, []);

  const setFormValues = (data, form) => {
    form.setFieldsValue({
      name: data.name,
      surname: data.surname,
      countryId: data.countryId,
      birthdate: dayjs(data.birthdate, dateFormat),
      movies: data.movies.map(x => x.id),
      roles: data.roles.map(x => x.id),
      description: data.description,
      isoscar: data.isOscar
    });
  }

  const [form] = Form.useForm();

  const  onFinish = async() => {
    let newstaf = form.getFieldsValue();
    newstaf.id = staf.id || 0
    newstaf.birthdate = new Date(Date.parse(newstaf.birthdate)).toLocaleDateString()
    let formData = new FormData();
    Object.keys(newstaf).forEach(function (key) {
        if(key!=='imageFile')
           formData.append(key,newstaf[key]);
    });
    formData.append('imageFile',newstaf.imageFile);
    if(newstaf.id===0)
      await createStaf(formData);
   
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
            <Form.Item name="imageFile" label="Фото" >
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
                    rules={[
                      {
                        pattern: '^[A-Z А-Я].*',
                        message:"Ім'я актора повинно починатися з великої букви"
                      },
                      {
                        required:true,
                        message:"Введіть і'мя актора"
                      },
                    ]}
                  >
                    <Input showCount minLength={3} maxLength={100}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="surname" label="Прізвище"
                    rules={[
                      {
                        pattern: '^[A-Z А-Я].*',
                        message:"Прізвище актора повинно починатися з великої букви"
                      },
                      {
                        required: true,
                        message:'Ведіть прізвище актора'
                      },
                    ]}
                  >
                    <Input showCount minLength={3} maxLength={100}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item
                    name="birthdate"
                    label="Дата народження"
                    rules={[
                      {
                        required: true,
                        message: 'Оберіть дату народження'
                      },
                    ]}
                  >
                    <DatePicker className='w-100' maxDate={dayjs(new Date(Date.now), dateFormat)} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
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
                      options={countries.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item
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
                      options={roles.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
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
                      options={movies.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>

              </Row>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Інформація"
                  rules={[
                    {
                      required: true,
                      message: 'Введіть інформацію про актора'
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Коротка інформація про актора"
                    rows={7}
                    showCount 
                    minLength={10}
                    maxLength={3000}
                  />
                </Form.Item>
              </Col>
              <Row>
                <Col span={24}>
                  <Form.Item name='isoscar' valuePropName="checked">
                    <Checkbox defaultChecked={false}>Актор отримав оскар</Checkbox>
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
