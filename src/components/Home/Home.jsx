import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';
import { MovieCard } from '../MovieCard/MovieCard';
import './Home.css'
import { Button, Empty, Form, Input, Pagination, Select, Space, Spin } from 'antd';
import { paginatorConfig } from '../../helpers/constants';
import { useParams } from 'react-router-dom';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import { dataService } from '../../services/DataService';
import { stafService } from '../../services/StafService';
import { ComboBoxData } from '../../helpers/ComboBoxData';
import { useForm } from 'antd/es/form/Form';

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

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moviesCount, setMoviesCount] = useState(0);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stafs, setStafs] = useState([]);
  const [premiums, setPremiums] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [filter] = useState(new FilterModel())
  const freeMovie = useParams().free || false
  const [simpleFindForm] = Form.useForm()

  useEffect(() => {
    simpleFindForm.resetFields()
    filter.clear();
    if (freeMovie) {
      filter.premiums = [1]
    }
    (async () => {
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
            setStafs(res[1].data);
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

    setLoading(false)
    if (result.status === 200) {
      setMovies(await movieService.setRating(result.data.elements));
      setMoviesCount(result.data.totalCount)
    }
  }



  const simpleFind = async(result) => {
   
    filter.name = result.name || '';
    filter.genres = result.genre? [result.genre]:[] 
    simpleFindForm.resetFields()
    await setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent)
  }


  return (
    <>
      <div className='d-flex flex-column gap-4'>

        <Spin spinning={loading} delay={300} size='large' fullscreen />
        <div className='w-100'>
              <Form
                form={simpleFindForm}
                onFinish={simpleFind}
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
                          width: '70%',
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      name='genre'
                    >
                      <Select
                        size='large'
                        placeholder="Оберіть жанр"
                        style={{ width: '20%'}}
                        allowClear
                        options={genres}/>
                    </Form.Item>

                    <Form.Item noStyle >
                      <Button size='large' htmlType='submit' >Знайти</Button>
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Form>
            </div>
        {movies.length > 0 ?
          <>
            {movies?.map(x => <MovieCard className='movie-card' key={x.id} movie={x} />)}
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
          : <Empty description='Фільми відсутні' />}
      </div>
    </>

  )
}
