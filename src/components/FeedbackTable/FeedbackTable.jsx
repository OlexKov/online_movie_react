import React, { useEffect, useState } from 'react'
import { FeedbackCard } from '../FeedbackCard/FeedbackCard'
import { Empty, Spin, message } from 'antd'
import { paginatorConfig } from '../../helpers/constants'
import { movieService } from '../../services/MovieService'
import { useDispatch, useSelector } from 'react-redux'
import { setNotApprovedFeedbackCount } from '../store/feedbackSlice'
import { AppPagination } from '../AppPagination/AppPagination'

export const FeedbackTable = ({onFeedBackChange, dataloader,deletable,approvable}) => {
    const [loading, setLoading] = useState(false);
    const [feedbackCount, setFeedbackCount] = useState(0)
    const [feedbacks, setFeedbacks] = useState([])
    const [pagesize, setPageSize] = useState([])
    const notApprovedFeedbacksCount = useSelector(state=>state.notApprovedFeedbacks.count)
    const dispatcher = useDispatch();
      
    useEffect(()=>{
      (async()=>{
       await onChange(paginatorConfig.pagination.defaultCurrent,paginatorConfig.pagination.defaultPageSize)
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const onChange = async (pageIndex,pageSize)=>{
        setPageSize(pageSize)
        setLoading(true);
         const result =   await dataloader(pageIndex,pageSize)
         setFeedbackCount(result.totalCount)
         setFeedbacks(result.elements)
        setLoading(false);
    }
    
    const deleteFeedback = async (id) =>{
        const feedbackMovieId = feedbacks.find(x=>x.id === id).movieId;
        const feedbacksList = feedbacks.filter(x=>x.id !== id);
        setFeedbacks(feedbacksList);
        setFeedbackCount(feedbackCount -1)
        if(approvable){
            dispatcher(setNotApprovedFeedbackCount(notApprovedFeedbacksCount-1))
        }
        if(onFeedBackChange)
           await onFeedBackChange(feedbackMovieId,feedbacksList.length)
    }

    const onDelete = async(id) => {
      const result = await  movieService.deleteFeedback(id); 
      if(result.status===200){
          await deleteFeedback(id)
          message.success('Відгук успішно видалено....')
      }
    }
    const onApprove = async (id) => {
        const result = await  movieService.approveFeedback(id); 
        if(result.status===200){
            await deleteFeedback(id)
            message.success('Відгук одобрено....')
        }
    }

    return (
        <>
            <Spin spinning={loading} delay={300} size='large' />
            { feedbacks.length > 0
                ? <div className='d-flex flex-column'>
                    {feedbacks.map(x => <FeedbackCard {...x} onDelete={deletable ? onDelete : null} onApprove={approvable?onApprove:null} />)}
                    <AppPagination onChange={ onChange} total={feedbackCount}  pageSize={pagesize}/>
                  </div>
                : !loading && <Empty />}
                 
        </>
    )
}
