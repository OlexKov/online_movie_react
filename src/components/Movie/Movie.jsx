import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { movieService } from '../../services/MovieService'
import ReactPlayer from 'react-player'
import '../Movie/Movie.css'
import { Button, ConfigProvider, Divider, Form,  Rate, Result, Space,Tabs, Tag, message } from 'antd'
import { CaretRightFilled, CommentOutlined, DollarOutlined, HeartFilled, MutedFilled, PicLeftOutlined, PictureOutlined, SettingOutlined, SoundFilled, TeamOutlined, YoutubeFilled } from '@ant-design/icons'
import { stafService } from '../../services/StafService'
import useToken from 'antd/es/theme/useToken'
import { Carousel } from 'antd';
import { useSelector } from 'react-redux'
import { dataService } from '../../services/DataService'
import TextArea from 'antd/es/input/TextArea'
import { FeedbackTable } from '../FeedbackTable/FeedbackTable'


export const Movie = () => {
    const themeToken = useToken()[1]
    const id = useParams().id
    const [movie, setMovie] = useState(null)
    const [mouted, setMouted] = useState(true)
    const [playUrl, setPlayUrl] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [error, setError] = useState(null)
    const [screens, setScreens] = useState([])
    const [stafs, setStafs] = useState([])
    const [genres, setGenres] = useState([])
    const [stafRoles, setStafRoles] = useState([])
    const [hasFeedback, setHasFeedback] = useState(true);
    const [userPremiumRate, setUserPremiumRate] = useState(0);


    const user = useSelector(state => state.user.data);
    const navigate = useNavigate();
    const description = (
        <div className='d-flex flex-column gap-3'>
            <div className='fs-5 fw-bold'>
                <span>{movie?.date.slice(0, 4)} , </span>
                {genres.map(x => <span>{x.name} , </span>)}
                <span>{movie?.countryName}</span>
            </div>
            <div className='d-flex gap-4 fs-5 fw-bold align-items-center'>
                <Tag className='fs-5 fit-height' icon={<YoutubeFilled />} color="green">{movie?.qualityName}</Tag>
                <span>{movie?.duration}</span>
            </div>
            <p className='fs-6'>{movie?.description}</p>
        </div>

    )

    const screenshots = (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: '#ffffff',
                },
                components: {
                    Carousel: {
                        dotActiveWidth: 45,
                        dotGap: 7,
                        dotHeight: 4,
                        dotWidth: 30,
                        arrowSize: 35
                    },
                },
            }}
        >
            <Carousel
                arrows
                autoplay
                infinite
            >
                {screens.map(x =>
                    <img src={x.name} alt=''></img>
                )}
            </Carousel>
        </ConfigProvider>
    );
    const movieStafs = (
        <div className='d-flex flex-column gap-4'>
            {
                stafRoles.map(role =>
                    <>
                        <Divider style={{ color: themeToken.colorTextDescription, fontSize: 13 }} orientation="left" >{role.toUpperCase()}И</Divider>
                        <div className='d-flex  flex-wrap  gap-5'>
                            {
                                stafs.filter(x => x.movieRoles.includes(role)).map(staf =>
                                    <div className='staf-info-container'>
                                        <img className='staf-image' src={staf.imageName} alt='imageName' />
                                        <div className='d-flex flex-column '>
                                            {(user && (user?.isAdmin || user?.premiumId > 1)) ? <Link to={`/staf/${staf.id}`} className='fs-6 fw-medium'>{staf.name} {staf.surname}</Link>
                                                : <span className='fs-6 fw-medium'>{staf.name} {staf.surname}</span>}
                                            <span style={{ color: themeToken.colorTextDescription }}>{staf.countryName}</span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
    

    const setData = async (pageIndex,pageSize) => {
        const result = await movieService.getMovieFeedbacks(id, pageIndex, pageSize);
        if (result.status === 200 && result.data?.elements?.length > 0) {
            return {elements:result?.data?.elements,totalCount:result?.data?.totalCount}
        }
        return {elements:0,totalCount:0};
    }

    const sendFeedback = async (e) => {
        const formData = new FormData()
        formData.set('userId', user.id)
        formData.set('text', e.feedback)
        formData.set('rating', e.movierate)
        formData.set('movieId', id)
        formData.set('date', new Date().toLocaleTimeString())
        const result = await movieService.addFeedback(formData);
        if (result.status === 200) {
            message.success('Відгук буде додано після модерації ...')
            setHasFeedback(true)
        }
    }

    const movieFeedbacks = (
        <div className='text-center'>
            {(user && !user?.isAdmin && userPremiumRate >= movie?.premiumRate && !hasFeedback) &&
                <Form onFinish={sendFeedback} className='feedbackwindow'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h6 style={{ color: themeToken.colorTextDescription, fontWeight: 'normal' }}>Залиште свій відгук </h6>
                        <Form.Item
                            name="movierate"
                            style={{ padding: '0', margin: '0' }}
                        >
                            <Rate count={6} allowHalf={true} allowClear></Rate>
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="feedback"
                        style={{ padding: '0', margin: '0' }}
                        rules={[
                            {
                                required: true,
                                message: 'Введіть текст відгуку...'
                            },
                            {
                                min: 20,
                                message: 'Відгук має містити не менше 20 символів'
                            },
                            {
                                max: 1000,
                                message: 'Відгук має містити не більше 1000 символів'
                            },
                        ]}
                    >
                        <TextArea
                            showCount
                            maxLength={1000}
                            minLength={20}
                            autoSize={{
                                minRows: 8,
                                maxRows: 8,
                            }}
                            placeholder='Ваш відгук....' allowHalf>
                        </TextArea>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className=' mt-3 align-self-end'>Відправити</Button>
                </Form>}
                <FeedbackTable deletable={user?.isAdmin} dataloader={setData}/>
        </div>
    );

    const tabItems = [
        {
            label: 'Опис',
            key: 'description',
            children: description,
            icon: <PicLeftOutlined />
        },
        {
            label: 'Персони та комaнди',
            key: 'stafs',
            children: movieStafs,
            icon: <TeamOutlined />
        },
        {
            label: 'Скриншоти',
            key: 'screens',
            children: screenshots,
            icon: <PictureOutlined />
        },
        {
            label: 'Відгуки',
            key: 'feedbacks',
            children: movieFeedbacks,
            icon: <CommentOutlined />,
        },
    ]

    useEffect(() => {
        let roles = [];
        stafs.forEach(staf => {
            roles.push(...staf.movieRoles)
        })
        setStafRoles([...new Set(roles)].sort())
    }, [stafs]);


    useEffect(() => {
        (async () => {
            let result = await movieService.getMovie(id)
            if (result.data) {
                result.data.rating = (await movieService.getRating(result.data.id)).data
                setMovie(result.data)
                setPlayUrl(result.data.trailerUrl)
            }
            result = await movieService.getMovieGenres(id)
            if (result.status === 200)
                setGenres(result.data)
            if (user && !user.isAdmin) {
                result = await dataService.getPremium(user.premiumId);
                if (result.status === 200) {
                    setUserPremiumRate(result.data.rate)
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const config = {
        youtube: {
            playerVars: {
                showinfo: 0,
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                playsinline: 0
            }
        },
        file: {
            attributes: {
                controlsList: 'nodownload'
            }
        }
    }
    const soundSwith = () => {
        setMouted(!mouted)
    }
    const playMovie = () => {
        setPlayUrl(movie.movieUrl)
        setIsPlaying(true)
        setMouted(false)
    }

    const onError = (error) => {
        setError(error)
    }

    const resetError = () => {
        setError(null)
        setPlayUrl(movie.trailerUrl)
        setIsPlaying(false)
        setMouted(true)
    }



    const onChange = async (value) => {
        switch (value) {
            case 'stafs':
                if (stafs.length === 0) {
                    const result = await movieService.getMovieStafs(id);
                    if (result.status === 200) {
                        const tempStafs = await stafService.setMovieRoles(result.data, id);
                        tempStafs.forEach(x => {
                            x.movieRoles = x.movieRoles.map(z => z.name);
                        })
                        setStafs(tempStafs)
                    }
                }
                break;
            case 'screens':
                if (screens.length === 0) {
                    const result = await movieService.getMovieScreens(id);
                    if (result.status === 200) {
                        setScreens(result.data)
                    }
                }
                break;
            case 'feedbacks':
                //if (feedbacks.length === 0) {
                  //  setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent)
               // }
                if (user) {
                    const result = await movieService.hasFeedback(id, user?.id);
                    if (result.status === 200) {
                        setHasFeedback(result.data)
                    }
                }

                break;
            default:
                break;
        }
    }

    return (
        <div className='movie-page-content'>
            {user?.isAdmin && <Button className='free-button' type="primary" onClick={() => navigate(`/create-edit-movie/${id}`)} icon={<SettingOutlined />}>Редагувати</Button>}
            <div className="player" >
                {!isPlaying &&
                    <div className='mask'>
                        <div className='mouteButton' onClick={soundSwith}>
                            {mouted ? <MutedFilled /> : <SoundFilled />}
                        </div>
                        <div className='info-container'>
                            <img src={movie?.poster} alt='poster' />
                            <div className='info-content'>
                                <Rate disabled allowHalf count={6} value={movie?.rating} />
                                <div className=' d-flex gap-2 align-items-center'>
                                    <Tag icon={<DollarOutlined />} color="yellow">{movie?.premiumName}</Tag>
                                    <Tag icon={<YoutubeFilled />} color="green">{movie?.qualityName}</Tag>
                                    <span className=' fw-bold'>{movie?.originalName}</span>

                                </div>
                                <h2>{movie?.name}</h2>
                                <Space>
                                    <Button type="primary" onClick={user?.isAdmin || movie?.premiumRate <= userPremiumRate ? playMovie : null} danger icon={<CaretRightFilled />} size='large'>
                                        {user?.isAdmin || movie?.premiumRate <= userPremiumRate ? "Дивитися" : `Придбати підписку "${movie?.premiumName}"`}</Button>
                                    {user && !user?.isAdmin && <Button danger style={{ backgroundColor: 'transparent' }} icon={<HeartFilled />} size='large'>Додати в обране</Button>}
                                </Space>

                            </div>
                        </div>
                    </div>}
                {!error
                    ? <>
                        {isPlaying && <h3>{`${movie.name} (${movie.originalName})`}</h3>}
                        <ReactPlayer
                            config={config}
                            width='100%'
                            height='100%'
                            muted={mouted}
                            playing={isPlaying}
                            controls={isPlaying}
                            url={playUrl}
                            onError={onError}
                            loop />
                    </>
                    : <Result
                        status="error"
                        title="Помилка при спробі відобразити відео"
                        subTitle={`Відео за адресою "${error?.target?.currentSrc}" не доступне`}
                        extra={[
                            <Button onClick={resetError} type="primary" key="console">
                                Повернутися
                            </Button>,
                        ]}
                    />}
            </div>
            <Tabs
                defaultActiveKey="1"
                size='large'
                style={{ marginBottom: 32 }}
                items={tabItems}
                className=' mx-5'
                onChange={onChange}
            />
        </div>

    )
}
