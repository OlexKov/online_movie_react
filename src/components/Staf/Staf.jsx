import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { stafService } from '../../services/StafService';
import '../Staf/Staf.css'
import useToken from 'antd/es/theme/useToken';
import axios from 'axios';
import oscar from '../../images/oscar.png'
import { SmallMovieCard } from '../SmallMovieCard/SmallMovieCard';
import { useSelector } from 'react-redux';

export const Staf = () => {
    const { stafId } = useParams();
    const [staf, setStaf] = useState(null);
    const [movies, setMovies] = useState(null);
    const theme = useToken()[1];
    const user = useSelector(state=>state.user.data);
    const navigate  = useNavigate()
    useEffect(() => {
        (async () => {
            await axios.all(
                [
                    stafService.getStaf(stafId),
                    stafService.getStafRoles(stafId),
                    stafService.getStafMovies(stafId)
                ])
                .then(axios.spread(async (...res) => {
                    res[0].data.roles = res[1].data;
                    setStaf(res[0].data);
                    setMovies(res[2].data)
                }));
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        {user?.isAdmin && <Button className='free-button' type="primary" onClick={() => navigate(`/create-edit-staf/${stafId}`)} icon={<SettingOutlined />}>Редагувати</Button>}
            <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
            <div className='w-75 mx-auto'>
                <Divider className='about-staf-divider fs-3' orientation="left">{staf?.name} {staf?.surname}</Divider>
                <div className='main-container' >
                    <div className='about-staf' style={{ background: theme.colorBgContainerDisabled }}>
                        <div className='d-flex flex-column gap-3'>
                            <div className='staf-info'>
                                {staf?.roles.map(x => <span className='value text-info'>{x.name}</span>)}
                            </div>
                            <div className='staf-info'>
                                <span className='title'>Країна:</span>
                                <span className='value'>{staf?.countryName}</span>
                            </div>
                            <div className='staf-info'>
                                <span className='title'>Дата народження:</span>
                                <span className='value'>{staf?.birthdate.slice(0, 10)}</span>
                            </div>
                            <div className='staf-info'>
                                <span className='value'>{staf?.description}</span>
                            </div>
                        </div>
                        {staf?.isOscar && <img src={oscar} alt='' />}
                    </div>
                    <div className='staf-image-container text-center' style={{ backgroundImage: `url(${staf?.imageName})` }} />
                </div>
                <Divider className='about-staf-divider fs-3' orientation="left">Фільмографія</Divider>
                {movies?.length > 0 &&
                    <div style={{ background: theme.colorBgContainerDisabled }} className='staf-movie-container'>
                           {movies.map(x=>
                           <SmallMovieCard movie={x}/>)} 
                    </div>}
        </div>
        </>

    )
}
