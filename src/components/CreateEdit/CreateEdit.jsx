import React from 'react'
import { useParams } from 'react-router';

export const CreateEdit = () => {
    const id = useParams().id;
    if(id !== 'create')
    { console.log('Edit')}
    else
    { console.log('Create')}
  return (
    <div>CreateEdit</div>
  )
}
