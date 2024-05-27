import { ArrowLeftOutlined, CommentOutlined } from '@ant-design/icons'
import { Badge, Button, Divider, Tabs } from 'antd'
import { movieService } from '../../services/MovieService'
import CollapseFeedbacks from '../CollapseFeedbacks/CollapseFeedbacs'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotApprovedFeedbackCount } from '../store/feedbackSlice'

export const AdminFeedbacks = () => {
   
    const notApprovedFeedbacksCount = useSelector(state=>state.notApprovedFeedbacks.count)
    const items = [
        {
            label: 'Всі відгуки',
            key: 'allfeedbacks',
            children: null,
            icon: <CommentOutlined />
        },
        {
            label: <Badge size='small' offset={[15, -5]} count={notApprovedFeedbacksCount > 0 ? notApprovedFeedbacksCount : 0} >
                      <span>Не підтверджені</span>
                   </Badge>,
            key: 'notapproved',
            children: null,
            icon: <CommentOutlined />
        },
    ];
    const dispatcher = useDispatch();
    const [currentTab,setCurrentTab] = useState('allfeedbacks')
    const [tabItems,setTabItems] = useState(items)

    useEffect(()=>{
        (async()=>{
             await onTabChange(currentTab)
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ notApprovedFeedbacksCount])

    useEffect(()=>{
      
        (async()=>{
            const result = await movieService.getNotApprovedFeedbacksCount();
            if(result.status===200){
                dispatcher(setNotApprovedFeedbackCount(result.data))
            }
        })()
       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    const setFeedbacksData = async (id, pageIndex, pageSize) => {
        const result = await movieService.getMovieFeedbacks(id, pageIndex, pageSize);
        if (result.status === 200 && result.data?.elements?.length > 0) {
            return { elements: result?.data?.elements, totalCount: result?.data?.totalCount }
        }
        return { elements: 0, totalCount: 0 };
    }

    const getFeedbacksMovies = async (pageSize, pageIndex) => {
        const result = await movieService.getMoviesWithPagination(pageSize, pageIndex);
        if (result.status === 200) {
             return { totalCount: result.data.totalCount, movies: [...result.data.elements] }
        }
        return null;
    }

    const setNotApprovedFeedbacksData = async (id, pageIndex, pageSize) => {
        const result = await movieService.getNotApprovedMovieFeedbacks(id, pageIndex, pageSize);
        if (result.status === 200 && result.data?.elements?.length > 0) {
            return { elements: result?.data?.elements, totalCount: result?.data?.totalCount }
        }
        return { elements: 0, totalCount: 0 };
    }

    const getNotApprovedFeedbacksMovies = async (pageSize, pageIndex) => {
        const result = await movieService.getMoviesWithNotApprovedFeedbacks(pageSize, pageIndex);
        if (result.status === 200) {
            return { totalCount: result.data.totalCount, movies: [...result.data.elements] }
        }
        return null;
    }
    const allFeedbacks = (
        <CollapseFeedbacks
            deletable
            setFeedbacksData={setFeedbacksData}
            getFeedbacksMovies={getFeedbacksMovies} />);
    const NAFeedbacks = (
        <CollapseFeedbacks
            deletable
            approvable
            hideEmpty
            setFeedbacksData={setNotApprovedFeedbacksData}
            getFeedbacksMovies={getNotApprovedFeedbacksMovies} />)
   
    
    
    const onTabChange = async (key)=>{
        const curentTabIndex  = items.indexOf(items.find(x=>x.key === key))
        switch(key){
            case 'allfeedbacks':
                items[curentTabIndex].children = allFeedbacks;
                break;
            case 'notapproved':
                console.log(items[curentTabIndex])
                items[curentTabIndex].children = NAFeedbacks;
                break;
            default:
                break;     
        }
        setCurrentTab(key);
        items.forEach(x=>x.key !== key && (x.children = null) )
        setTabItems(items)
    }

    return (
        <>
            <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
            <div className='w-75 mx-auto'>
                <Divider className='fs-3  mb-5' orientation="left">Відгуки користувачів</Divider>
                <Tabs
                    defaultActiveKey={currentTab}
                    items={tabItems}
                    size='large'
                    onChange={onTabChange}
                />
            </div>
        </>
    )
}
