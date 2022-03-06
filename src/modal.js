import React, { useState } from 'react'
import * as ReactDOM from "react-dom";
import MdModal from './components/modal';

const App = () => {
    const [isModalVisible, setIsModalVisible] = useState(true);
  
    const handleOk = () => {
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
    return (
      <MdModal visible={isModalVisible}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </MdModal>
    );
  };
  
  ReactDOM.render(<App />, document.getElementById("mdcode"));