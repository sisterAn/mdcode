import React, { useState } from 'react'
import * as ReactDOM from "react-dom";
import MdModal from './components/modal';
import { Button } from 'antd'
import { accesscof } from '../public/config'

const Setting = () => {
  
    const handleOk = () => {
      window.open('https://github.com/sisterAn/mdcode/issues')
    };
  
    return (
      <MdModal 
        title='支持平台'
        okText='申请支持更多平台'
        cancelText='知道了'
        onOk={handleOk}
      >
        <div style={{flex: 1, marginTop: 20}}>
          {Object.keys(accesscof).map((key) => {
            return (
              <Button type='primary' onClick={()=>{window.open(accesscof[key]?.link)}} style={{marginRight: 10, marginBottom: 10}}> 
                {accesscof[key]?.name}
              </Button>
            )
          })}
        </div>
      </MdModal>
    );
  };

// export default Setting
ReactDOM.render(<Setting />, document.getElementById("mdcode"));