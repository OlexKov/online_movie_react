import { Collapse, Empty, Pagination, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { paginatorConfig } from '../../helpers/constants'
import { FeedbackTable } from '../FeedbackTable/FeedbackTable'

const CollapseFeedbacks = ({ setFeedbacksData, getFeedbacksMovies, deletable, approvable, hideEmpty }) => {
    const [elements, setElements] = useState([])
    const [elementsCount, setElementsCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            await onPaginatorChange(paginatorConfig.pagination.defaultCurrent, paginatorConfig.pagination.defaultPageSize)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {

    }, [elements])

    const onPaginatorChange = async (pageIndex, pageSize) => {
        setLoading(true)
        const result = await getFeedbacksMovies(pageSize, pageIndex);
        const items = result?.movies?.map(x => ({
            key: x.id,
            label: <>
                <img style={{ height: '60px' }} src={x.poster} alt='' />
                <span className=' mx-3'>{x.name} ({x.originalName})</span>
            </>,
            children: null

        }))
        setElements(items || []);
        setElementsCount(result?.totalCount || 0);
        setLoading(false)
    }
    const onChange = (keys) => {
        if (keys?.length === 0) return;
        const tempElements = [...elements];
        //eslint-disable-next-line eqeqeq
        const index = elements.indexOf(elements.find(x => x.key == keys[0]))
        tempElements[index].children = <FeedbackTable deletable={deletable} onFeedBackChange={onFeedbackChange} approvable={approvable} dataloader={(pageSize, pageIndex) => setFeedbacksData(keys[0], pageSize, pageIndex)} />
        setElements(tempElements)
    }

    const onFeedbackChange = async (key, count) => {
        if (count === 0 && hideEmpty) {
            const elementsList = elements.filter(x => x.key !== key);
            const newCount = elementsCount - 1;
            if (newCount !== 0 && newCount > elementsList.length) {
                await onPaginatorChange(paginatorConfig.pagination.defaultCurrent, paginatorConfig.pagination.defaultPageSize)
            }
            else {
                setElements(elementsList)
                setElementsCount(newCount)
            }
        }
    }


    return (
        <>
            <Spin spinning={loading} delay={300} size='large' />
            {elements.length > 0 ?
                <div className='d-flex flex-column'>
                     <Collapse accordion onChange={onChange} items={elements} />
                    <Pagination
                        defaultCurrent={paginatorConfig.pagination.defaultCurrent}
                        defaultPageSize={paginatorConfig.pagination.defaultPageSize}
                        total={elementsCount}
                        showTotal={paginatorConfig.pagination.showTotal}
                        showSizeChanger
                        showQuickJumper
                        className='mt-3 align-self-end'
                        pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                        onChange={onPaginatorChange}
                        locale={paginatorConfig.pagination.locale} />
                </div>
                : !loading && <Empty />}
        </>
    )
}

export default CollapseFeedbacks