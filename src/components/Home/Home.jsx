import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';
import { MovieCard } from '../MovieCard/MovieCard';
import './Home.css'
import { Button, Collapse, Empty, Form, Input, Pagination, Select, Space, Spin, Switch } from 'antd';
import { paginatorConfig, selectFilterOption } from '../../helpers/constants';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { dataService } from '../../services/DataService';
import { stafService } from '../../services/StafService';
import { ComboBoxData } from '../../helpers/ComboBoxData';
import { useSelector } from 'react-redux';
import { accountService } from '../../services/AccountService';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

class FilterModel {
  constructor() {
    this.clear()
  }

  clear() {
    this.premiums = []
    this.name = ''
    this.originalName = ''
    this.years = []
    this.qualities = []
    this.countries = []
    this.stafs = []
    this.allStafs = false
    this.genres = []
    this.allGenres = false
  }

}

export const Home = () => {
  const user = useSelector(state => state.user.data);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesCount, setMoviesCount] = useState(0);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stafs, setStafs] = useState([]);
  const [premiums, setPremiums] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [filter] = useState(new FilterModel())
  const freeMovie = useLocation().pathname === '/free'
  const [findForm] = Form.useForm()
  const [userPremiumRate, setUserPremiumRate] = useState(0);
  const [extendedFindFormOpen, setExtendedFindFormOpen] = useState(false);


  useEffect(() => {
    setLoading(true)
    findForm.resetFields()
    filter.clear();
    if (freeMovie) {
      filter.premiums = [1]
    }
    (async () => {
      if (user && !user.isAdmin) {
        const result = await accountService.getPremium(user.email);
        if (result.status === 200) {
          setUserPremiumRate(result.data.rate)
        }
      }
      await axios.all(
        [
          dataService.getCountries(),
          stafService.getAllStaf(),
          dataService.getGenres(),
          dataService.getPremiums(),
          dataService.getQualities(),
        ])
        .then(axios.spread(async (...res) => {
          setCountries(res[0].data?.map(item => new ComboBoxData(item.id, item.name)));
          setStafs(res[1].data?.map(item => new ComboBoxData(item.id, item.name + ' ' + item.surname)));
          setGenres(res[2].data?.map(item => new ComboBoxData(item.id, item.name)));
          setPremiums(res[3].data?.map(item => new ComboBoxData(item.id, item.name)));
          setQualities(res[4].data?.map(item => new ComboBoxData(item.id, item.name)));
        }));
      await setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent)
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeMovie]);


  const handleTableChange = async (pagination, filters) => {
    await setData(filters, pagination);
  };

  const setData = async (pageSize, pageIndex) => {
    setLoading(true);
    const result = await movieService.getFilteredMoviesWithPagination(filter, pageSize, pageIndex);
    if (result.status === 200) {
      setMovies(await movieService.setRating(result.data.elements));
      setMoviesCount(result.data.totalCount)
    }
    setLoading(false)
  }

  const find = async (result) => {

    filter.name = result.name || '';
    filter.genres = result.genre ? result.genre.length ? result.genre : [result.genre] : []
    if (extendedFindFormOpen) {
      filter.originalName = result.originalName || ''
      filter.countries = result.countries || []
      filter.qualities = result.qualities || []
      if (!freeMovie) filter.premiums = result.premiums || []
      filter.stafs = result.stafs || []
      filter.years = result.years?.split(/[.,/ -]/).filter(x => x !== '' && !isNaN(Number(x))) || []
      filter.allGenres = result.allGenres || false
      filter.allStafs = result.allStafs || false
    }
    findForm.resetFields()
    console.log(filter)
    await setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent)
  }
  const onChange = (event) => {
    findForm.resetFields()
    setExtendedFindFormOpen(event.length > 0 ? true : false)
  }

  return (
    <>
      <div className='d-flex flex-column gap-4'>

        <Spin spinning={loading} delay={300} size='large' fullscreen />
        <div className='w-100'>
          <Form
            form={findForm}
            onFinish={find}
            className='mx-auto'
            style={{
              maxWidth: '60%',
            }}
          >

            <Form.Item>
              <Space.Compact block>
                <Form.Item
                  noStyle
                  name='name'
                >
                  <Input
                    placeholder="Пошук фільму по назві"
                    size='large'
                    style={{
                      width: extendedFindFormOpen ? '90%' : '70%',
                    }}

                  />
                </Form.Item>

                {!extendedFindFormOpen
                  && <Form.Item
                    noStyle
                    name='genre'
                  >
                    <Select
                      size='large'
                      placeholder="Оберіть жанр"
                      style={{ width: '20%' }}
                      allowClear
                      options={genres} />
                  </Form.Item>}

                <Form.Item noStyle >
                  <Button size='large' htmlType='submit' >Знайти</Button>
                </Form.Item>
              </Space.Compact>

            </Form.Item>


            {(user && (user?.isAdmin || userPremiumRate > 0))
              && <Collapse
                size="small"
                onChange={onChange}
                items={[
                  {
                    key: '1',
                    label: 'Розширений пошук',
                    children: <>
                      <Form.Item>
                        <div className='d-flex justify-content-around fs-6 text-primary'>
                          <Space size='large'>
                            <span>Всі астори в одному фільмі</span>
                            <Form.Item
                              noStyle
                              name='allStafs'>
                              <Switch
                                style={{ width: 60 }}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                              />
                            </Form.Item>
                          </Space>
                          <Space size='large'>
                            <span>Всі жанри в одному фільмі</span>
                            <Form.Item
                              noStyle
                              name='allGenres'>
                              <Switch
                                style={{ width: 60 }}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                              />
                            </Form.Item>
                          </Space>
                        </div>
                      </Form.Item>
                      <Form.Item>
                        <Space.Compact block>
                          <Form.Item
                            noStyle
                            name='originalName'
                          >
                            <Input
                              placeholder="Оригінальна назва"
                              size='large'
                              style={{
                                width: '50%',
                              }}

                            />
                          </Form.Item>

                          <Form.Item
                            noStyle
                            name='genre'
                          >
                            <Select
                              size='large'
                              mode="multiple"
                              maxTagCount={'responsive'}
                              placeholder="Оберіть жанри"
                              style={{ width: '50%' }}
                              allowClear
                              options={genres}
                              filterOption={selectFilterOption} />
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>

                      <Form.Item>
                        <Space.Compact block>
                          <Form.Item
                            noStyle
                            name='qualities'
                          >
                            <Select
                              size='large'
                              mode="multiple"
                              maxTagCount={'responsive'}
                              placeholder="Оберіть якість відео"
                              style={{ width: freeMovie ? '50%' : '33.33%' }}
                              allowClear
                              options={qualities}
                              filterOption={selectFilterOption} />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name='countries'
                          >
                            <Select
                              size='large'
                              mode="multiple"
                              maxTagCount={'responsive'}
                              placeholder="Оберіть країни"
                              style={{ width: freeMovie ? '50%' : '33.33%' }}
                              allowClear
                              options={countries}
                              filterOption={selectFilterOption} />
                          </Form.Item>

                          {!freeMovie && <Form.Item
                            noStyle
                            name='premiums'
                          >
                            <Select
                              size='large'
                              mode="multiple"
                              maxTagCount={'responsive'}
                              placeholder="Оберіть типи підписок"
                              style={{ width: '33.33%' }}
                              allowClear
                              options={premiums}
                              filterOption={selectFilterOption} />
                          </Form.Item>}
                        </Space.Compact>

                      </Form.Item>

                      <Form.Item>
                        <Space.Compact block>
                          <Form.Item
                            noStyle
                            name='years'
                          >
                            <Input
                              placeholder="Введіть роки (через пробіл або . , / -)"
                              size='large'
                              style={{
                                width: '50%',
                              }}

                            />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name='stafs'
                          >
                            <Select
                              size='large'
                              mode="multiple"
                              maxTagCount={'responsive'}
                              placeholder="Оберіть акторів"
                              style={{ width: '50%' }}
                              allowClear
                              options={stafs}
                              filterOption={selectFilterOption} />
                          </Form.Item>

                        </Space.Compact>

                      </Form.Item>


                    </>
                  },
                ]}

              />}


          </Form>
        </div>
        {movies.length > 0 ?
          <>
            {movies?.map(x => <MovieCard className='movie-card' loading={loading} key={x.id} movie={x} />)}
            <Pagination
              defaultCurrent={paginatorConfig.pagination.defaultCurrent}
              defaultPageSize={paginatorConfig.pagination.defaultPageSize}
              total={moviesCount}
              showTotal={paginatorConfig.pagination.showTotal}
              showSizeChanger
              showQuickJumper
              className=' align-self-center'
              pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
              onChange={handleTableChange}
              locale={paginatorConfig.pagination.locale}
            />
          </>
          : !loading &&   <Empty description='Фільми відсутні' />}
      </div>
    </>

  )
}
