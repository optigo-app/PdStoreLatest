import React from 'react'
import queryString from 'query-string';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Card = ({ data, imgPath }) => {
  const navigate = useNavigate();
  let searchArr = queryString.parse(window.location.search);

  const [query, setQuery] = useState(searchArr || {})

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      let q = { ...query }
      if (searchArr.markup === undefined && q.markup === undefined) {
        q['markup'] = 120
      }
      // q['number'] = data.price

      setQuery(q)
      const search = queryString.stringify(q);
      navigate({ search: search })
    }
  }, [data])
  return (
    query?.markup && <div>
      <img src={`${imgPath}${data.MediumImagePath.split(',')[0]}`} className="w-85" />
      <p className='fw-semibold'>{data.design_status}</p>
      <p className='fw-semibold'>${Number(parseFloat(data.price).toFixed(2)) + Number(parseFloat(query?.markup / 100 * Number(parseFloat(data.price).toFixed(2))))}</p>
    </div>
  )
}

export default Card