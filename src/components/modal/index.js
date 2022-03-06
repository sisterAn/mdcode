import React, { useState, useEffect } from 'react'
import closePng from '../../../imgs/close-icon.png'
import { Button } from 'antd';
import './index.less'

// const iconUrl = window.chrome.runtime.getURL('/imgs/close-icon.png')

const MdModal = (props) => {
  const [visible, setVisible] = useState(true);

  useEffect(()=>{
    updateVis(true)
  }, [])

  const handleOk = () => {
    setVisible(false)
    updateVis(false)
    props?.onOk?.()
  };

  const handleCancel = () => {
    setVisible(false)
    updateVis(false)
    props?.onCancel?.()
  };

  const updateVis = (visible) => {
    let con = document.querySelector('.md-modal-wrap')
    console.log('------visible: ', visible)
    con.style.display = visible ? 'block' : 'none'
  }

  return (
    <div className='md-modal'>
      <div className='md-modal-wrap'>
        <div className='md-modal-con'>
          <img className='close-icon' src={closePng} onClick={handleCancel} />
          <div className='md-modal-title'>{props.title}</div>
          <div className='md-modal-content'>{props.children}</div>
          <div className='md-modal-footer'>
            <Button type="primary" onClick={handleOk}>{props.okText}</Button>
            <Button type="primary" onClick={handleCancel} style={{marginLeft: 20}}>{props.cancelText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MdModal