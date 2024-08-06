import { Button, message as messageApi, Upload, UploadProps, Progress } from "antd";
import OpenSeadragonViewer from "../components/OpenSeaDragonViewer";
import axios from 'axios';
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';

export function WSIPrediction() {
  const [tileSource, setTileSource] = useState(null);
  const [wsiList, setWsiList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const featchWsiList = async () => {
    axios.get('http://10.130.128.52:10023/api/multimodal/wsi_lists')
      .then(res => {
        setWsiList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
  useEffect(() => {
    featchWsiList();
  }, []);

  const handleSelectChange = (event) => {
    const selectedWsi = event.target.value;
    setTileSource(selectedWsi);
  };

  const handlePrediction = () => {
    const loadingMessage = messageApi.loading('Action in progress..', 0);
    axios.post('http://10.130.128.52:10023/api/multimodal/prediction')
      .then(res => {
        loadingMessage();
        console.log(res.data);
        messageApi.success(`Prediction successful, result: ${res.data.result}`);
      })
      .catch(err => {
        loadingMessage();
        console.log(err);
        messageApi.error('Prediction failed. Please try again.');
      });
  };

  const handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      messageApi.success(`Upload successful: ${file.name}`);
    } else if (file.status === 'error') {
      messageApi.error(`Upload failed: ${file.name}`);
    }
    setFileList(fileList);
  };

  const handleUploadProgress = (event) => {
    const percent = Math.round((event.loaded / event.total) * 100);
    setUploadProgress(percent);
  };

  const beforeUpload = (file) => {
    const isValidType = ['svs', 'ndpi'].includes(file.name.split('.').pop().toLowerCase());
    if (!isValidType) {
      messageApi.error('You can only upload SVS or NDPI files!');
    }
    return isValidType;
  };

  const uploadProps = {
    name: 'file',
    action: 'http://10.130.128.52:10023/api/wsi/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    beforeUpload,
    onChange: handleUploadChange,
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post('http://10.130.128.52:10023/api/wsi/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: handleUploadProgress
        });
        onSuccess?.(file);
        await featchWsiList();
      } catch (err) {
        onError?.(err);
      }
    },
    showUploadList: false, // Hide upload list
    fileList: fileList,
  };

  return (
    <div style={styles.container}>
      <label htmlFor="wsi-select" style={styles.label}>Select pathology image:</label>
      <select id="wsi-select" onChange={handleSelectChange} style={styles.select}>
        <option value="">Please select a pathology image</option>
        {wsiList.map((wsi, index) => (
          <option key={index} value={wsi.wsi_name}>
            {wsi.label} - {wsi.wsi_name}
          </option>
        ))}
      </select>
      <div style={styles.viewerContainer}>
        {tileSource && <OpenSeadragonViewer tileSource={tileSource} />}
      </div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} style={styles.button}>Upload File</Button>
      </Upload>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} style={styles.progress} />
      )}
      <Button type="primary" style={styles.button} onClick={handlePrediction}>Predict</Button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
  },
  viewerContainer: {
    width: '100%',
    height: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  button: {
    marginLeft: '8px',
  },
  progress: {
    marginTop: '10px',
  },
};
